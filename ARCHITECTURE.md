# ATG-M Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER / DAO                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Wallet Connection
                            │ (Petra / Pontem)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 14)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Wallet     │  │  Treasury    │  │  AI Analysis │          │
│  │   Connect    │  │  Dashboard   │  │    Panel     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────────────────────────────────────────┐          │
│  │           Execution Button                        │          │
│  └──────────────────────────────────────────────────┘          │
└───────┬────────────────────────┬────────────────────────────────┘
        │                        │
        │                        │ API Call
        │                        ▼
        │              ┌─────────────────────┐
        │              │  /api/analyze       │
        │              │  (Next.js Route)    │
        │              └──────────┬──────────┘
        │                         │
        │                         │ Inference Request
        │                         ▼
        │              ┌─────────────────────┐
        │              │  AI Decision Engine │
        │              │  (lib/ai/agent.ts)  │
        │              └──────────┬──────────┘
        │                         │
        │                         │ HuggingFace API
        │                         ▼
        │              ┌─────────────────────┐
        │              │  HuggingFace        │
        │              │  Mistral-7B Model   │
        │              └─────────────────────┘
        │
        │ Transaction Execution
        ▼
┌─────────────────────────────────────────────────────────────────┐
│              MOVEMENT SDK ADAPTER                                │
│  ┌──────────────────────────────────────────────────┐          │
│  │  Executor (lib/movement/executor.ts)             │          │
│  │  - Build transactions                            │          │
│  │  - Sign with wallet                              │          │
│  │  - Submit to network                             │          │
│  │  - Confirm on-chain                              │          │
│  └──────────────────────────────────────────────────┘          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ RPC Call
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  MOVEMENT L1 NETWORK                             │
│                  (Testnet Porto)                                 │
│  ┌──────────────────────────────────────────────────┐          │
│  │  Treasury Smart Contract                         │          │
│  │  (move/treasury_guardian/sources/treasury.move)  │          │
│  │                                                   │          │
│  │  Modules:                                        │          │
│  │  - initialize_treasury()                         │          │
│  │  - propose_rebalance()                           │          │
│  │  - execute_rebalance()                           │          │
│  │  - get_treasury_state()  [view]                 │          │
│  │  - get_pending_proposal() [view]                │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                  │
│  RPC: https://aptos.testnet.porto.movementlabs.xyz/v1          │
│  Chain ID: 177                                                   │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Verified On
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              MOVEMENT EXPLORER                                   │
│              https://explorer.movementlabs.xyz                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Treasury Initialization Flow
```
User → Connect Wallet → Click "Initialize"
  → Frontend calls initializeTreasuryTx()
    → Movement Executor builds transaction
      → Wallet signs transaction
        → Submit to Movement L1
          → Contract: initialize_treasury()
            → Store TreasuryState
              → Emit TreasuryInitializedEvent
                → Return TX hash
                  → Frontend displays confirmation
                    → Link to Explorer
```

### 2. AI Analysis Flow
```
User → Click "Run AI Analysis"
  → Frontend calls /api/analyze
    → Get treasury state from on-chain
      → Build analysis prompt
        → Call HuggingFace Inference API
          → Model generates decision
            → Parse JSON response
              → Validate decision structure
                → Return structured decision
                  → Frontend displays:
                    - Risk level (colored badge)
                    - Action recommendation
                    - Confidence meter
                    - AI reasoning
                    - Proposed allocation
```

### 3. Transaction Execution Flow
```
User → Reviews AI Decision → Click "Execute Rebalance"
  → Frontend calls submitRebalanceTx()
    → Movement Executor builds transaction
      → Wallet prompts for approval
        → User approves
          → Submit to Movement L1
            → Contract: propose_rebalance()
              → Validate signer
                → Store pending proposal
                  → Emit RebalanceProposedEvent
                    → Update timestamp
                      → Return TX hash
                        → Wait for confirmation
                          → Display success
                            → Show explorer link
```

## Component Responsibilities

### Frontend Layer
| Component | Responsibility |
|-----------|---------------|
| `WalletConnect.tsx` | Wallet detection, connection, disconnection |
| `TreasuryDashboard.tsx` | Display treasury state, balance, health |
| `AIAnalysisPanel.tsx` | Trigger analysis, display AI decision |
| `ExecutionButton.tsx` | Execute transactions, show results |
| `app/page.tsx` | Orchestrate all components, state management |

### API Layer
| Route | Responsibility |
|-------|---------------|
| `/api/analyze` | Accept treasury state, call AI agent, return decision |

### Business Logic Layer
| Module | Responsibility |
|--------|---------------|
| `lib/ai/agent.ts` | AI decision-making, HuggingFace integration |
| `lib/movement/executor.ts` | Transaction building, execution, confirmation |
| `lib/movement/wallet.ts` | Wallet abstraction, Petra/Pontem support |
| `lib/movement/config.ts` | Network configuration, RPC URLs |
| `lib/movement/explorer.ts` | Explorer URL generation, formatting |

### Smart Contract Layer
| Function | Type | Responsibility |
|----------|------|---------------|
| `initialize_treasury()` | Entry | Create new treasury |
| `propose_rebalance()` | Entry | Store rebalance proposal |
| `execute_rebalance()` | Entry | Execute pending proposal |
| `get_treasury_state()` | View | Return balance, timestamp, proposal status |
| `get_pending_proposal()` | View | Return pending allocation |
| `treasury_exists()` | View | Check if treasury initialized |
| `update_balance()` | Entry | Update balance (demo only) |

## Security Model

### Smart Contract Security
```
┌─────────────────────────────────────────────┐
│  Entry Function Called                      │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  1. Verify Signer                           │
│     assert!(treasury.owner == signer_addr)  │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  2. Update Timestamp                        │
│     timestamp::now_seconds()                │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  3. Execute Business Logic                  │
│     (state changes)                         │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  4. Emit Event                              │
│     (for auditability)                      │
└─────────────────────────────────────────────┘
```

### Frontend Security
- No private keys stored
- Wallet handles all signing
- Environment variables for secrets
- HTTPS only in production
- CORS configured properly

## Integration Points

### Movement L1 Integration
- **RPC Endpoint**: `https://aptos.testnet.porto.movementlabs.xyz/v1`
- **SDK**: `@aptos-labs/ts-sdk` v1.29.0
- **Network**: Custom (Movement Testnet Porto)
- **Chain ID**: 177
- **Gas Token**: MOVE

### HuggingFace Integration
- **Model**: `mistralai/Mistral-7B-Instruct-v0.2`
- **API**: Inference API (serverless)
- **Authentication**: Bearer token
- **Rate Limits**: Free tier limits apply
- **Fallback**: Rule-based decision if API fails

### Wallet Integration
- **Petra**: Standard Aptos wallet API
- **Pontem**: Standard Aptos wallet API
- **Methods Used**:
  - `connect()` - Request wallet connection
  - `account()` - Get connected account
  - `signAndSubmitTransaction()` - Sign and submit
  - `disconnect()` - Disconnect wallet

## Deployment Architecture

### Development
```
localhost:3000 (Next.js dev server)
  ↓
Local wallet (browser extension)
  ↓
Movement Testnet Porto
```

### Production
```
Vercel Edge Network (CDN)
  ↓
Vercel Serverless Functions (/api/*)
  ↓
HuggingFace Inference API
  ↓
User's Wallet (browser)
  ↓
Movement Testnet Porto
  ↓
Movement Explorer (verification)
```

## Performance Considerations

### Frontend
- **First Paint**: < 2 seconds
- **Time to Interactive**: < 4 seconds
- **Bundle Size**: Optimized with Next.js tree-shaking
- **Caching**: Static assets cached on CDN

### API Routes
- **AI Analysis**: 2-5 seconds (HuggingFace cold start)
- **Treasury State Query**: < 500ms (view function, gas-free)
- **Retry Logic**: 3 attempts with exponential backoff

### Smart Contract
- **View Functions**: Gas-free, instant reads
- **State Mutations**: ~0.0001 MOVE gas cost
- **Transaction Confirmation**: 5-10 seconds typical

## Scalability

### Current Capacity
- Supports single treasury per wallet
- AI analysis: Limited by HuggingFace free tier
- Transaction throughput: Limited by Movement network

### Future Enhancements
- Multi-treasury support per wallet
- Batch transaction execution
- Advanced AI model selection
- Caching layer for treasury state
- WebSocket for real-time updates

## Monitoring & Observability

### Logs
- Frontend: Browser console (dev), Vercel logs (prod)
- API Routes: Vercel function logs
- Smart Contract: Movement Explorer events

### Metrics to Track
- Transaction success rate
- AI analysis response time
- Wallet connection rate
- Error rates by component
- User journey completion rate

## Error Handling

### Frontend Errors
- Wallet not installed → Install prompt
- Network mismatch → Switch network prompt
- Transaction rejected → User-friendly message
- API timeout → Retry button

### API Errors
- HuggingFace rate limit → Fallback decision
- Invalid response → Structured fallback
- Network error → Retry with backoff

### Contract Errors
- Not owner → Clear error message
- Treasury not found → Initialize prompt
- Insufficient gas → Top-up instructions

---

**Architecture Version**: 1.0  
**Last Updated**: December 2025  
**Built For**: Movement L1 Hackathon

