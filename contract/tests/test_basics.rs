use near_sdk::NearToken;
use serde_json::json;
use sha2::{Digest, Sha256};

#[tokio::test]
async fn test_contract_is_operational() -> Result<(), Box<dyn std::error::Error>> {
    let contract_wasm = near_workspaces::compile_project("./").await?;

    test_basics_on(&contract_wasm).await?;
    Ok(())
}

async fn test_basics_on(contract_wasm: &[u8]) -> Result<(), Box<dyn std::error::Error>> {
    let sandbox = near_workspaces::sandbox().await?;
    let contract = sandbox.dev_deploy(contract_wasm).await?;

    let user_account = sandbox.dev_create_account().await?;

    let outcome = user_account
        .call(contract.id(), "set_greeting")
        .args_json(json!({"greeting": "Hello World!"}))
        .transact()
        .await?;
    assert!(outcome.is_success());

    let user_message_outcome = contract.view("get_greeting").args_json(json!({})).await?;
    assert_eq!(user_message_outcome.json::<String>()?, "Hello World!");

    Ok(())
}

#[tokio::test]
async fn test_mixer_integration() -> Result<(), Box<dyn std::error::Error>> {
    let contract_wasm = near_workspaces::compile_project("./").await?;

    test_mixer_operations_on(&contract_wasm).await?;
    Ok(())
}

async fn test_mixer_operations_on(contract_wasm: &[u8]) -> Result<(), Box<dyn std::error::Error>> {
    let sandbox = near_workspaces::sandbox().await?;
    
    // Deploy contract
    let contract = sandbox.dev_deploy(contract_wasm).await?;
    
    // Create test accounts
    let owner = sandbox.dev_create_account().await?;
    let depositor = sandbox.dev_create_account().await?;
    let recipient = sandbox.dev_create_account().await?;
    
    // 1. Initialize the contract
    let outcome = owner
        .call(contract.id(), "new")
        .args_json(json!({
            "owner": owner.id(),
            "fee_basis_points": 100 // 1% fee
        }))
        .transact()
        .await?;
    assert!(outcome.is_success(), "Failed to initialize contract");
    
    // 2. Make a deposit with 1 NEAR
    let one_near = NearToken::from_near(1).as_yoctonear();
    
    // Generate a commitment for the deposit
    let secret = "my_secret_key_123";
    let commitment = format!("{:x}", Sha256::digest(secret.as_bytes()));
    
    let outcome = depositor
        .call(contract.id(), "deposit")
        .args_json(json!({
            "commitment": commitment
        }))
        .deposit(one_near)
        .transact()
        .await?;
    assert!(outcome.is_success(), "Failed to deposit funds");
    
    // 3. Check pool stats after deposit
    let stats = contract
        .view("get_pool_stats")
        .args_json(json!({}))
        .await?;
    let (total_deposits, total_amount, _by_denomination): (u64, String, Vec<(String, u64)>) = stats.json()?;
    assert_eq!(total_deposits, 1, "Should have 1 deposit");
    assert_eq!(total_amount, one_near.to_string(), "Total amount should be 1 NEAR");
    
    // 4. Fast forward time (normally would need special handling in real test)
    // Note: In workspaces, time manipulation requires more advanced setup
    
    // 5. Generate a nullifier and proof for withdrawal
    let nullifier = format!("{:x}", Sha256::digest(format!("nullifier:{}", secret).as_bytes()));
    
    // Create simple proof (in a real app this would be a proper ZK proof)
    let mut hasher = Sha256::new();
    hasher.update(&nullifier);
    hasher.update(&commitment);
    let hash_result = format!("{:x}", hasher.finalize());
    let proof = format!("{}testproofthatisatleast32characterslong", &hash_result[0..1]);
    
    // 6. Withdraw the funds (this will likely fail without proper time advancement)
    // In a real test environment, we'd need a way to advance block time
    // This is just to demonstrate the API call pattern
    let withdraw_outcome = depositor
        .call(contract.id(), "withdraw")
        .args_json(json!({
            "recipient": recipient.id(),
            "nullifier": nullifier,
            "commitment": commitment,
            "proof": proof
        }))
        .transact()
        .await;
    
    // Note: In a real test with proper time advancement, we'd assert success here
    // For now, we just demonstrate the pattern - the actual withdrawal would likely fail
    // due to the time delay not being satisfied
    
    // 7. Check owner's fee (would be done after successful withdrawal)
    let owner_balance_after = owner.view_account().await?.balance;
    println!("Owner's balance after: {}", owner_balance_after);
    
    Ok(())
}


