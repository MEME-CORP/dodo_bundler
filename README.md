# Solana Dodo Bundler

## Overview

Solana Dodo Bundler is a web application designed to streamline the process of creating and managing Solana token launches, specifically optimized for pump.fun-style token creation and trading. The application provides a user-friendly interface for generating wallets, funding them, and executing token creation and buy transactions.

## Features

- 🚀 Wallet Generation
  - Create multiple trader wallets (5-25 wallets)
  - Automatic dev and airdrop wallet creation
  - Secure wallet management

- 💰 Token Launch Workflow
  - Upload custom token image
  - Configure token metadata (name, symbol, description)
  - Set social media links
  - Specify transaction parameters

- 🔒 Solana Blockchain Integration
  - Uses Jito bundler for transaction submission
  - Supports mainnet transactions
  - Handles transaction simulation and confirmation

## Prerequisites

- Node.js (v14+ recommended)
- Solana CLI
- Solana wallet with sufficient SOL for transactions

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/solana-dodo-bundler.git
cd solana-dodo-bundler
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with your Solana RPC endpoint
```
SOLANA_MAINNET_TURBO_RPC=https://your-solana-rpc-endpoint.com
```

## Usage

1. Start the server
```bash
npm start
```

2. Open `http://localhost:3000` in your browser

3. Follow the step-by-step process:
   - Enter number of trader wallets
   - Create and fund wallets
   - Upload token image
   - Configure token details
   - Launch token

## Configuration Options

- Number of Trader Wallets: 5-25
- Funding Amount per Wallet
- Token Metadata
- Transaction Slippage
- Priority Fees

## Security Notes

- Never share your private keys
- Use testnet for initial testing
- Ensure sufficient SOL balance for transactions

## Technologies

- Frontend: HTML, JavaScript
- Backend: Node.js, Express
- Blockchain: Solana Web3.js
- Transaction Bundling: Jito

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Disclaimer

This tool is for educational purposes. Always understand the risks involved in cryptocurrency and token trading.

## Contact

Project Link: [https://github.com/yourusername/solana-dodo-bundler](https://github.com/yourusername/solana-dodo-bundler)
