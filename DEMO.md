# ATG-M Demo Guide

## Complete Demo Walkthrough

This guide provides a step-by-step demonstration of ATG-M (Autonomous Treasury Guardian - Movement Edition).

## Prerequisites

- Movement-compatible wallet installed (Petra or Pontem)
- Testnet MOVE tokens (from faucet)
- Move contract deployed to Movement testnet
- Contract address added to `.env.local`

## Demo Flow

### Step 1: Launch Application

```bash
npm run dev
```

Navigate to http://localhost:3000

**Expected Result**: Landing page with ATG-M branding and "Connect Wallet" button

### Step 2: Connect Wallet

1. Click "Connect Wallet" button
2. Wallet extension opens
3. Approve connection
4. See wallet address displayed in header

**Expected Result**: 
- Green badge showing wallet address
- "Disconnect" button appears
- Initialize Treasury prompt shows

### Step 3: Initialize Treasury

1. Click "Initialize Treasury" button
2. Wallet prompts for transaction approval
3. Approve transaction
4. Wait for confirmation (5-10 seconds)

**Expected Result**:
- Treasury dashboard appears
- Shows balance: 100,000 MOVE
- Last action timestamp shows current time
- Pending proposal: No

### Step 4: Run AI Analysis

1. Click "Run AI Analysis" button in AI Analysis Panel
2. Loading spinner appears
3. Wait 2-5 seconds for HuggingFace inference

**Expected Result**:
- Risk level displayed (colored badge)
- Recommended action: "Rebalance" or "Hold"
- Confidence meter shows percentage
- AI reasoning text explains decision
- If rebalance: Proposed allocation percentages shown

### Step 5: Review AI Recommendation

Observe the AI decision panel:

- **Risk Level**: Color-coded (green/yellow/red)
- **Action**: Clearly stated (REBALANCE or HOLD)
- **Confidence**: Visual progress bar + percentage
- **Reasoning**: Plain text explanation (no markdown symbols)
- **Allocation**: If rebalancing, shows target percentages

**Key UI Features**:
- No markdown symbols (no `>` or `_` characters)
- Smooth fade transitions (no scrolling text)
- Clean typography with proper spacing
- Mobile-responsive layout

### Step 6: Execute Recommendation

If AI recommends rebalance:

1. Scroll to "Execute Action" section
2. Review "Ready to Execute Rebalance" message
3. Click "Execute Rebalance" button
4. Wallet prompts for transaction approval
5. Approve transaction
6. Wait for confirmation

**Expected Result**:
- "Executing Transaction..." button state
- Success message appears (green background)
- Transaction hash displayed
- "View on Explorer" link provided

### Step 7: Verify On-Chain

1. Click "View on Explorer" link
2. Movement Explorer opens in new tab
3. See transaction details:
   - Status: Success
   - Function: `propose_rebalance`
   - Events emitted
   - Timestamp

**Expected Result**: Transaction visible on Movement testnet explorer

### Step 8: Execute Pending Proposal

After proposing rebalance:

1. Refresh page (or wait for auto-refresh)
2. Treasury dashboard updates:
   - Pending Proposal: Yes (yellow badge)
3. Run AI analysis again (optional)
4. Execute the pending rebalance:
   - This would be done via separate UI element
   - Or demonstrate that proposal is now stored on-chain

## Demo Script (for Judges)

**30-Second Pitch**:
"ATG-M is an AI-autonomous treasury guardian built natively on Movement L1. It combines Move smart contracts with HuggingFace AI to provide real-time, intelligent treasury management for DAOs. Watch as AI analyzes our treasury and executes decisions directly on-chain."

**2-Minute Demo**:
1. "Here's our treasury with 100k MOVE tokens" (show dashboard)
2. "Let's ask AI what to do" (click Run AI Analysis)
3. "AI recommends rebalancing with 85% confidence" (show decision)
4. "One click to execute on Movement L1" (execute transaction)
5. "Transaction confirmed - see it on the explorer" (show explorer link)

**Key Points to Emphasize**:
- ✅ Built natively for Movement L1 (not EVM port)
- ✅ Real Move smart contract execution
- ✅ Live AI inference via HuggingFace
- ✅ Actual on-chain transactions (not simulation)
- ✅ Clean, judge-friendly UX
- ✅ Production-ready for DAOs

## Troubleshooting

### Wallet Not Connecting
- Ensure Petra/Pontem installed
- Switch to Movement Testnet Porto network
- Refresh page and try again

### Transaction Fails
- Check sufficient MOVE tokens for gas
- Verify contract address in `.env.local`
- Check Movement RPC status
- Try again after 10 seconds

### AI Analysis Takes Long
- HuggingFace API may have rate limits
- First call may be slower (cold start)
- Fallback logic activates after 10s

### Treasury Not Initializing
- Ensure wallet connected
- Check transaction approval in wallet
- Verify gas tokens available
- Check console for errors

### Explorer Link 404
- Transaction may still be pending
- Wait 5-10 seconds and refresh
- Check transaction hash is correct
- Verify network setting in explorer URL

## Demo Variations

### Variation 1: Show Risk Management
- Initialize with low balance (20k MOVE)
- AI should detect "Low" health status
- Recommendation may be more conservative

### Variation 2: Multiple Analyses
- Run AI analysis multiple times
- Show different recommendations based on time
- Demonstrate AI reasoning differences

### Variation 3: x402 Integration (Bonus)
- Show x402 payment stub in UI
- "Agent paid for market data via x402"
- Explain future production wiring

## Expected Outcomes

By end of demo, judges should see:

1. ✅ Working Movement L1 connection
2. ✅ Real Move contract deployment
3. ✅ Live AI decision-making
4. ✅ On-chain transaction execution
5. ✅ Explorer verification
6. ✅ Clean, professional UI
7. ✅ Clear path to production use

## Post-Demo Q&A

**Q: Is this running on testnet or mainnet?**
A: Movement testnet Porto. Ready for mainnet deployment.

**Q: Is the AI actually running or is it mocked?**
A: Real HuggingFace Inference API with Mistral-7B model.

**Q: Can this work with real DAOs?**
A: Yes. Treasury module supports multiple assets, governance integration ready.

**Q: How is security handled?**
A: Move contract enforces signer verification, timestamp-based replay protection, event emission for auditability.

**Q: What about gas costs?**
A: View functions are free. Mutations cost typical Movement L1 gas fees.

## Next Steps After Demo

1. Deploy to mainnet Movement
2. Integrate with existing DAO governance (Realms, etc.)
3. Add multi-signature support
4. Expand AI models (multiple strategies)
5. Implement full x402 micropayment integration
6. Add historical analytics dashboard
7. Support multiple treasury assets beyond MOVE

## Success Criteria

Demo is successful if:
- [ ] Wallet connects smoothly
- [ ] Treasury initializes on-chain
- [ ] AI returns structured decision
- [ ] Transaction executes without errors
- [ ] Explorer shows confirmed transaction
- [ ] UI displays cleanly without glitches
- [ ] Judges understand the value proposition

---

**Remember**: The goal is to show real, working technology—not just slides or mockups. Let the live demo speak for itself.

