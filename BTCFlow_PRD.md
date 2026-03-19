**BTCFlow**

Bitcoin-Native UX Layer for sBTC DeFi

+-----------------+-----------------+-----------------+-----------------+
| **\$20K**       | **Buidl         | **Stacks**      | **sBTC**        |
|                 | Battle**        |                 |                 |
| Prize Pool      |                 | Ecosystem       | DeFi            |
|                 | 2026            |                 |                 |
+-----------------+-----------------+-----------------+-----------------+

Product Requirements Document v1.0 \| March 2026

*One-click Bitcoin DeFi. No Stacks wallet. No bridge confusion. No
friction.*

**1. Executive Summary**

BTCFlow is a web portal that lets Bitcoin holders use DeFi on Stacks ---
without ever needing a Stacks wallet, without manually bridging BTC, and
without understanding smart contracts. Users connect their normal
Bitcoin wallet (Unisat, Xverse, or Leather), and everything else --- the
bridge, the Stacks transactions, the contract calls --- happens
invisibly in the background.

The core problem it solves: sBTC makes Bitcoin programmable on Stacks,
but almost nobody uses it because the setup process is painful. BTCFlow
removes that friction completely.

+-----------------------------------------------------------------------+
| **The One-Line Pitch**                                                |
|                                                                       |
| You connect your Bitcoin wallet. You see your BTC balance. You click  |
| Swap or Earn. BTC comes back to you. Stacks never appears on screen.  |
+-----------------------------------------------------------------------+

**Why This Wins in Buidl Battle 2026**

  ------------------------ ----------------------------------------------
  **Judging Criterion**    **How BTCFlow Scores**

  **Innovation**           No live portal exists today that does full BTC
                           → sBTC → DeFi → BTC with Stacks completely
                           hidden

  **Technical Depth**      Requires Bitcoin wallet integration, embedded
                           Stacks wallet, sBTC bridge monitoring, and
                           contract calls --- all stitched together

  **Stacks Alignment**     Uses sBTC, Clarity contracts, stacks.js, and
                           protocols like ALEX --- core Stacks
                           infrastructure

  **User Experience**      Non-technical Bitcoin holders can use Stacks
                           DeFi without knowing Stacks exists

  **Impact Potential**     If this works, every Bitcoin holder is a
                           potential Stacks DeFi user --- millions of
                           wallets
  ------------------------ ----------------------------------------------

**2. The Problem (In Plain English)**

Stacks has built something genuinely powerful: sBTC allows real Bitcoin
to be used in DeFi --- swapping, lending, earning yield. The
infrastructure exists. ALEX, Zest, BitFlow, and other protocols are
live.

But here is the real situation on the ground today. A Bitcoin holder who
wants to try Stacks DeFi has to:

1.  Download and set up a Stacks wallet (Leather or Xverse) --- separate
    from their Bitcoin wallet

2.  Learn what sBTC is and why they need it

3.  Go to a bridge interface, initiate a peg-in transaction

4.  Wait 15--30 minutes for Bitcoin confirmations

5.  Watch for a Stacks notification that sBTC arrived

6.  Navigate to a DeFi protocol and connect their Stacks wallet

7.  Sign a Clarity contract transaction (which looks nothing like a
    Bitcoin transaction)

8.  Repeat steps in reverse when withdrawing

+-----------------------------------------------------------------------+
| **The Result**                                                        |
|                                                                       |
| 77% of Bitcoin holders surveyed say they are interested in Bitcoin    |
| DeFi but have never tried it. The #1 reason cited is complexity of    |
| setup. This is the gap BTCFlow fills.                                 |
+-----------------------------------------------------------------------+

**Who Has This Problem**

  ----------------- ------------------------ ------------------------------
  **User Type**     **Their Situation**      **What They Want**

  **Long-term BTC   Holds BTC on Ledger or   A way to earn without learning
  Holder**          Unisat. Curious about    a new ecosystem
                    yield but has never      
                    touched Stacks.          

  **Crypto-Native   Comfortable with DeFi on A faster, cleaner interface
  Explorer**        Ethereum or Solana.      than current options
                    Wants to try Stacks but  
                    finds it clunky.         

  **Passive Yield   Wants BTC to work for    Set it, forget it yield on
  Seeker**          them. Has seen 4--8% APY Bitcoin
                    numbers but cannot       
                    navigate to them.        

  **Future:         Bot or fund manager      Clean API over sBTC DeFi flows
  Automated Agent** needing programmatic     
                    access to sBTC           
                    liquidity.               
  ----------------- ------------------------ ------------------------------

**3. The Solution**

BTCFlow is a single-page web application. From the user\'s perspective,
it is simple. From the technical side, it is doing a lot of heavy
lifting invisibly.

**What the User Sees**

  --------------- -------------------------------------------------------
  **Step**        **User Action**

  **Step 1**      Open BTCFlow in a browser. Click Connect Wallet.
                  Approve in Unisat or Xverse.

  **Step 2**      See their BTC balance displayed on a clean dashboard.
                  Nothing else.

  **Step 3**      Click Deposit. Enter amount. One BTC transaction. Done.

  **Step 4**      Dashboard shows sBTC arriving (status bar). No manual
                  steps.

  **Step 5**      Click Swap or Earn Yield. Confirm with one click.
                  Transaction happens.

  **Step 6**      Click Withdraw. Enter BTC address. Funds return to
                  Bitcoin wallet.
  --------------- -------------------------------------------------------

**What Happens Behind the Scenes**

  ------------------------ ----------------------------------------------
  **Invisible Step**       **What BTCFlow Is Actually Doing**

  **Wallet Connection**    Reads BTC public key and address from
                           connected wallet. Derives a temporary Stacks
                           keypair silently.

  **Deposit Monitoring**   Watches the Bitcoin network for the deposit
                           transaction via a blockchain indexer API.

  **sBTC Minting**         On confirmation, calls the sBTC deposit
                           contract on Stacks using the background
                           keypair.

  **DeFi Execution**       Builds and signs a Clarity contract call (ALEX
                           swap or similar) using embedded Stacks signer.

  **Bridge Withdrawal**    Submits sBTC withdrawal request to Stacks
                           contract. Monitors until BTC lands back.

  **Status Updates**       Polls Emily API and Stacks explorer for
                           real-time confirmation counts and statuses.
  ------------------------ ----------------------------------------------

**4. Technical Architecture**

This section documents every layer of the stack --- frontend, embedded
wallet, blockchain interaction, APIs, and data flow --- with the
specific libraries and frameworks for each.

**4.1 Full Stack Overview**

  -------------- ----------------------------- ------------------------------------
  **Layer**      **Technology**                **Responsibility**

  **Frontend     Next.js 14 + React +          Dashboard, wallet connection, status
  UI**           TailwindCSS                   display, DeFi action interface

  **State        Zustand                       Global app state: wallet, balances,
  Management**                                 transaction queue, status polling

  **Bitcoin      Unisat SDK / Sats-connect     Read BTC address and balance, sign
  Wallet**       (Xverse)                      BTC transactions

  **Embedded     TurnKey or local keypair      Generate and store Stacks keypair,
  Wallet**       (MVP)                         sign Clarity transactions invisibly

  **sBTC         sbtc-lib (Stacks Labs SDK)    Build deposit and withdrawal
  Bridge**                                     transactions, monitor peg-in/out
                                               status

  **Stacks       stacks.js +                   Build, sign, and broadcast Clarity
  Contracts**    \@stacks/transactions         contract calls

  **DeFi         ALEX SDK                      Execute swaps, liquidity actions on
  Protocol**     (alexlab-protocol/alex-sdk)   ALEX

  **Bitcoin      Mempool.space API or          Confirm BTC deposits, track
  Network**      BlockStream API               withdrawal transactions

  **Stacks       Hiro Platform API / Stacks    Monitor sBTC minting, contract
  Network**      Blockchain API                events, balances

  **Bridge       Emily API (Stacks Labs)       Get real-time sBTC peg-in and
  Status**                                     peg-out status

  **Backend      Node.js + Express (serverless Webhook relay, key encryption at
  (Optional)**   on Vercel)                    rest, session management

  **Hosting**    Vercel                        Frontend and API routes, instant
                                               deployment, global CDN
  -------------- ----------------------------- ------------------------------------

**4.2 Frontend Structure (Next.js)**

The application is a single Next.js 14 app using the App Router. All
pages are client-side rendered for wallet interaction. TailwindCSS
handles all styling --- no component library needed for the MVP.

**Page Structure**

  --------------------- -------------------------------------------------
  **Route / Page**      **Purpose**

  **/ (Dashboard)**     Main view: BTC balance, sBTC balance, recent
                        transactions, action buttons

  **/deposit**          Deposit flow: amount input, generated address,
                        status tracker

  **/swap**             DeFi action: one-click swap interface powered by
                        ALEX SDK

  **/yield**            Yield/lend interface (Phase 2 --- not in MVP)

  **/withdraw**         Withdrawal flow: enter BTC address, amount,
                        submit and track

  **/history**          Transaction history: all deposits, actions,
                        withdrawals with status
  --------------------- -------------------------------------------------

**Key Frontend Components**

-   WalletConnector --- handles Unisat and Xverse connection via
    sats-connect

-   BalanceTicker --- polls Stacks API every 30s for sBTC balance
    updates

-   TransactionStatusBar --- shows live confirmation progress for
    in-flight transactions

-   DepositWizard --- multi-step deposit flow with real-time status
    polling

-   SwapPanel --- ALEX SDK integration, quote display, one-click
    execution

-   WithdrawForm --- destination address input, amount selector,
    withdrawal initiation

**4.3 Embedded Wallet System**

This is the most critical and novel piece of BTCFlow. The user never
sees a Stacks wallet. But behind the scenes, every Stacks transaction
must be signed by a Stacks keypair. Here is how that works.

**MVP Approach (Hackathon)**

+-----------------------------------------------------------------------+
| **Simple Local Keypair**                                              |
|                                                                       |
| For the hackathon demo, generate a Stacks keypair in-browser on first |
| visit. Store the private key in encrypted localStorage (AES-256 with  |
| a user-derived key from their BTC signature). The user sees nothing.  |
| Stacks signs happen silently. This is not production-grade but is     |
| sufficient to demonstrate the UX.                                     |
+-----------------------------------------------------------------------+

**Production Approach (Post-Hackathon)**

+-----------------------------------------------------------------------+
| **TurnKey Integration**                                               |
|                                                                       |
| TurnKey provides Trusted Execution Environment (TEE) based key        |
| management. Keys are generated inside secure hardware, never exposed  |
| to the application server. Users authenticate via passkey or email    |
| OTP. This removes all seed phrase management and gives                |
| institutional-grade security.                                         |
+-----------------------------------------------------------------------+

**Embedded Wallet Flow**

9.  User connects Bitcoin wallet (Unisat/Xverse)

10. App requests a signed message from their BTC wallet: \'BTCFlow
    Session Auth\'

11. That signature is used to derive an encryption key via PBKDF2

12. A new Stacks keypair is generated (or decrypted if returning user)

13. The Stacks address is computed but never shown to the user

14. All Stacks transactions are signed with this keypair, invisible to
    the user

**5. Core User Flows**

Each flow below documents both what the user experiences and the exact
technical steps happening in the background. These are the flows judges
will see in the demo.

**Flow 1: Connect Wallet**

+-----------------------------------+-----------------------------------+
| **User Sees**                     | **Behind the Scenes**             |
|                                   |                                   |
| 15. Connect Wallet button on      | 19. sats-connect opens wallet     |
|     landing page                  |     provider                      |
|                                   |                                   |
| 16. Wallet popup from Unisat or   | 20. App receives BTC public key + |
|     Xverse                        |     address                       |
|                                   |                                   |
| 17. Approve button --- one click  | 21. Queries Mempool.space API for |
|                                   |     BTC balance                   |
| 18. Dashboard loads with BTC      |                                   |
|     balance                       | 22. Generates or decrypts         |
|                                   |     embedded Stacks keypair       |
|                                   |                                   |
|                                   | 23. Queries Stacks API for any    |
|                                   |     existing sBTC balance         |
|                                   |                                   |
|                                   | 24. Dashboard state initialised   |
|                                   |     in Zustand                    |
+-----------------------------------+-----------------------------------+

**Flow 2: BTC → sBTC Deposit**

+-----------------------------------+-----------------------------------+
| **User Sees**                     | **Behind the Scenes**             |
|                                   |                                   |
| 25. Clicks Deposit BTC button     | 31. sbtc-lib generates a deposit  |
|                                   |     address linked to embedded    |
| 26. Enters amount (e.g. 0.01 BTC) |     Stacks keypair                |
|                                   |                                   |
| 27. Sees a Bitcoin deposit        | 32. User signs and broadcasts BTC |
|     address                       |     transaction via wallet        |
|                                   |                                   |
| 28. Approves in their BTC wallet  | 33. Polls Mempool.space every 30s |
|     --- one signature             |     for confirmation count        |
|                                   |                                   |
| 29. Progress bar: Broadcast →     | 34. On 1+ confirmations: calls    |
|     Confirming (1/6) → sBTC       |     Emily API to initiate peg-in  |
|     Minting → Ready               |                                   |
|                                   | 35. Monitors sBTC deposit         |
| 30. Dashboard balance updates     |     contract event via Stacks API |
|                                   |                                   |
|                                   | 36. On mint confirmation: updates |
|                                   |     Zustand state + dashboard     |
+-----------------------------------+-----------------------------------+

**Flow 3: DeFi Action (Swap via ALEX)**

+-----------------------------------+-----------------------------------+
| **User Sees**                     | **Behind the Scenes**             |
|                                   |                                   |
| 37. Clicks Swap on dashboard      | 42. ALEX SDK fetches current swap |
|                                   |     quote from ALEX on-chain AMM  |
| 38. Sees: sBTC amount, estimated  |                                   |
|     STX output, fee               | 43. App builds a Clarity          |
|                                   |     contract-call transaction     |
| 39. Clicks Confirm --- one click  |     (swap function)               |
|                                   |                                   |
| 40. Transaction in progress       | 44. Embedded Stacks keypair signs |
|     indicator                     |     the transaction silently      |
|                                   |                                   |
| 41. Balance updated on completion | 45. \@stacks/transactions         |
|                                   |     broadcasts to Stacks network  |
|                                   |                                   |
|                                   | 46. Polls Stacks API for          |
|                                   |     transaction confirmation      |
|                                   |                                   |
|                                   | 47. Updates sBTC and STX balances |
|                                   |     in state                      |
+-----------------------------------+-----------------------------------+

**Flow 4: Withdraw Back to BTC**

+-----------------------------------+-----------------------------------+
| **User Sees**                     | **Behind the Scenes**             |
|                                   |                                   |
| 48. Clicks Withdraw               | 54. sbtc-lib builds withdrawal    |
|                                   |     transaction to sBTC           |
| 49. BTC address auto-filled from  |     withdrawal contract           |
|     connected wallet              |                                   |
|                                   | 55. Embedded Stacks keypair signs |
| 50. Enters amount                 |     and broadcasts                |
|                                   |                                   |
| 51. Clicks Confirm                | 56. Monitors withdrawal contract  |
|                                   |     event on Stacks               |
| 52. Status: Submitting →          |                                   |
|     Processing → BTC on the way → | 57. Emily API confirms peg-out    |
|     Complete                      |     initiated                     |
|                                   |                                   |
| 53. BTC transaction ID shown with | 58. Polls Mempool.space for BTC   |
|     link to explorer              |     transaction arrival           |
|                                   |                                   |
|                                   | 59. Shows Bitcoin txid and        |
|                                   |     confirmation count            |
+-----------------------------------+-----------------------------------+

**6. Build Roadmap --- Phase by Phase**

This roadmap assumes you are building solo or with a small team. Each
phase has a clear goal, specific deliverables, and ends with something
working and demoable. Phases 1--3 cover the hackathon. Phases 4--6 are
the post-hackathon production path.

+------------+---------------------------------------------------------+
| **PHASE    | **Foundation: Wallet Connection + Dashboard Shell**     |
| 1**        |                                                         |
|            |                                                         |
| Days 1--3  |                                                         |
+------------+---------------------------------------------------------+

+-----------------------------------------------------------------------+
| **Goal**                                                              |
|                                                                       |
| A working Next.js app where users can connect Unisat or Xverse and    |
| see their BTC balance on a clean dashboard.                           |
+-----------------------------------------------------------------------+

**Tasks**

-   Scaffold Next.js 14 app with TailwindCSS and Zustand

-   Install sats-connect: npm install sats-connect

-   Implement WalletConnector component --- supports Unisat and Xverse

-   On connection: read BTC address and public key, store in Zustand

-   Call Mempool.space API to fetch BTC balance: GET
    /api/address/{address}

-   Build Dashboard layout: BTC balance, wallet address (truncated),
    action buttons (disabled for now)

-   Implement embedded keypair generation: generateWallet from
    \@stacks/wallet-sdk

-   Store encrypted Stacks private key in localStorage (AES with
    BTC-sig-derived key)

**Deliverable**

+-----------------------------------------------------------------------+
| **Phase 1 Done When\...**                                             |
|                                                                       |
| Connect Unisat → dashboard loads with real BTC balance → Stacks       |
| keypair generated invisibly → nothing Stacks-related visible to user. |
+-----------------------------------------------------------------------+

+------------+---------------------------------------------------------+
| **PHASE    | **Deposit Flow: BTC → sBTC on Testnet**                 |
| 2**        |                                                         |
|            |                                                         |
| Days 4--7  |                                                         |
+------------+---------------------------------------------------------+

+-----------------------------------------------------------------------+
| **Goal**                                                              |
|                                                                       |
| User deposits BTC (testnet) and sees sBTC appear in dashboard. The    |
| bridge flow works end to end.                                         |
+-----------------------------------------------------------------------+

**Tasks**

-   Install sbtc-lib: npm install \@stacks/sbtc

-   Use sbtc-lib to generate a deposit address tied to the embedded
    Stacks keypair

-   Build DepositWizard: amount input → show deposit address → QR code
    optional

-   Trigger BTC transaction from connected wallet using sats-connect
    sendBtcTransaction

-   Set up polling loop: Mempool.space GET /api/tx/{txid} every 30
    seconds

-   On 1 confirmation: call Emily API to check deposit status

-   Monitor Stacks API for sBTC balance increase on the embedded Stacks
    address

-   Build TransactionStatusBar component: Broadcast → Confirming (N/6) →
    Minting → Ready

-   Test end to end on Stacks testnet (use signet BTC)

**Key APIs Used**

  --------------------- ---------------------------------------------------------------------------
  **API**               **Endpoint / Usage**

  **Mempool.space       https://mempool.space/testnet/api/tx/{txid} --- confirmation count
  (testnet)**           

  **Emily API**         https://emily-testnet.api.stacks.so --- deposit status

  **Stacks API**        https://api.testnet.hiro.so/extended/v1/address/{stacks_address}/balances
                        --- sBTC balance
  --------------------- ---------------------------------------------------------------------------

**Deliverable**

+-----------------------------------------------------------------------+
| **Phase 2 Done When\...**                                             |
|                                                                       |
| Deposit 0.001 testnet BTC → dashboard shows \'Confirming 1/6\' →      |
| after confirmations shows \'sBTC Minting\' → sBTC balance appears.    |
| Full status progression visible.                                      |
+-----------------------------------------------------------------------+

+------------+---------------------------------------------------------+
| **PHASE    | **DeFi Action + Hackathon MVP Polish**                  |
| 3**        |                                                         |
|            |                                                         |
| Days 8--14 |                                                         |
+------------+---------------------------------------------------------+

+-----------------------------------------------------------------------+
| **Goal**                                                              |
|                                                                       |
| User can swap sBTC on ALEX with one click. Dashboard is polished.     |
| Pitch video recorded. Submitted to DoraHacks.                         |
+-----------------------------------------------------------------------+

**Tasks --- DeFi Integration**

-   Install ALEX SDK: npm install \@alexlab/alex-sdk

-   Use SDK to fetch swap quote: alexSDK.getAmountTo(Currency.SBTC,
    100n, Currency.STX)

-   Build SwapPanel component: show sBTC in, estimated STX out, fee,
    slippage

-   On confirm: build Clarity contract call using \@stacks/transactions
    makeContractCall

-   Sign with embedded Stacks private key:
    createStacksPrivateKey(privateKeyHex)

-   Broadcast via Stacks API: broadcastTransaction(signedTx, network)

-   Poll for transaction confirmation and update balances

**Tasks --- MVP Polish**

-   Transaction history page: list all deposits, swaps, withdrawals with
    timestamp and status

-   Error states: handle bridge delays, failed transactions,
    insufficient balance

-   Loading skeletons and progress indicators throughout

-   Mobile responsive layout (judges use phones too)

-   Connect to mainnet for demo (or keep testnet --- either works for
    hackathon)

-   Record pitch video: problem → demo → why Stacks → impact (under 5
    minutes)

-   Write GitHub README with architecture diagram, setup instructions,
    and tech stack

**Deliverable**

+-----------------------------------------------------------------------+
| **Phase 3 Done When\...**                                             |
|                                                                       |
| Full demo works: Connect wallet → Deposit BTC → See sBTC → Swap on    |
| ALEX → Transaction history shows all steps. Submitted to DoraHacks    |
| with GitHub repo, working demo link, and pitch video.                 |
+-----------------------------------------------------------------------+

+------------+---------------------------------------------------------+
| **PHASE    | **Security + Production Wallet (Post-Hackathon)**       |
| 4**        |                                                         |
|            |                                                         |
| Weeks 3--5 |                                                         |
+------------+---------------------------------------------------------+

+-----------------------------------------------------------------------+
| **Goal**                                                              |
|                                                                       |
| Replace the localStorage keypair with TurnKey TEE-based key           |
| management. Users can log back in with passkey and their wallet       |
| persists securely.                                                    |
+-----------------------------------------------------------------------+

**Tasks**

-   Integrate TurnKey SDK: npm install \@turnkey/sdk-browser

-   Replace localStorage keypair with TurnKey sub-organization per user

-   Implement passkey-based login (WebAuthn): TurnKey handles this
    natively

-   Migrate key signing: use TurnKey signRawPayload for Stacks
    transaction signing

-   Test key recovery flow: user loses device, recovers via email +
    passkey

-   Security audit: check for replay attacks, transaction spoofing, key
    exposure

-   Set spending limits: no single transaction \> 0.1 BTC without
    explicit re-auth

+------------+---------------------------------------------------------+
| **PHASE    | **Multi-Protocol DeFi + Withdrawal Flow**               |
| 5**        |                                                         |
|            |                                                         |
| Weeks 5--8 |                                                         |
+------------+---------------------------------------------------------+

+-----------------------------------------------------------------------+
| **Goal**                                                              |
|                                                                       |
| Add withdrawal flow (sBTC → BTC) and integrate a second DeFi protocol |
| (Zest for lending or BitFlow for liquidity).                          |
+-----------------------------------------------------------------------+

**Tasks**

-   Build withdrawal flow using sbtc-lib withdrawSbtc function

-   Build WithdrawForm component with BTC destination, amount, and
    status tracking

-   Monitor withdrawal: Stacks contract event → Emily API peg-out → BTC
    txid display

-   Integrate Zest lending: deposit sBTC as collateral, borrow
    stablecoins

-   Or integrate BitFlow: provide sBTC/STX liquidity, track LP tokens

-   Build protocol selector on dashboard: Swap / Lend / Liquidity tabs

-   Add yield tracking: show current APY for each protocol option

+------------+---------------------------------------------------------+
| **PHASE    | **Production Launch + Ecosystem Growth**                |
| 6**        |                                                         |
|            |                                                         |
| Weeks      |                                                         |
| 9--12      |                                                         |
+------------+---------------------------------------------------------+

+-----------------------------------------------------------------------+
| **Goal**                                                              |
|                                                                       |
| Production-ready app with real users. Apply for Stacks Endowment      |
| Getting Started Grant (\$5K--\$10K). Integrate more protocols. Begin  |
| API access for automated agents.                                      |
+-----------------------------------------------------------------------+

**Tasks**

-   Mainnet deployment on Vercel with custom domain

-   Analytics: track deposits, swaps, withdrawals, user retention
    (PostHog or Mixpanel)

-   Submit Stacks Endowment grant application with testnet metrics as
    proof

-   Add USDCx support (convert sBTC to stablecoin via ALEX)

-   Add Granite money markets integration

-   Developer API: REST endpoints for programmatic sBTC DeFi access

-   Mobile PWA: make the web app installable on mobile with proper
    manifest

**7. What Gets Built for the Hackathon (MVP)**

The hackathon demo does not need to be a finished product. It needs to
prove the concept works and show judges that the hard technical problems
are solved. Here is the exact MVP scope.

**In Scope --- Build This**

+-----------------------------------+-----------------------------------+
| **Must Have (Demo these)**        | **Nice to Have (Do if time        |
|                                   | allows)**                         |
| -   Bitcoin wallet connection     |                                   |
|     (Unisat / Xverse)             | -   Withdrawal flow (sBTC → BTC)  |
|                                   |                                   |
| -   BTC balance display on        | -   Mobile responsive UI          |
|     dashboard                     |                                   |
|                                   | -   Multiple wallet support       |
| -   BTC deposit flow with real    |                                   |
|     sBTC minting (testnet)        | -   Mainnet vs testnet toggle     |
|                                   |                                   |
| -   Live deposit status progress  | -   Slippage settings for swap    |
|     bar                           |                                   |
|                                   |                                   |
| -   One DeFi action: sBTC swap on |                                   |
|     ALEX                          |                                   |
|                                   |                                   |
| -   Transaction history with      |                                   |
|     status                        |                                   |
+-----------------------------------+-----------------------------------+

**Out of Scope --- Do Not Build for Hackathon**

-   TurnKey production key management --- use localStorage keypair

-   Multiple DeFi protocols --- one is enough

-   Yield aggregation or strategy routing

-   Mobile app

-   Developer API / webhooks

-   Account settings, user profiles, notification preferences

**8. Dependencies and Libraries**

Every library used, why it is used, and where to find it.

  ------------------------------------ -------------------------------- ---------------------------------
  **Package**                          **Install Command**              **Used For**

  **sats-connect**                     npm i sats-connect               Connect Unisat and Xverse Bitcoin
                                                                        wallets

  **\@stacks/sbtc**                    npm i \@stacks/sbtc              sbtc-lib: generate deposit
                                                                        addresses, build peg-in/out
                                                                        transactions

  **\@stacks/transactions**            npm i \@stacks/transactions      Build, sign, and broadcast
                                                                        Clarity contract calls

  **\@stacks/wallet-sdk**              npm i \@stacks/wallet-sdk        Generate Stacks keypair from
                                                                        mnemonic or random

  **\@stacks/network**                 npm i \@stacks/network           Switch between testnet and
                                                                        mainnet configs

  **\@stacks/blockchain-api-client**   npm i                            Typed client for Hiro Stacks API
                                       \@stacks/blockchain-api-client   

  **\@alexlab/alex-sdk**               npm i \@alexlab/alex-sdk         ALEX DEX swap quotes and
                                                                        execution

  **zustand**                          npm i zustand                    Global state management (wallet,
                                                                        balances, tx queue)

  **bitcoinjs-lib**                    npm i bitcoinjs-lib              BTC address validation and
                                                                        transaction utilities

  **axios**                            npm i axios                      HTTP calls to Mempool.space,
                                                                        Emily API

  **next**                             npx create-next-app@latest       React framework with App Router

  **tailwindcss**                      npm i tailwindcss                Styling --- utility-first CSS
  ------------------------------------ -------------------------------- ---------------------------------

**9. Risks and Mitigations**

  ---------------- ---------------- -------------------------------------
  **Risk**         **Severity**     **Mitigation**

  **sbtc-lib       High             Keep a fallback: manually build
  testnet                           deposit address using known sBTC
  instability**                     contract address. Document testnet
                                    quirks.

  **Emily API      Medium           Poll Stacks API directly for sBTC
  downtime**                        balance change instead of using Emily
                                    as single source of truth

  **ALEX SDK       Medium           Build swap on testnet first. ALEX has
  mainnet vs                        testnet deployment. Confirm contract
  testnet                           addresses before demo.
  mismatch**                        

  **Embedded       Medium           For hackathon: warn user clearly. For
  keypair lost on                   production: TurnKey. In demo: use a
  browser clear**                   pre-funded test keypair.

  **BTC deposit    High             Pre-fund the embedded Stacks address
  takes too long                    with testnet sBTC before the demo.
  for live demo**                   Show the deposit flow as a recording
                                    in the pitch video.

  **sats-connect   Low              Provide a fallback: manual address
  wallet not                        entry mode where user pastes their
  installed by                      BTC address without needing wallet
  judge**                           extension
  ---------------- ---------------- -------------------------------------

**10. Success Metrics**

**Hackathon Success (March 31 deadline)**

-   Working demo: connect wallet → deposit → swap --- full flow on
    testnet

-   GitHub repo with clean README, architecture docs, setup instructions

-   Pitch video under 5 minutes that clearly demonstrates the UX before
    and after

-   Judges can run the demo themselves without needing a Stacks wallet

**Post-Hackathon Success (60-day horizon)**

  ------------------------ ----------------------------------------------
  **Metric**               **Target**

  **BTC deposits processed 50+ in first 2 weeks of public testnet
  (testnet)**              

  **sBTC volume bridged    1+ BTC equivalent within 30 days
  through portal**         

  **DeFi transactions      100+ swaps within 60 days of mainnet
  initiated**              

  **User onboarding        \>60% of wallet connects complete at least one
  conversion**             deposit

  **Grant application**    Submit Stacks Endowment Getting Started Grant
                           within 30 days of hackathon end
  ------------------------ ----------------------------------------------

**11. Ecosystem Alignment**

This is not just a product --- it is infrastructure for Stacks adoption.
Every Bitcoin holder who uses BTCFlow becomes an sBTC user, an ALEX
trader, a Zest borrower. The portal feeds every protocol in the
ecosystem rather than competing with any of them.

+-----------------------------------------------------------------------+
| **The Stacks Treasury and Endowment have explicitly listed            |
| Bitcoin-native UX as a funding priority for 2026.**                   |
|                                                                       |
| BTCFlow directly addresses the documented onboarding gap. If sBTC is  |
| the engine, BTCFlow is the ignition key.                              |
+-----------------------------------------------------------------------+

**Stacks Components Used**

-   sBTC --- the core asset the entire portal is built around

-   Clarity smart contracts --- all DeFi actions are Clarity contract
    calls

-   Proof of Transfer --- sBTC security model relies on PoX which
    BTCFlow depends on

-   stacks.js --- transaction building, signing, broadcasting

-   ALEX protocol --- first DeFi integration for swaps

-   Emily API --- sBTC bridge monitoring

-   Hiro Platform API --- Stacks blockchain data layer

**BTCFlow**

Bitcoin-Native UX Layer for sBTC DeFi

*PRD v1.0 \| Buidl Battle 2026 \| March 2026*
