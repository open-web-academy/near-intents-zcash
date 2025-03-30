# Multichain Anonymous Transactions Platform

This project is an innovative **multichain platform** enabling seamless and anonymous transactions between **NEAR** and **ZCash** networks. By integrating **Near Intents** and a powerful **AI agent**, users can conduct **secure and private transactions** across multiple blockchains.

---

## Features

### **AI Agent**
- Deposit **NEAR or USDT** into **Near Intents**.
- Check the **balance** of these assets within **Near Intents**.
- Use **Mixer transactions** for **100% anonymous** transfers on the NEAR network, allowing deposits and withdrawals without traceable links.

### **Deposit**
- Supports deposits of **NEAR and USDT** into **Near Intents**.
- Allows **ZCash deposits** through **Near Intents**.

### **Swap**
- Enables seamless asset swaps between **NEAR, USDT, and ZCash**.

### **Withdraw**
- Withdraw **NEAR and USDT** within the **NEAR network**.
- Withdraw **ZCash** on its native network.

With this platform, users can **interact with a NEAR wallet** to perform all transactions and send withdrawal requests to the ZCash network, making it a **fully multichain** platform with **anonymous transaction capabilities** via the AI-powered **Mixer**.

---

# NEAR Intents ZCash Agent

This project includes an **API** for interacting with **NEAR Intents** and **ZCash**, allowing users to deposit, check balances, and execute transactions.

## **API Features**
- Deposit **NEAR and USDT** into **Intents contracts**.
- Query **balances** of these assets in **Intents**.
- Utilize **Mixer** functionality for **anonymous** NEAR transactions.

### **Available API Endpoints**
#### **1. Deposit NEAR to Intents Contract**
`/api/tools/deposit_intents_near`
- Allows depositing NEAR into Intents.
- Parameters:
  - `accountId` (NEAR account ID, required).
  - `near_amount` (Amount in yoctos, required).

#### **2. Deposit USDT to Intents Contract**
`/api/tools/deposit_intents_usdt`
- Allows depositing USDT into Intents.
- Parameters:
  - `accountId` (NEAR account ID, required).
  - `usdt_amount` (Amount of USDT, required).

#### **3. Get Balance of USDT in Intents**
`/api/tools/balance_intents_usdt`
- Queries USDT balance in Intents.
- Parameter:
  - `account_id` (NEAR account ID, required).

#### **4. Get Balance of NEAR in Intents**
`/api/tools/balance_intents_near`
- Queries NEAR balance in Intents.
- Parameter:
  - `account_id` (NEAR account ID, required).

#### **5. Withdraw NEAR from Intents Contract (Under Development)**
`/api/tools/withdraw_intents_near`
- Allows withdrawing NEAR from Intents.

#### **6. Deposit NEAR to Mixer Contract**
`/api/tools/deposit_mixer_near`
- Deposits NEAR into Mixer for **anonymous** transactions.
- Parameters:
  - `secret` (Secret to create a commitment hash, required).
  - `near_amount` (Amount in yoctos, required).

#### **7. Withdraw NEAR from Mixer Contract**
`/api/tools/withdraw_mixer_near`
- Withdraws NEAR from Mixer.
- Parameters:
  - `secret` (Secret for commitment hash, required).
  - `recipient` (NEAR recipient, required).

---

# NEAR Mixer Smart Contract

The **near-mixer** contract provides **privacy-preserving transactions** by breaking the on-chain link between deposit and withdrawal addresses.

### **Contract Features**
- Supports **private** token transfers.
- Handles denominations of **1, 10, and 100 NEAR**.
- Implements a **non-custodial design**.
- Uses **secret-based withdrawal**.
- Includes a **configurable fee system** (max 5%).
- Enforces a **24-hour delay** for improved anonymity.

### **Quick Start**
Install dependencies:
```bash
# Install Rust and NEAR CLI
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
npm install -g near-cli
```
Clone and deploy:
```bash
git clone https://github.com/yourusername/near-mixer.git
cd near-mixer
```
Use the **Mixer CLI** for deposits and withdrawals:
```bash
chmod +x scripts/mixer.sh
./scripts/mixer.sh init your-account.testnet mixer.testnet testnet
./scripts/mixer.sh deploy
./scripts/mixer.sh deposit 1
./scripts/mixer.sh withdraw recipient.testnet
./scripts/mixer.sh stats
```

### **Privacy Considerations**
- **Wait at least 24 hours** before withdrawing for better anonymity.
- **Use common denominations** (e.g., 1 NEAR) to blend with other transactions.
- **Avoid patterns** that make transactions traceable.

---

# Frontend - Next.js Application

The **frontend** is a Next.js-based **decentralized** interface allowing users to interact with the platform.

### **Setup Instructions**
Run the development server:
```bash
npm run dev
# or
yarn dev
```
Access the app at [http://localhost:3000](http://localhost:3000).

### **Frontend Features**
- **Deposit Page**: Deposit **NEAR, USDT, and ZCash**.
- **Swap Page**: Exchange between **NEAR, USDT, and ZCash**.
- **Withdraw Page**: Withdraw assets from **Near Intents** to NEAR or ZCash.
- **AI Agent Integration**: Enables **mixer transactions** for **anonymous transfers**.

### **Learn More**
- [Next.js Documentation](https://nextjs.org/docs)
- [Near Protocol Documentation](https://docs.near.org)
- [Bitte Protocol Documentation](https://docs.bitte.ai)

---

## **License**
MIT License.

## **Contributing**
Contributions are welcome! Feel free to submit a Pull Request.

## **Useful Links**
- [NEAR CLI Docs](https://docs.near.org/tools/near-cli)
- [NEAR Rust SDK](https://docs.near.org/sdk/rust/introduction)
- [NEAR Discord](https://near.chat)
- [NEAR Telegram Developers](https://t.me/neardev)

This **multichain** platform provides **decentralized and anonymous transactions**, leveraging **Near Intents, ZCash, and AI-driven Mixers** to offer a **high level of privacy and security** for blockchain transactions.

