# BTCFlow Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              BTCFlow Web Application                      │   │
│  │  (Next.js 16 + React 19 + TailwindCSS)                   │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Pages & Components                                │  │   │
│  │  │  - Dashboard (balance display)                     │  │   │
│  │  │  - WalletConnector (BTC wallet)                    │  │   │
│  │  │  - DepositWizard (BTC → sBTC)                      │  │   │
│  │  │  - SwapPanel (DeFi actions)                        │  │   │
│  │  │  - WithdrawForm (sBTC → BTC)                       │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  State Management (Zustand)                        │  │   │
│  │  │  - BTC address & balance                           │  │   │
│  │  │  - Stacks address & sBTC balance                   │  │   │
│  │  │  - Transaction queue                              │  │   │
│  │  │  - Connection status                              │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Embedded Wallet System                            │  │   │
│  │  │  - Generate Stacks keypair (in-browser)            │  │   │
│  │  │  - Encrypt private key (localStorage)              │  │   │
│  │  │  - Sign Clarity transactions (silent)              │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Blockchain Integration                            │  │   │
│  │  │  - sats-connect (Bitcoin wallet)                   │  │   │
│  │  │  - @stacks/transactions (Clarity calls)            │  │   │
│  │  │  - @stacks/wallet-sdk (Keypair generation)         │  │   │
│  │  │  - bitcoinjs-lib (BTC utilities)                   │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Bitcoin Wallet Extension                     │   │
│  │  (Unisat / Xverse / Leather)                             │   │
│  │  - Request accounts                                      │   │
│  │  - Get public key                                        │   │
│  │  - Sign BTC transactions                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External APIs                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │  Mempool.space API   │  │  Hiro Stacks API     │             │
│  │  - BTC balance       │  │  - sBTC balance      │             │
│  │  - TX confirmations  │  │  - Contract events   │             │
│  │  - TX status         │  │  - Account data      │             │
│  └──────────────────────┘  └──────────────────────┘             │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │  Emily API           │  │  ALEX Protocol       │             │
│  │  - sBTC peg-in       │  │  - Swap quotes       │             │
│  │  - sBTC peg-out      │  │  - Liquidity pools   │             │
│  │  - Bridge status     │  │  - Contract calls    │             │
│  └──────────────────────┘  └──────────────────────┘             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Blockchain Networks                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │  Bitcoin Network     │  │  Stacks Network      │             │
│  │  - Testnet/Mainnet   │  │  - Testnet/Mainnet   │             │
│  │  - BTC transactions  │  │  - Clarity contracts │             │
│  │  - sBTC peg-in       │  │  - sBTC minting      │             │
│  └──────────────────────┘  └──────────────────────┘             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Wallet Connection Flow

```
User clicks "Connect Wallet"
    ↓
sats-connect opens wallet provider
    ↓
User approves in Unisat/Xverse
    ↓
App receives BTC address & public key
    ↓
Generate Stacks keypair (in-browser)
    ↓
Encrypt private key with BTC-signature-derived key
    ↓
Store in localStorage
    ↓
Fetch BTC balance from Mempool.space
    ↓
Store in Zustand
    ↓
Dashboard displays balance
```

### 2. Deposit Flow (BTC → sBTC)

```
User enters amount & clicks "Deposit"
    ↓
Generate deposit address via sbtc-lib
    ↓
Display address to user
    ↓
User signs BTC transaction in wallet
    ↓
Poll Mempool.space for confirmations
    ↓
On 1+ confirmations: call Emily API
    ↓
Emily API initiates sBTC peg-in
    ↓
Monitor Stacks API for sBTC minting
    ↓
On completion: update dashboard balance
    ↓
Show transaction history
```

### 3. DeFi Action Flow (Swap via ALEX)

```
User enters swap amount
    ↓
Fetch swap quote from ALEX SDK
    ↓
Display estimated output & fee
    ↓
User clicks "Confirm"
    ↓
Build Clarity contract-call transaction
    ↓
Sign with embedded Stacks keypair (silent)
    ↓
Broadcast to Stacks network
    ↓
Poll Stacks API for confirmation
    ↓
Update balances
    ↓
Show in transaction history
```

### 4. Withdrawal Flow (sBTC → BTC)

```
User enters BTC address & amount
    ↓
Build sBTC withdrawal transaction
    ↓
Sign with embedded Stacks keypair (silent)
    ↓
Broadcast to Stacks network
    ↓
Monitor withdrawal contract event
    ↓
Call Emily API for peg-out status
    ↓
Poll Mempool.space for BTC arrival
    ↓
Show BTC transaction ID
    ↓
Update balances
```

## Component Architecture

### Page Components (Server Components by default)

```
app/
├── page.tsx                    # Root page (client component)
│   └── Renders: WalletConnector + Dashboard
│
└── api/
    └── balance/route.ts        # API endpoint for balance polling
```

### Client Components

```
components/
├── WalletConnector.tsx
│   - Handles Bitcoin wallet connection
│   - Uses sats-connect
│   - Manages connection state
│   - Calls Zustand store
│
├── Dashboard.tsx
│   - Displays BTC & sBTC balances
│   - Polls balances every 30s
│   - Shows action buttons
│   - Renders child components
│
├── DepositWizard.tsx
│   - Multi-step deposit flow
│   - Amount input
│   - Status tracking
│   - Progress bar
│
├── SwapPanel.tsx (TODO)
│   - Swap interface
│   - Quote display
│   - Slippage settings
│   - Execution
│
└── WithdrawForm.tsx (TODO)
    - Withdrawal flow
    - BTC address input
    - Amount selector
    - Status tracking
```

## State Management (Zustand)

```typescript
interface WalletState {
  // Bitcoin
  btcAddress: string | null
  btcPublicKey: string | null
  btcBalance: number
  
  // Stacks
  stacksAddress: string | null
  sbtcBalance: number
  
  // Status
  isConnected: boolean
  
  // Actions
  setWallet(address, publicKey, balance)
  setStacksAddress(address)
  setSbtcBalance(balance)
  setBtcBalance(balance)
  disconnect()
}
```

## API Routes

### GET /api/balance

Fetches current balances from external APIs.

**Query Parameters:**
- `btc` - Bitcoin address
- `stacks` - Stacks address

**Response:**
```json
{
  "btc": 0.5,
  "sbtc": 0.5,
  "stx": 100.0
}
```

**Implementation:**
- Calls Mempool.space API for BTC balance
- Calls Hiro Stacks API for sBTC & STX balances
- Caches results (optional)
- Returns JSON

## Embedded Wallet System

### MVP Approach (Hackathon)

```
1. User connects Bitcoin wallet
2. Request signed message: "BTCFlow Session Auth"
3. Derive encryption key via PBKDF2
4. Generate Stacks keypair (random)
5. Encrypt private key with derived key
6. Store in localStorage
7. Compute Stacks address (never shown to user)
8. All Stacks transactions signed with this keypair
```

**Security:** Not production-grade. For demo purposes only.

### Production Approach (Post-Hackathon)

```
1. User connects Bitcoin wallet
2. Authenticate via passkey (WebAuthn)
3. TurnKey generates Stacks keypair in TEE
4. Keys never exposed to application
5. All signing happens in secure hardware
6. User can recover via email + passkey
```

**Security:** Institutional-grade. TEE-based key management.

## Technology Choices

### Why Next.js 16?
- Server Components by default (better performance)
- Built-in API routes (no separate backend needed)
- Streaming support (real-time updates)
- Better TypeScript support
- Vercel deployment ready

### Why Zustand?
- Lightweight (no boilerplate)
- Simple API (easy to understand)
- Perfect for this use case
- Easy to test
- No provider hell

### Why TailwindCSS?
- Utility-first (fast development)
- Responsive by default
- Dark mode support
- No CSS conflicts
- Great for hackathons

### Why Embedded Wallet?
- Users never see Stacks
- No seed phrase management
- Seamless UX
- Can upgrade to TurnKey for production
- Reduces friction significantly

## Performance Considerations

### Frontend
- Client-side rendering for interactivity
- Polling every 30s for balance updates
- Debounced API calls
- Lazy loading of components

### Backend
- API routes for balance polling
- Caching of external API responses
- Error handling and retries
- Rate limiting (future)

### Blockchain
- Efficient transaction building
- Batch contract calls (future)
- Event-based updates (future)
- WebSocket support (future)

## Security Considerations

### MVP (Hackathon)
- Private key encrypted in localStorage
- Encryption key derived from BTC signature
- No server-side key storage
- **Not production-grade**

### Production
- TurnKey TEE-based key management
- Passkey authentication
- Spending limits
- Transaction approval flow
- Security audit required

### Best Practices
- Never log private keys
- Always use HTTPS
- Validate all user inputs
- Rate limit API calls
- Monitor for suspicious activity

## Scalability

### Current Limitations
- Single user per browser
- No multi-device support
- No account recovery (MVP)
- Testnet only

### Future Improvements
- Multi-device support
- Account recovery
- Mainnet support
- API for automated agents
- Mobile PWA

## Testing Strategy

### Unit Tests
- Zustand store
- Bitcoin utilities
- Stacks utilities

### Integration Tests
- Wallet connection flow
- Balance polling
- Deposit flow
- Swap flow

### E2E Tests
- Full user journey
- Error scenarios
- Edge cases

### Manual Testing
- Testnet with real wallets
- Different wallet providers
- Network failures
- Slow connections

## Deployment

### Development
```bash
npm run dev
# http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

### Deployment Platforms
- Vercel (recommended)
- Netlify
- AWS Amplify
- Self-hosted

### Environment Configuration
- Testnet vs Mainnet
- API endpoints
- Feature flags
- Analytics

## Monitoring & Logging

### Frontend
- Error tracking (Sentry)
- Analytics (PostHog)
- Performance monitoring (Web Vitals)

### Backend
- API logs
- Error logs
- Performance metrics

### Blockchain
- Transaction monitoring
- Event tracking
- Bridge status monitoring

## Future Enhancements

### Phase 4: Security
- TurnKey integration
- Passkey authentication
- Spending limits
- Security audit

### Phase 5: Multi-Protocol
- Zest lending
- BitFlow liquidity
- Yield aggregation
- Strategy routing

### Phase 6: Production
- Mainnet deployment
- Analytics
- Grant applications
- Developer API

---

For more details, see [README.md](./README.md) and [BTCFlow_PRD.md](../BTCFlow_PRD.md).
