# NEAR Intents ZCash Agent

This project is an API for interacting with NEAR Intents and ZCash. It allows deposits and balance queries for NEAR and USDT, as well as transactions within the Intents and Mixer contracts.

## Features

- 🪙 Deposit NEAR and USDT tokens into Intents contracts.
- 💸 Query the balance of NEAR and USDT in Intents contracts.
- 🔐 Deposit and withdraw NEAR with Mixer for anonymous transactions.

## Available Endpoints

The API includes the following predefined endpoints:

### 1. **Deposit NEAR to Intents Contract**
- **Endpoint:** `/api/tools/deposit_intents_near`
- **Description:** Allows depositing NEAR tokens to the Intents contract.
- **Parameters:**
  - `accountId`: NEAR account ID (Required).
  - `near_amount`: Amount of NEAR tokens to deposit (Required, in yoctos).

### 2. **Deposit USDT to Intents Contract**
- **Endpoint:** `/api/tools/deposit_intents_usdt`
- **Description:** Allows depositing USDT tokens to the Intents contract.
- **Parameters:**
  - `accountId`: NEAR account ID (Required).
  - `usdt_amount`: Amount of USDT tokens to deposit (Required).

### 3. **Get Balance of USDT in Intents Contract**
- **Endpoint:** `/api/tools/balance_intents_usdt`
- **Description:** Allows querying the balance of USDT tokens for a given NEAR account ID in the Intents contract.
- **Parameter:**
  - `account_id`: NEAR account ID (Required).

### 4. **Get Balance of NEAR in Intents Contract**
- **Endpoint:** `/api/tools/balance_intents_near`
- **Description:** Allows querying the balance of NEAR tokens for a given NEAR account ID in the Intents contract.
- **Parameter:**
  - `account_id`: NEAR account ID (Required).

### 5. **Withdraw NEAR from Intents Contract (Under Development)**
- **Endpoint:** `/api/tools/withdraw_intents_near`
- **Description:** Allows withdrawing NEAR tokens from the Intents contract.

### 6. **Deposit NEAR to Mixer Contract**
- **Endpoint:** `/api/tools/deposit_mixer_near`
- **Description:** Allows depositing NEAR tokens to the Mixer contract for anonymous transactions.
- **Parameters:**
  - `secret`: Secret to create a `commitment_hash` (Required).
  - `near_amount`: Amount of NEAR tokens to deposit (Required, in yoctos).
  
### 7. **Withdraw NEAR from Mixer Contract**
- **Endpoint:** `/api/tools/withdraw_mixer_near`
- **Description:** Allows withdrawing NEAR tokens from the Mixer contract.
- **Parameters:**
  - `secret`: Secret to create a `commitment_hash` (Required).
  - `recipient`: NEAR account ID of the recipient (Required).

## AI Agent Configuration

The AI agent configuration is predefined in the `/.well-known/ai-plugin.json` file. You can customize the agent's behavior by modifying the configuration in `/api/ai-plugins/route.ts`. This file generates and returns the plugin manifest object.

### Agent Behavior
The agent is designed to interact with NEAR Intents and ZCash. Its main functions include:
1. Deposit NEAR and USDT tokens into Intents contracts.
2. Query the balance of NEAR and USDT in the Intents contracts.
3. Deposit and withdraw NEAR with Mixer for anonymous transactions.

## Learn More

- [Bitte Protocol Documentation](https://docs.bitte.ai)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAPI Specification](https://swagger.io/specification/)

## License

MIT License