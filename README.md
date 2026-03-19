# BTCFlow - Bitcoin-Native UX Layer for sBTC DeFi

One-click Bitcoin DeFi. No Stacks wallet. No bridge confusion. No friction.

## Overview

BTCFlow is a web portal that lets Bitcoin holders use DeFi on Stacks without ever needing a Stacks wallet, without manually bridging BTC, and without understanding smart contracts. Users connect their normal Bitcoin wallet (Unisat, Xverse, or Leather), and everything else — the bridge, the Stacks transactions, the contract calls — happens invisibly in the background.

## Problem Statement

Stacks has built something genuinely powerful: sBTC allows real Bitcoin to be used in DeFi. But the setup process is painful:

1. Download and set up a Stacks wallet (separate from Bitcoin wallet)
2. Learn what sBTC is and why you need it
3. Go to a bridge interface and initiate a peg-in transaction
4. Wait 15-30 minutes for Bitcoin confirmations
5. Watch for a Stacks notification that sBTC arrived
6. Navigate to a DeFi protocol and connect Stacks wallet
7. Sign a Clarity contract transaction (which looks nothing like a Bitcoin transaction)
8. Repeat in reverse when withdrawing

**Result:** 77% of Bitcoin holders are interested in Bitcoin DeFi but have never tried it. The #1 reason cited is complexity of setup.

## Solution

BTCFlow removes all friction by:

- **One Bitcoin wallet connection** - No Stacks wallet needed
- **Invisible bridge** - sBTC minting happens automatically
- **Silent Stacks transactions** - All contract calls signed in the background
- **Real-time status** - See exactly what's happening at each step
- **One-click DeFi** - Swap, lend, or earn with a single click

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TailwindCSS** - Utility-first styling
- **TypeScript** - Type safety

### State Management
- **Zustand** - Lightweight global state

### Blockchain Integration
- **sats-connect** - Bitcoin wallet connection (Unisat, Xverse)
- **@stacks/transactions** - Clarity contract calls
- **@stacks/wallet-sdk** - Stacks keypair generation
- **@stacks/network** - Network configuration
- **bitcoinjs-lib** - Bitcoin utilities

### APIs
- **Mempool.space** - Bitcoin transaction monitoring
- **Hiro Platform API** - Stacks blockchain data
- **Emily API** - sBTC bridge status (when available)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── balance/route.ts          # Balance polling endpoint
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Dashboard page
├── components/
│   ├── WalletConnector.tsx           # Bitcoin wallet connection UI
│   ├── Dashboard.tsx                 # Main dashboard with balances
│   └── DepositWizard.tsx             # Deposit flow (WIP)
├── lib/
│   ├── store.ts                      # Zustand state management
│   ├── bitcoin.ts                    # Bitcoin utilities
│   └── stacks.ts                     # Stacks utilities
└── types/
    └── bitcoin.ts                    # Bitcoin provider types
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Bitcoin wallet extension (Unisat or Xverse)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd btcflow

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_MEMPOOL_API=https://mempool.space/testnet/api
```

## Development Roadmap

### Phase 1: Foundation ✅
- [x] Next.js scaffold with TailwindCSS
- [x] Bitcoin wallet connection (Unisat/Xverse)
- [x] Dashboard with balance display
- [x] Zustand state management
- [x] Mempool.space API integration
- [x] API route for balance polling

### Phase 2: Deposit Flow (In Progress)
- [ ] Generate deposit address via sbtc-lib
- [ ] BTC transaction signing
- [ ] Confirmation polling
- [ ] Emily API integration
- [ ] sBTC minting monitoring
- [ ] TransactionStatusBar component

### Phase 3: DeFi Action
- [ ] ALEX SDK integration (or alternative)
- [ ] Swap interface
- [ ] Clarity contract calls
- [ ] Transaction history

### Phase 4: Security & Production (Post-Hackathon)
- [ ] TurnKey TEE-based key management
- [ ] Passkey authentication
- [ ] Security audit
- [ ] Spending limits

### Phase 5: Multi-Protocol & Withdrawal
- [ ] Withdrawal flow (sBTC → BTC)
- [ ] Zest lending integration
- [ ] BitFlow liquidity integration
- [ ] Yield tracking

### Phase 6: Production Launch
- [ ] Mainnet deployment
- [ ] Analytics integration
- [ ] Stacks Endowment grant application
- [ ] Developer API

## Key Features

### Embedded Wallet System

For MVP (hackathon):
- Generate Stacks keypair in-browser on first visit
- Store encrypted private key in localStorage
- Derive encryption key from BTC wallet signature
- All Stacks transactions signed silently

For Production:
- TurnKey TEE-based key management
- Passkey-based authentication
- Institutional-grade security

### State Management

Zustand store tracks:
- BTC address & public key
- BTC balance (polled every 30s)
- Stacks address (derived from keypair)
- sBTC balance (polled every 30s)
- Connection status
- Transaction queue

### API Routes

- `GET /api/balance?btc=<address>&stacks=<address>` - Fetch balances from Mempool & Stacks APIs

## Testing

### Local Testing with Testnet

1. Install Unisat or Xverse browser extension
2. Create a testnet wallet
3. Get testnet BTC from a [faucet](https://testnet-faucet.mempool.space/)
4. Connect wallet in BTCFlow
5. See balance update in real-time

### Build & Test

```bash
# Build for production
npm run build

# Run production build locally
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## Architecture Decisions

### Why Zustand?
- Lightweight and simple
- No boilerplate
- Perfect for this use case
- Easy to test

### Why Next.js App Router?
- Server Components by default (better performance)
- Built-in API routes
- Streaming support
- Better TypeScript support

### Why Embedded Wallet?
- Users never see Stacks
- No seed phrase management
- Seamless UX
- Can upgrade to TurnKey for production

## Security Considerations

### MVP (Hackathon)
- Private key stored in encrypted localStorage
- Encryption key derived from BTC signature
- **Not production-grade** - for demo purposes only

### Production
- TurnKey TEE-based key management
- Keys never exposed to application
- Passkey-based authentication
- Spending limits
- Transaction approval flow

## Known Limitations

### MVP
- No withdrawal flow yet
- Single DeFi protocol (ALEX)
- No multi-wallet support
- Testnet only
- No mobile app

### Future Improvements
- Multiple DeFi protocols
- Yield aggregation
- Strategy routing
- Mobile PWA
- Developer API

## Contributing

This is a hackathon project. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Resources

- [BTCFlow PRD](../BTCFlow_PRD.md) - Full product requirements document
- [Next.js Documentation](https://nextjs.org/docs)
- [Stacks Documentation](https://docs.stacks.co)
- [sBTC Bridge](https://www.stacks.co/sbtc)
- [Mempool.space API](https://mempool.space/api)
- [sats-connect](https://github.com/leather-io/sats-connect)

## License

MIT

## Support

For questions or issues:
- Open an issue on GitHub
- Check the [BTCFlow PRD](../BTCFlow_PRD.md) for detailed specifications
- Review the [Setup Guide](./BTCFLOW_SETUP.md)

---

**Built for Buidl Battle 2026 | Stacks Ecosystem**

One-click Bitcoin DeFi. No Stacks wallet. No bridge confusion. No friction.
