import { LitElement, html, css } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import {ConnectWalletModal, type WalletConnectedEvent} from '../WalletConnectModal'
import { AptosDisconnectNamespace, getWallets, type AptosDisconnectFeature, type Wallet } from "@aptos-labs/wallet-standard"
import { getWalletAdaptorStore, setWalletAdaptorStore, subscribeWalletAdaptorStore } from "../Context"

@customElement('wallet-connect-button')
export class WalletConnectButton extends LitElement {

  @property({ type: Boolean })
  showWalletModal = false

  @state()
  private _wallets: readonly Wallet[] = []

  @state()
  private _state = getWalletAdaptorStore()

  connectedCallback(): void {
    super.connectedCallback();
    const {on, get} = getWallets();
    on("register", _ => {
      const wallets = get();
      this._wallets = wallets.filter(wallet =>
        wallet.features && Object.keys(wallet.features).some(key => key.startsWith("aptos:"))
      );
    });
    const localStorage_auto_connect = window.localStorage.getItem("AptosWalletAutoConnect")
    const autoConnect = localStorage_auto_connect === "true" || localStorage_auto_connect === null;
    this._state.setIsAutoConnectEnabled(autoConnect);

    subscribeWalletAdaptorStore((state) => {
      this._state = state;
    })
  }

  render() {
    return html`
      <button @click=${this._onWalletConnectClick} class="wallet-connect-btn">
        ${this._state.address ? this._shortAddress(this._state.address!) : 'Wallet Connect'}
      </button>
      <connect-wallet-modal .wallets=${this._wallets} @wallet-connected=${this._onWalletConnected} @close=${this._onWalletModalClose}></connect-wallet-modal>
    `
  }

  private async _onWalletConnectClick() {
    if (!this._state.wallet) {
        const modal = document.querySelector<ConnectWalletModal>('connect-wallet-modal');
        if (modal) {
          modal.openModal();
        }
    }else {
      if (!this._state.wallet) {
        console.warn("No current wallet selected.");
        this._state.reset();
        return;
      }else {
        const disconnectFeature = (this._state.wallet!.features as AptosDisconnectFeature)[AptosDisconnectNamespace];
        if (disconnectFeature && disconnectFeature.disconnect) {
          try {
            await disconnectFeature.disconnect();
            this._state.reset();
          } catch (error) {
            console.error("Failed to disconnect:", error);
          }
        } else {
          console.warn("Disconnect feature not available for the current wallet.");
        }
      }      
    }
  }

  private _onWalletConnected(e: CustomEvent<WalletConnectedEvent>) {
    setWalletAdaptorStore((state) => ({
      ...state,
      address: e.detail.address,
      publicKey: e.detail.publicKey,
      ansName: e.detail.ansName,
      wallet: e.detail.wallet,
    }));
    this.showWalletModal = false;
  }

  private _onWalletModalClose() {
  }

  private _shortAddress(addr: string) {
    return addr.slice(0, 6) + '...' + addr.slice(-4)
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'wallet-connect-button': WalletConnectButton
  }
}