import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type Wallet } from '@aptos-labs/wallet-standard';

@customElement('wallet-info-modal')
export class WalletInfoModal extends LitElement {
  @property({ type: Object })
  wallet?: Wallet;

  @property({ type: String })
  address: string = '';

  @property({ type: String })
  balance: string = '0';

  @property({ type: Boolean })
  private _isCopied: boolean = false;

  static styles = css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 10000;
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
        sans-serif;
    }

    :host([open]) {
      display: flex;
    }

    .modal {
      background: white;
      border-radius: 20px;
      padding: 32px;
      max-width: 400px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .close-button {
      position: absolute;
      top: 16px;
      right: 16px;
      background: #f3f4f6;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #6b7280;
      transition: background-color 0.2s;
    }

    .close-button:hover {
      background: #e5e7eb;
    }

    .wallet-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 0 auto 16px;
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .wallet-avatar::before {
      content: '';
      position: absolute;
      width: 60px;
      height: 60px;
      background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent);
      border-radius: 50%;
      top: 10px;
      left: 10px;
    }

    .wallet-avatar::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 24px;
      background: #c0392b;
      border-radius: 50%;
      bottom: 20px;
      right: 20px;
    }

    .wallet-address {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      text-align: center;
      margin-bottom: 8px;
    }

    .wallet-balance {
      font-size: 16px;
      color: #6b7280;
      text-align: center;
      margin-bottom: 32px;
    }

    .button-group {
      display: flex;
      gap: 12px;
    }

    .action-button {
      flex: 1;
      padding: 16px 24px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      background: white;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .action-button:hover {
      border-color: #d1d5db;
      background: #f9fafb;
    }
    .copy-button {
      color: #374151;
      transition: all 0.3s ease;
    }

    .copy-button.copied {
      color: #059669;
      border-color: #d1fae5;
      background: #ecfdf5;
      transform: scale(1.02);
    }

    .copy-button.copied:hover {
      background: #ecfdf5;
      border-color: #d1fae5;
    }

    .disconnect-button {
      color: #ef4444;
      border-color: #fecaca;
    }

    .disconnect-button:hover {
      background: #fef2f2;
      border-color: #fca5a5;
    }

    .icon {
      width: 20px;
      height: 20px;
    }

    @media (max-width: 480px) {
      .modal {
        padding: 24px;
        margin: 16px;
      }

      .button-group {
        flex-direction: column;
      }
    }
  `;

  render() {
    return html`
      <div class="modal" @click=${this._stopPropagation}>
        <button class="close-button" @click=${this.closeModal}>×</button>

        <div class="wallet-avatar"></div>

        <div class="wallet-address">${this._shortAddress(this.address)}</div>

        <div class="button-group">
          <button
            class="action-button copy-button ${this._isCopied ? 'copied' : ''}"
            @click=${this._copyAddress}
          >
            ${this._isCopied
              ? html`
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Copied!
                `
              : html`
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Copy Address
                `}
          </button>

          <button class="action-button disconnect-button" @click=${this._disconnect}>
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Disconnect
          </button>
        </div>
      </div>
    `;
  }
  openModal() {
    this.setAttribute('open', '');
  }

  closeModal() {
    this.removeAttribute('open');
  }

  private _stopPropagation(e: Event) {
    e.stopPropagation();
  }

  private _shortAddress(addr: string): string {
    if (!addr) return '';
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  }
  private async _copyAddress() {
    if (this.address) {
      try {
        await navigator.clipboard.writeText(this.address);

        this._isCopied = true;

        setTimeout(() => {
          this._isCopied = false;
        }, 2000);

        console.log('Address copied to clipboard');
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  }

  private _disconnect() {
    this.dispatchEvent(
      new CustomEvent('disconnect', {
        bubbles: true,
        composed: true,
      }),
    );
    this.closeModal();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.closeModal);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.closeModal);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wallet-info-modal': WalletInfoModal;
  }
}
