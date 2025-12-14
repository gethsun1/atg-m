![ATG-M Cover](./public/atg-readme-cover.png)

# ATG-M: Autonomous Treasury Guardian - Movement Edition

> AI-powered autonomous treasury management built natively on Movement L1 using Move

## Overview

ATG-M is an AI-autonomous treasury guardian that manages and protects DAO treasuries through intelligent decision-making and on-chain execution. Built specifically for Movement L1, it combines Move smart contracts with advanced AI inference to provide real-time treasury management.

## Key Features

- **Move-Based Treasury Execution** - Native Movement L1 smart contracts for secure treasury management
- **AI-Agent Powered Financial Automation** - HuggingFace-powered decision engine for risk assessment
- **Real On-Chain Execution** - Not a simulation - actual transactions on Movement testnet
- **Production-Ready for DAOs** - Built with security and auditability in mind

## Technology Stack

- **Blockchain**: Movement L1 (Aptos Move)
- **Smart Contracts**: Move language
- **AI/ML**: HuggingFace Inference API
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **SDK**: Aptos TypeScript SDK (Movement compatible)

## Architecture

```
User/DAO → Frontend → AI Agent → Move Contract → Movement L1
                ↓
         HuggingFace API
```

The system follows a clear flow:
1. User connects wallet and views treasury state
2. AI agent analyzes treasury health and market conditions
3. AI generates structured decision (rebalance/hold) with confidence score
4. User reviews AI recommendation
5. Transaction executes on Movement L1
6. Results confirmed on-chain with explorer link

## Quick Start

See [SETUP.md](SETUP.md) for detailed setup instructions.

```bash
# Install dependencies
npm install

# Configure Movement wallet (see SETUP.md)

# Run development server
npm run dev
```

## Project Structure

```
/move/treasury_guardian/    - Move smart contracts
/app/                        - Next.js frontend (app router)
/components/                 - React UI components
/lib/                        - SDK adapters and utilities
  /movement/                 - Movement SDK integration
  /ai/                       - AI decision engine
```

## Demo

For a complete demo walkthrough, see [DEMO.md](DEMO.md).

## Security

- All treasury mutations require signer verification
- Timestamp-based replay protection
- Event emission for full auditability
- Minimal, auditable contract logic

## License

MIT

## Built For

Movement L1 Hackathon - Showcasing the power of Move-based financial automation with AI-driven decision making.

