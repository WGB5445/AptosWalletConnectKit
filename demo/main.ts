import { html, render } from 'lit';
import { walletAdapter } from '../src';
import '../src';
import { bytesToHex } from "@noble/hashes/utils";

declare global {
  interface Window {
    AptosWalletConnectKitAdapter: typeof walletAdapter;
  }
}

const app = html`
  <h1>Aptos Wallet Connect Kit Demo</h1>
  <p>
    This is a demo of the Aptos Wallet Connect Kit. It allows you to connect to an Aptos wallet
    using Wallet Connect.
  </p>
  <wallet-connect-button autoconnect></wallet-connect-button>
  <button id="connectButton">Connect</button>
  <h1>Aptos Wallet Connect Kit Demo</h1>
  <button id="getAccount">Get Account</button>
  <button id="signMessage">Sign Message</button>
  <div id="output"></div>
`;
console.log('Welcome to Aptos Wallet Connect Kit Demo!');

document.addEventListener('DOMContentLoaded', () => {
  const getAccountButton = document.getElementById('getAccount');
  const signMessageButton = document.getElementById('signMessage');
  const connectButton = document.getElementById('connectButton');
  const outputDiv = document.getElementById('output');

  const displayOutput = (message: string) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = message;
    if (outputDiv) {
      outputDiv.appendChild(paragraph);
    }
  };

  getAccountButton?.addEventListener('click', async () => {
    try {
      const account = await window.AptosWalletConnectKitAdapter.getAccount();
      console.log('Account:', account);
      displayOutput(`Account: ${account}`);
    } catch (error) {
      console.error('Failed to get account:', error);
      displayOutput(
        `Error: Failed to get account - ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });

  signMessageButton?.addEventListener('click', async () => {
    try {
      const message = 'Hello, Aptos!';
      const nonce = Math.floor(Date.now() / 1000).toString();
      const signature = await window.AptosWalletConnectKitAdapter.signMessage({
        message,
        nonce,
      });

      const customSignatureStringify = (key: string, value: any) => {
        if (key === 'signature') {
          return `0x${bytesToHex(value.data.data)}`;
        }
        return value;
      };

      console.log('Signature:', signature);
      displayOutput(`Signature:\n${JSON.stringify(signature, customSignatureStringify, 2)}`);
    } catch (error) {
      console.error('Failed to sign message:', error);
      displayOutput(
        `Error: Failed to sign message - ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });

  connectButton?.addEventListener('click', async () => {
    try {
      console.log(await window.AptosWalletConnectKitAdapter.connect("Petra"));
      displayOutput('Connected to Aptos wallet');
    } catch (error) {
      console.error('Failed to connect:', error);
      displayOutput(
        `Error: Failed to connect - ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });
});

render(app, document.getElementById('app')!);
