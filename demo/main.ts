import { html, render } from 'lit';
import  '../src';

const app = html`
  <h1>Aptos Wallet Connect Kit Demo</h1>
    <p>
        This is a demo of the Aptos Wallet Connect Kit. It allows you to connect to
        an Aptos wallet using Wallet Connect.
    </p>
  <wallet-connect-button></wallet-connect-button>
`;

render(app, document.getElementById('app')!);
