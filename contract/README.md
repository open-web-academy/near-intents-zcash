# near-mixer

A privacy-preserving token mixer for the NEAR blockchain that allows for anonymous transactions by breaking the on-chain link between source and destination addresses.

## Overview

This smart contract implements a simple privacy system to enable private transfers on NEAR. Users can deposit tokens into the mixer contract and later withdraw them to a different address without creating a direct link between deposit and withdrawal addresses.

## Features

- Privacy-preserving token transfers
- Support for multiple token denominations (1, 10, and 100 NEAR)
- Non-custodial design
- Secret-based withdrawal mechanism
- Configurable fee mechanism (maximum 5%)
- 24-hour minimum delay between deposit and withdrawal for improved anonymity

## Installation

Install the required tools:

```bash
# Install Rust and wasm target
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown

# Install NEAR CLI
npm install -g near-cli
```

Clone this repository:

```bash
git clone https://github.com/yourusername/near-mixer.git
cd near-mixer
```

## Quick Start with the Mixer CLI

The mixer includes a command-line interface for easy interaction:

```bash
# Make the script executable
chmod +x scripts/mixer.sh

# Initialize the CLI with your account
./scripts/mixer.sh init your-account.testnet mixer.testnet testnet

# Deploy the contract
./scripts/mixer.sh deploy

# Generate a secret for deposit
./scripts/mixer.sh secret

# Deposit 1 NEAR
./scripts/mixer.sh deposit 1

# After 24 hours, withdraw to recipient account
./scripts/mixer.sh withdraw recipient.testnet

# View mixer statistics
./scripts/mixer.sh stats
```

## How to Build Manually

```bash
cargo build --target wasm32-unknown-unknown --release
```

## How to Test Locally

```bash
cargo test
```

## Understanding the Mixer

### Key Concepts

- **Secret**: A random value you generate locally. Keep this secure as you'll need it to withdraw.
- **Commitment Hash**: The SHA-256 hash of your secret, which is stored on-chain when you deposit.
- **Withdrawal Hash**: A different hash derived from your secret that prevents double-spending.

## Contract Methods

### Initialize Contract

```bash
near call <contract-id> new '{"owner": "owner.near", "fee_basis_points": 100}' --accountId <deployer-account-id>
```

Parameters:
- `owner`: Account that will receive fees
- `fee_basis_points`: Fee percentage in basis points (100 = 1%, maximum 500 = 5%)

### Depositing Tokens

First, generate a secret and its commitment hash:

```bash
# Using our CLI
./scripts/mixer.sh secret

# Or manually with bash
SECRET=$(openssl rand -hex 16)
COMMITMENT=$(echo -n "$SECRET" | openssl dgst -sha256 -hex | sed 's/^.* //')
echo "Secret: $SECRET"
echo "Commitment: $COMMITMENT"
```

Then deposit using your commitment hash:

```bash
# Using our CLI
./scripts/mixer.sh deposit 1

# Or manually with NEAR CLI
near call <contract-id> deposit '{"commitment_hash": "<your-commitment-hash>"}' --accountId <your-account-id> --amount 1
```

Notes:
- Only accepts denominations of 1, 10, or 100 NEAR
- Store your secret value securely - you'll need it to withdraw!

### Withdrawing Tokens

After at least 24 hours, you can withdraw your tokens to any address:

```bash
# Using our CLI
./scripts/mixer.sh withdraw recipient.near

# Or manually with NEAR CLI
near call <contract-id> withdraw '{"recipient": "recipient.near", "secret": "<your-secret>"}' --accountId <any-account-id>
```

Parameters:
- `recipient`: Account that will receive the withdrawn funds
- `secret`: The original secret value you generated during deposit

### View Pool Statistics

```bash
# Using our CLI
./scripts/mixer.sh stats

# Or manually with NEAR CLI
near view <contract-id> get_pool_stats '{}'
```

## Security Best Practices

1. **Keep your secret safe** - if lost, your funds are permanently locked in the mixer
2. **Wait at least 24 hours** before withdrawing to increase anonymity
3. **Use different accounts** for depositing and receiving to maintain privacy
4. **Clear your secret** after successful withdrawal
5. **Use a secure device** when generating secrets and submitting transactions

## Privacy Considerations

This mixer provides basic privacy by breaking the direct link between deposit and withdrawal. However, it has limitations:

1. **Transaction Timing**: If you withdraw exactly after 24 hours, correlation attacks are possible
2. **Unique Amounts**: Using uncommon amounts makes your transactions easier to track
3. **Metadata Leakage**: Be careful about IP addresses and other metadata when using the mixer

For maximum privacy:
- Wait random periods beyond the minimum 24 hours
- Use common denominations (1 NEAR is best for anonymity)
- Consider using Tor or a VPN when interacting with the contract

## Privacy Limitations

This mixer provides basic privacy features but **does not guarantee complete anonymity**. Understanding these limitations is crucial:

### Current Limitations

1. **Correlation Vulnerabilities**: 
   - Deposits and withdrawals can be linked through timing analysis (especially if withdrawing exactly after the minimum delay)
   - Amount tracking (each denomination minus fees creates predictable withdrawal amounts)
   - Low volume pools reduce anonymity significantly

2. **No True Fund Mixing**:
   - Funds are not truly mixed between users' deposits
   - Each deposit corresponds to a specific withdrawal

3. **Secret Management Risks**:
   - If your secret is exposed, your transaction privacy is compromised
   - The secret must be revealed to the blockchain during withdrawal

### For a Higher Privacy Level

Although this mixer provides basic transaction privacy, users seeking stronger anonymity should:

- **Use larger pools**: The more users in a denomination pool, the better the privacy
- **Delay withdrawals randomly**: Wait varying amounts of time well beyond the minimum period
- **Use multiple hops**: After withdrawal, transfer to another wallet before final use
- **Consider advanced solutions**: For critical privacy needs, consider protocols with zero-knowledge proofs

For most casual use cases, this mixer adequately breaks the direct transaction link, but it's not suitable for situations requiring guaranteed anonymity.

## Project Structure

- `src/lib.rs` - Main contract implementation
- `scripts/mixer.sh` - CLI tool for interacting with the contract



## License

This project is licensed under [LICENSE NAME] - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Useful Links

- [NEAR CLI Documentation](https://docs.near.org/tools/near-cli)
- [NEAR Rust SDK Documentation](https://docs.near.org/sdk/rust/introduction)
- [NEAR Documentation](https://docs.near.org)
- [NEAR Discord](https://near.chat)
- [NEAR Telegram Developers Community Group](https://t.me/neardev)
