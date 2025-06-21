# Aptos Wallet Connect Kit

A beautiful, easy-to-use UI component library for integrating WalletConnect with Aptos wallets. Built with modern web technologies, it provides a seamless experience for both developers and users.

![Aptos Wallet Connect Kit Banner](https://raw.githubusercontent.com/WGB5445/AptosWalletConnectKit/main/assets/banner.png)

---

## Features

- 🔌 **WalletConnect Integration**: Effortlessly connect to Aptos wallets using WalletConnect.
- 🧩 **UI Components**: Ready-to-use components like connect buttons and modals.
- ⚡ **TypeScript Support**: Fully typed for a great developer experience.
- 🛠️ **Demo App**: Quickly see the kit in action and test features.
- 🌐 **Framework Agnostic**: Works with Lit, React, and more.

---

## Demo

Try the live demo: [AptosWalletConnectKit Demo](https://wgb5445.github.io/AptosWalletConnectKit/)

Or run locally:

```bash
pnpm install
pnpm run build:demo
pnpm run:demo
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Installation

### Using pnpm or yarn:
```bash
pnpm add @wgb5445/aptos-wallet-connect-kit
```

### using CDN

#### jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@wgb5445/aptos-wallet-connect-kit@latest/dist/walletConnectKit.cjs.js"></script>
```
or
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@wgb5445/aptos-wallet-connect-kit@latest/dist/walletConnectKit.es.js"></script>
```
#### unpkg

```html
<script type="module" src="https://unpkg.com/@wgb5445/aptos-wallet-connect-kit@latest/dist/walletConnectKit.es.js"></script>
```
or

```html
<script src="https://unpkg.com/@wgb5445/aptos-wallet-connect-kit@latest/dist/walletConnectKit.cjs.js"></script>
```

---

## Usage

Import and use the components in your project:

```typescript
import { walletAdapter, Modal, Button, Context, WalletInfoModal } from '@wgb5445/aptos-wallet-connect-kit';

// Example: Connect to wallet
walletAdapter.getAccount().then(account => {
  console.log('Account:', account);
});
```

Or use the custom elements in your HTML:

```html
<wallet-connect-button autoconnect></wallet-connect-button>
```

---

## Project Structure

```
├── src/                # Core library source code
│   ├── Context/        # State management
│   ├── WalletConnectButton/  # Connect button component
│   ├── WalletConnectModal/   # Wallet selection modal
│   ├── WalletInfoModal/     # Wallet info modal
│   └── index.ts        # Library entry point
├── demo/               # Demo app
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── dist-demo/          # Built demo output
├── dist/               # Library build output
├── package.json
├── vite.config.ts      # Vite config for library
├── vite.demo.config.ts # Vite config for demo
└── ...
```

---

## Development

```bash
pnpm install
pnpm run build
pnpm run lint
```

---

## License

[MIT](LICENSE)

---

## Author

[WGB5445](https://github.com/WGB5445) · 919603023@qq.com
