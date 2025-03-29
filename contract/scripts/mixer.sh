#!/bin/bash

set -e

NEAR_ACCOUNT=""
CONTRACT_ID=""
NETWORK="testnet"

# Helper function for generating hashes and secrets
generate_secret() {
    # Generate a random secret that's more secure than just RANDOM
    openssl rand -hex 16 > .mixer_secret.txt
    echo "Secret saved to .mixer_secret.txt"
    cat .mixer_secret.txt
}

generate_commitment_hash() {
    if [ ! -f .mixer_secret.txt ]; then
        echo "Error: No secret found. Please generate a secret first."
        exit 1
    fi
    
    local secret=$(cat .mixer_secret.txt)
    echo -n "$secret" | openssl dgst -sha256 -hex | sed 's/^.* //'
}

# Main functions
print_help() {
    echo "NEAR Mixer CLI"
    echo ""
    echo "Usage:"
    echo "  $0 init <your-account> <contract-id> [network]  - Initialize CLI"
    echo "  $0 deploy                                       - Deploy the contract"
    echo "  $0 secret                                       - Generate a new secret"
    echo "  $0 deposit <amount>                             - Deposit NEAR to the mixer"
    echo "  $0 withdraw <recipient>                         - Withdraw NEAR to an account"
    echo "  $0 stats                                        - Show mixer pool statistics"
    echo ""
    echo "Examples:"
    echo "  $0 init alice.testnet mixer.alice.testnet testnet"
    echo "  $0 deploy"
    echo "  $0 secret"
    echo "  $0 deposit 1"
    echo "  $0 withdraw bob.testnet"
}

init() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        echo "Error: Missing parameters. Usage: $0 init <your-account> <contract-id> [network]"
        exit 1
    fi
    
    NEAR_ACCOUNT="$1"
    CONTRACT_ID="$2"
    
    if [ ! -z "$3" ]; then
        NETWORK="$3"
    fi
    
    echo "NEAR_ACCOUNT=$NEAR_ACCOUNT" > .mixer_config
    echo "CONTRACT_ID=$CONTRACT_ID" >> .mixer_config
    echo "NETWORK=$NETWORK" >> .mixer_config
    
    echo "Mixer CLI initialized:"
    echo "  Account: $NEAR_ACCOUNT"
    echo "  Contract: $CONTRACT_ID"
    echo "  Network: $NETWORK"
}

load_config() {
    if [ ! -f .mixer_config ]; then
        echo "Error: CLI not initialized. Run '$0 init <your-account> <contract-id> [network]' first."
        exit 1
    fi
    
    source .mixer_config
}

deploy_contract() {
    load_config
    
    echo "Building contract..."
    cargo build --target wasm32-unknown-unknown --release
    
    echo "Deploying contract to $CONTRACT_ID on $NETWORK..."
    near deploy --accountId $NEAR_ACCOUNT --wasmFile target/wasm32-unknown-unknown/release/near_mixer.wasm --networkId $NETWORK
    
    echo "Initializing contract..."
    near call $CONTRACT_ID new "{\"owner\": \"$NEAR_ACCOUNT\", \"fee_basis_points\": 100}" --accountId $NEAR_ACCOUNT --networkId $NETWORK
    
    echo "Contract deployed and initialized!"
}

create_secret() {
    generate_secret
    echo ""
    echo "New secret created and saved to .mixer_secret.txt"
    echo "IMPORTANT: Keep this secret secure. You'll need it to withdraw your funds later."
    echo "Secret: $(cat .mixer_secret.txt)"
}

deposit() {
    load_config
    
    if [ -z "$1" ]; then
        echo "Error: Missing amount parameter. Usage: $0 deposit <amount>"
        exit 1
    fi
    
    local amount="$1"
    
    # Validate denomination
    if [[ ! "$amount" =~ ^(1|10|100)$ ]]; then
        echo "Error: Amount must be 1, 10, or 100 NEAR"
        exit 1
    fi
    
    # Check if we need to generate a new secret
    if [ ! -f .mixer_secret.txt ]; then
        echo "No existing secret found. Generating a new one..."
        generate_secret
    fi
    
    echo "Calculating commitment hash from your secret..."
    local commitment_hash=$(generate_commitment_hash)
    
    echo "Depositing $amount NEAR to the mixer..."
    near call $CONTRACT_ID deposit "{\"commitment_hash\": \"$commitment_hash\"}" \
        --accountId $NEAR_ACCOUNT --networkId $NETWORK --deposit $amount --gas 300000000000000
    
    echo "Deposit complete!"
    echo ""
    echo "IMPORTANT: Keep your secret secure. You'll need it to withdraw funds."
    echo "Secret: $(cat .mixer_secret.txt)"
    echo "Commitment hash: $commitment_hash"
    echo ""
    echo "Wait at least 24 hours before withdrawing for better privacy."
}

withdraw() {
    load_config
    
    if [ -z "$1" ]; then
        echo "Error: Missing recipient parameter. Usage: $0 withdraw <recipient>"
        exit 1
    fi
    
    local recipient="$1"
    
    if [ ! -f .mixer_secret.txt ]; then
        echo "Error: No secret found. You need the secret used during deposit to withdraw."
        exit 1
    fi
    
    local secret=$(cat .mixer_secret.txt)
    
    echo "Withdrawing funds to $recipient using saved secret..."
    near call $CONTRACT_ID withdraw "{\"recipient\": \"$recipient\", \"secret\": \"$secret\"}" \
        --accountId $NEAR_ACCOUNT --networkId $NETWORK --gas 300000000000000
    
    echo "Withdrawal initiated!"
    echo "Note: You can delete your secret file now if the withdrawal was successful."
    echo "To delete secret: rm .mixer_secret.txt"
}

show_stats() {
    load_config
    
    echo "Fetching mixer pool statistics..."
    near view $CONTRACT_ID get_pool_stats '{}' --networkId $NETWORK
}

check_dependency() {
    if ! command -v "$1" &> /dev/null; then
        echo "Error: $1 is required but not installed."
        echo "Please install $1 and try again."
        exit 1
    fi
}

# Check dependencies
check_dependency "near"
check_dependency "openssl"

# Main script execution
case "$1" in
    init)
        init "$2" "$3" "$4"
        ;;
    deploy)
        deploy_contract
        ;;
    secret)
        create_secret
        ;;
    deposit)
        deposit "$2"
        ;;
    withdraw)
        withdraw "$2"
        ;;
    stats)
        show_stats
        ;;
    *)
        print_help
        ;;
esac