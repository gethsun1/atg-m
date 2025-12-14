#!/bin/bash

echo "================================"
echo "Treasury Guardian Deployment"
echo "================================"
echo ""

# Check if aptos CLI is installed
if ! command -v aptos &> /dev/null; then
    echo "Error: Aptos CLI not found. Please install it first."
    echo "Run: npm install -g @movementlabsxyz/aptos-cli"
    exit 1
fi

echo "Step 1: Compiling Move contract..."
aptos move compile

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed!"
    exit 1
fi

echo "✅ Compilation successful!"
echo ""

echo "Step 2: Ready to deploy"
echo ""
echo "To deploy, run:"
echo "  aptos move publish --named-addresses treasury_guardian=<YOUR_ACCOUNT_ADDRESS>"
echo ""
echo "After deployment:"
echo "  1. Copy the contract address"
echo "  2. Add it to ../../.env.local as NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS"
echo ""
echo "Need an account? Run: aptos init --network custom --rest-url https://aptos.testnet.porto.movementlabs.xyz/v1"

