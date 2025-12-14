# ATG-M Quick Start

Get ATG-M running in under 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Git installed
- 5 minutes of your time

## Step 1: Install Dependencies (1 min)

```bash
cd /home/quantum/Documents/GKM/ATG-M
npm install
```

## Step 2: Run Development Server (30 sec)

```bash
npm run dev
```

Visit: http://localhost:3000

You should see the ATG-M landing page!

## Step 3: Install Wallet (2 min)

Choose one:
- **Petra**: https://petra.app (Recommended)
- **Pontem**: https://pontem.network

After installing:
1. Create new wallet
2. Add custom network:
   - Name: Movement Testnet Porto
   - RPC: https://aptos.testnet.porto.movementlabs.xyz/v1
   - Chain ID: 177

## Step 4: Get Testnet Tokens (1 min)

Visit: https://faucet.movementlabs.xyz
Enter your wallet address and request tokens.

## Step 5: Deploy Contract (Optional)

**For testing without deployment**, the app works in demo mode with mock data.

**To deploy for real**:

```bash
# Install Aptos CLI
npm install -g @movementlabsxyz/aptos-cli

# Initialize account
cd move/treasury_guardian
aptos init --network custom --rest-url https://aptos.testnet.porto.movementlabs.xyz/v1

# Deploy
aptos move compile
aptos move publish --named-addresses treasury_guardian=<YOUR_ADDRESS>

# Update .env.local with contract address
```

## That's It!

You can now:
- ✅ Connect your wallet
- ✅ Run AI analysis (works even without contract)
- ✅ See the full UI flow
- ✅ Deploy contract when ready
- ✅ Execute real transactions

## Need Help?

- Full setup: See `SETUP.md`
- Demo guide: See `DEMO.md`
- Deployment: See `DEPLOYMENT.md`
- Overview: See `README.md`

