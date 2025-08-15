import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ConnectWalletModal, type WalletConnectedEvent } from '../WalletConnectModal';
import '../WalletInfoModal';
import {
  AptosDisconnectNamespace,
  getWallets,
  type AptosDisconnectFeature,
  type Wallet,
} from '@aptos-labs/wallet-standard';
import {
  getWalletAdaptorStore,
  setWalletAdaptorStore,
  subscribeWalletAdaptorStore,
} from '../Context';

export function filter_aptos_wallet(wallets: readonly Wallet[]): readonly Wallet[] {
  return wallets.filter(
    (wallet) =>
      wallet.features && Object.keys(wallet.features).some((key) => key.startsWith('aptos:')),
  );
}

@customElement('wallet-connect-button')
export class WalletConnectButton extends LitElement {
  @property({ type: Boolean })
  showWalletModal = false;

  @property({ type: Boolean })
  autoConnect = false;

  @state()
  autoConnectWalletName: string | undefined = undefined;

  @state()
  private _wallets: readonly Wallet[] = [];

  @state()
  private _state = getWalletAdaptorStore();

  connectedCallback(): void {
    super.connectedCallback();
    const { on, get } = getWallets();
    this._wallets = filter_aptos_wallet(get());
    on('register', () => {
      const wallets = get();
      this._wallets = filter_aptos_wallet(wallets);
      setWalletAdaptorStore((state) => ({
        ...state,
        installed_wallets: this._wallets,
      }));
    });
    const localStorage_auto_connect = window.localStorage.getItem('AptosWalletAutoConnect');
    const autoConnect = localStorage_auto_connect === 'true' || localStorage_auto_connect === null;
    this._state.setIsAutoConnectEnabled(autoConnect);

    const localStorage_auto_connect_name = window.localStorage.getItem(
      'AptosWalletAutoConnectName',
    );
    if (localStorage_auto_connect_name) {
      this.autoConnectWalletName = localStorage_auto_connect_name;
    } else {
      this.autoConnectWalletName = undefined;
    }

    subscribeWalletAdaptorStore((state) => {
      this._state = state;
    });

    // Automatically call connect logic if autoConnect is true
    if (this.autoConnect) {
      window.localStorage.setItem('AptosWalletAutoConnect', 'true');
    } else {
      window.localStorage.setItem('AptosWalletAutoConnect', 'false');
    }
  }

  render() {
    return html`
      <button @click=${this._onWalletConnectClick} class="wallet-connect-btn">
        ${this._state.address ? this._shortAddress(this._state.address!) : 'Wallet Connect'}
      </button>
      <connect-wallet-modal
        .wallets=${this._wallets}
        .autoConnect=${this.autoConnect}
        .autoConnectWalletName=${this.autoConnectWalletName ?? ''}
        @wallet-connected=${this._onWalletConnected}
        @close=${this._onWalletModalClose}
      ></connect-wallet-modal>
      <wallet-info-modal
        .wallet=${this._state.wallet}
        .address=${this._state.address || ''}
        .balance=${this._formatBalance()}
        @disconnect=${this._onDisconnect}
      >
      </wallet-info-modal>
    `;
  }

  private async _onWalletConnectClick() {
    if (!this._state.wallet) {
      const modal = document.querySelector<ConnectWalletModal>('connect-wallet-modal');
      if (modal) {
        modal.openModal();
      }
    } else {
      // When wallet is connected, show wallet info modal
      const walletInfoModal = this.shadowRoot?.querySelector('wallet-info-modal');
      if (walletInfoModal) {
        walletInfoModal.openModal();
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
    if (this.autoConnect) {
      this.autoConnectWalletName = e.detail.wallet.name;
      window.localStorage.setItem('AptosWalletAutoConnectName', e.detail.wallet.name);
    }
  }

  private _onWalletModalClose() {}

  private _shortAddress(addr: string) {
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  }

  private _formatBalance(): string {
    // This is a placeholder - in a real app you'd fetch the actual balance
    return '2.032e-7';
  }

  private async _onDisconnect() {
    if (!this._state.wallet) {
      console.warn('No current wallet selected.');
      this._state.reset();
      return;
    }

    const disconnectFeature = (this._state.wallet!.features as AptosDisconnectFeature)[
      AptosDisconnectNamespace
    ];
    if (disconnectFeature && disconnectFeature.disconnect) {
      try {
        await disconnectFeature.disconnect();
        this.autoConnectWalletName = undefined;
        window.localStorage.removeItem('AptosWalletAutoConnectName');
        this._state.reset();
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    } else {
      console.warn('Disconnect feature not available for the current wallet.');
    }
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
      font-family:
        SFRounded,
        ui-rounded,
        'SF Pro Rounded',
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        Helvetica,
        Arial,
        sans-serif,
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol';
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'wallet-connect-button': WalletConnectButton;
  }
}
