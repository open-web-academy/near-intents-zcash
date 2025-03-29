use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedSet};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault, Promise, Timestamp, NearToken};
use sha2::{Digest, Sha256};

// const MIN_DELAY: u64 = 3600 * 24; // 24 hours in seconds
const MIN_DELAY: u64 = 180; // 3 mins in second
const DENOMINATIONS: [NearToken; 3] = [
    NearToken::from_near(1),    // 1 NEAR
    NearToken::from_near(10),   // 10 NEAR
    NearToken::from_near(100),  // 100 NEAR
];

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct UtxoMixer {
    // Hash del secreto -> Información del depósito
    deposits: LookupMap<String, DepositInfo>,
    // Hash de retiro usado -> true (para prevenir doble gasto)
    spent_outputs: UnorderedSet<String>,
    // Owner para comisiones
    owner: AccountId,
    // Comisión en basis points (100 = 1%)
    fee_basis_points: u16,
    // Estadísticas por denominación
    deposit_counts: LookupMap<NearToken, u64>,
}

#[derive(BorshDeserialize, BorshSerialize)]
struct DepositInfo {
    denomination: NearToken,
    timestamp: Timestamp,
}

#[near_bindgen]
impl UtxoMixer {
    #[init]
    pub fn new(owner: AccountId, fee_basis_points: u16) -> Self {
        assert!(fee_basis_points <= 500, "Fee cannot exceed 5%");
        
        Self {
            deposits: LookupMap::new(b"d"),
            spent_outputs: UnorderedSet::new(b"s"),
            owner,
            fee_basis_points,
            deposit_counts: LookupMap::new(b"c"),
        }
    }
    
    /// El usuario genera un secreto localmente, calcula su hash, y envía solo ese hash
    #[payable]
    pub fn deposit(&mut self, commitment_hash: String) {
        let deposit_amount = env::attached_deposit();
        
        // Verificar que es una denominación aceptada
        let mut valid_denomination = false;
        for denom in DENOMINATIONS.iter() {
            if &deposit_amount == denom {
                valid_denomination = true;
                
                // Incrementar contador para esta denominación
                let current_count = self.deposit_counts.get(denom).unwrap_or(0);
                self.deposit_counts.insert(denom, &(current_count + 1));
                break;
            }
        }
        assert!(valid_denomination, "Deposit must be one of the accepted denominations");
        
        // Verificar que este commitment no existe ya
        assert!(!self.deposits.contains_key(&commitment_hash), "Commitment already exists");
        
        // Almacenar la información del depósito asociada al hash del commitment
        self.deposits.insert(&commitment_hash, &DepositInfo {
            denomination: deposit_amount,
            timestamp: env::block_timestamp(),
        });
        
        env::log_str(&format!("Deposit of {} NEAR accepted", deposit_amount.as_near()));
    }
    
    /// Retirar fondos presentando el secreto original
    pub fn withdraw(&mut self, recipient: AccountId, secret: String) {
        // 1. Generar el hash del secreto para buscar el depósito
        let commitment_hash = format!("{:x}", Sha256::digest(secret.as_bytes()));
        
        // 2. Verificar que existe un depósito con este hash
        let deposit = self.deposits.get(&commitment_hash).expect("No deposit found for this secret");
        
        // 3. Generar un hash de retiro único
        let withdrawal_hash = format!("{:x}", Sha256::digest(format!("withdraw:{}", secret).as_bytes()));
        
        // 4. Verificar que este hash de retiro no se ha usado antes (prevenir doble gasto)
        assert!(!self.spent_outputs.contains(&withdrawal_hash), "This secret has already been used");
        
        // 5. Verificar que ha pasado suficiente tiempo
        assert!(env::block_timestamp() - deposit.timestamp >= MIN_DELAY * 1_000_000_000, 
                "Withdrawal too early");
        
        // 6. Marcar como usado
        self.spent_outputs.insert(&withdrawal_hash);
        
        // 7. Eliminar el depósito
        self.deposits.remove(&commitment_hash);
        
        // 8. Calcular comisión
        let fee = deposit.denomination.as_yoctonear() * u128::from(self.fee_basis_points) / 10000;
        let withdrawal_amount = deposit.denomination.as_yoctonear() - fee;
        
        // 9. Transferir comisión
        if fee > 0 {
            Promise::new(self.owner.clone()).transfer(NearToken::from_yoctonear(fee));
        }
        
        // 10. Transferir fondos al destinatario
        Promise::new(recipient.clone()).transfer(NearToken::from_yoctonear(withdrawal_amount));
        
        env::log_str(&format!("Withdrawal of {} NEAR processed to {}", 
            NearToken::from_yoctonear(withdrawal_amount).as_near(), recipient));
    }
}