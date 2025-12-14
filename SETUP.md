# ATG-M Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Git
- A Movement-compatible wallet (Petra or Pontem)

## 1. Install Dependencies

```bash
npm install
```

## 2. Movement Wallet Setup

### Option A: Petra Wallet (Recommended)

1. Install Petra Wallet browser extension: https://petra.app/
2. Create a new wallet or import existing
3. Switch network to "Movement Testnet Porto"
   - Network Name: Movement Testnet Porto
   - RPC URL: https://aptos.testnet.porto.movementlabs.xyz/v1
   - Chain ID: 177 (Movement Porto Testnet)
   - Currency: MOVE

### Option B: Pontem Wallet

1. Install Pontem Wallet: https://pontem.network/
2. Create/import wallet
3. Add Movement Testnet custom network with same details as above

## 3. Get Testnet Tokens

You'll need MOVE tokens for transaction fees:

1. Visit Movement faucet: https://faucet.movementlabs.xyz/
2. Enter your wallet address
3. Request testnet MOVE tokens
4. Wait for confirmation (usually 30 seconds)

## 4. Configure Environment

The `.env.local` file should already contain:
- HuggingFace API token (already configured)
- Movement RPC URL (already configured)

After deploying the Move contract, you'll need to add:
```bash
NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS=0x... # filled after deployment
```

## 5. Install Movement CLI (for contract deployment)

### Using npm:
```bash
npm install -g @movementlabsxyz/aptos-cli
```

### Or using Cargo (Rust):
```bash
cargo install --git https://github.com/movementlabsxyz/aptos-core.git aptos
```

### Verify installation:
```bash
movement --version
# or
aptos --version
```

## 6. Initialize Movement Account (for deployment)

```bash
cd move/treasury_guardian
aptos init --network custom --rest-url https://aptos.testnet.porto.movementlabs.xyz/v1
```

Follow prompts:
- Choose a private key option (generate new or import)
- Save the account address - you'll need it

## 7. Compile Move Contract

```bash
cd move/treasury_guardian
aptos move compile
```

Expected output: `Success` with no errors

## 8. Deploy Move Contract

```bash
aptos move publish --named-addresses treasury_guardian=<YOUR_ACCOUNT_ADDRESS>
```

After successful deployment:
1. Copy the contract address
2. Add it to `.env.local` as `NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS`

## 9. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 10. Test the Flow

1. Connect your wallet using the UI
2. View treasury dashboard
3. Run AI analysis
4. Review recommendation
5. Execute transaction
6. View on Movement explorer

## Troubleshooting

### Wallet Connection Issues
- Ensure you're on Movement Testnet Porto network
- Try disconnecting and reconnecting wallet
- Clear browser cache and reload

### Transaction Failures
- Check you have sufficient MOVE tokens
- Verify contract address in `.env.local`
- Check Movement RPC status

### Contract Compilation Errors
- Ensure AptosFramework dependency is accessible
- Check Move.toml configuration
- Verify Movement CLI version compatibility

## Useful Links

- Movement Testnet Explorer: https://explorer.movementlabs.xyz/
- Movement Faucet: https://faucet.movementlabs.xyz/
- Movement Documentation: https://docs.movementlabs.xyz/
- Petra Wallet: https://petra.app/
- Pontem Wallet: https://pontem.network/

## Next Steps

See [DEMO.md](DEMO.md) for a complete demo walkthrough.

