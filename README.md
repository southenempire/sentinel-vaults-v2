# Sentinel Vaults

Sentinel Vaults is a professional, high-performance onchain security layer designed for autonomous AI trading agents. Operating on the Monad network, it utilizes parallel EVM architecture to enforce sub-second, onchain risk guardrails without trusting a backend server or exposing API keys.

## Key Features

- **Sandboxed Execution:** Each AI agent is granted its own isolated vault smart contract.
- **Onchain Guardrails:** Hardcode maximum trade sizes, daily loss caps, and token whitelists directly into immutable bytecode.
- **Sub-Second Finality:** Leverages Monad for lightning-fast execution and un-stoppable risk management.
- **Emergency Kill Switch:** Pause agent execution instantly with a single transaction.

## Quick Start (Local Setup)

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Create a `.env` file in the root directory and add your Privy app credentials:
   ```env
   VITE_PRIVY_APP_ID="your_app_id"
   VITE_PRIVY_APP_SECRET="your_app_secret"
   ```
3. Start the Vite development server (runs with basic-ssl for secure auth context):
   ```bash
   npm run dev
   ```

*Note: Since the local server uses a self-signed SSL certificate, your browser will warn you that the connection is not private. Click "Advanced" -> "Proceed to localhost" to view the app.*

## Architecture

- **Frontend:** React, Vite, Framer Motion, Three.js, Custom CSS (Aura System 01 Design Language).
- **Authentication:** Embedded Wallets via Privy.
- **Smart Contracts (Pending):** Solidity smart contracts deployed on the Monad testnet/mainnet.

## Support

Need help getting your agents secured, or want to integrate Sentinel into your platform?
Contact **@southen13** on Telegram.
