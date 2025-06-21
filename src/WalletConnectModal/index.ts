import {
  AptosConnectNamespace,
  type AptosConnectFeature,
  type AptosConnectOutput,
  type UserResponse,
  type Wallet,
} from '@aptos-labs/wallet-standard';
import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface WalletConnectedEvent {
  wallet: Wallet;
  address: string;
  publicKey: string;
  ansName?: string;
}

export interface DefaultWallet {
  name: string;
  url: string;
  icon: string;
  readyState: 'NotDetected' | 'Detected';
  isAIP62Standard?: boolean;
  deeplinkProvider?: string;
}

export const default_wallets: DefaultWallet[] = [
  {
    name: 'Nightly',
    url: 'https://nightly.app/',
    icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyOC4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iV2Fyc3R3YV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDg1MS41IDg1MS41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA4NTEuNSA4NTEuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6IzYwNjdGOTt9DQoJLnN0MXtmaWxsOiNGN0Y3Rjc7fQ0KPC9zdHlsZT4NCjxnPg0KCTxnIGlkPSJXYXJzdHdhXzJfMDAwMDAwMTQ2MDk2NTQyNTMxODA5NDY0NjAwMDAwMDg2NDc4NTIwMDIxMTY5MTg2ODhfIj4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEyNCwwaDYwMy42YzY4LjUsMCwxMjQsNTUuNSwxMjQsMTI0djYwMy42YzAsNjguNS01NS41LDEyNC0xMjQsMTI0SDEyNGMtNjguNSwwLTEyNC01NS41LTEyNC0xMjRWMTI0DQoJCQlDMCw1NS41LDU1LjUsMCwxMjQsMHoiLz4NCgk8L2c+DQoJPGcgaWQ9IldhcnN0d2FfMyI+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02MjMuNSwxNzAuM2MtMzcuNCw1Mi4yLTg0LjIsODguNC0xMzkuNSwxMTIuNmMtMTkuMi01LjMtMzguOS04LTU4LjMtNy44Yy0xOS40LTAuMi0zOS4xLDIuNi01OC4zLDcuOA0KCQkJYy01NS4zLTI0LjMtMTAyLjEtNjAuMy0xMzkuNS0xMTIuNmMtMTEuMywyOC40LTU0LjgsMTI2LjQtMi42LDI2My40YzAsMC0xNi43LDcxLjUsMTQsMTMyLjljMCwwLDQ0LjQtMjAuMSw3OS43LDguMg0KCQkJYzM2LjksMjkuOSwyNS4xLDU4LjcsNTEuMSw4My41YzIyLjQsMjIuOSw1NS43LDIyLjksNTUuNywyMi45czMzLjMsMCw1NS43LTIyLjhjMjYtMjQuNywxNC4zLTUzLjUsNTEuMS04My41DQoJCQljMzUuMi0yOC4zLDc5LjctOC4yLDc5LjctOC4yYzMwLjYtNjEuNCwxNC0xMzIuOSwxNC0xMzIuOUM2NzguMywyOTYuNyw2MzQuOSwxOTguNyw2MjMuNSwxNzAuM3ogTTI1My4xLDQxNC44DQoJCQljLTI4LjQtNTguMy0zNi4yLTEzOC4zLTE4LjMtMjAxLjVjMjMuNyw2MCw1NS45LDg2LjksOTQuMiwxMTUuM0MzMTIuOCwzNjIuMywyODIuMywzOTQuMSwyNTMuMSw0MTQuOHogTTMzNC44LDUxNy41DQoJCQljLTIyLjQtOS45LTI3LjEtMjkuNC0yNy4xLTI5LjRjMzAuNS0xOS4yLDc1LjQtNC41LDc2LjgsNDAuOUMzNjAuOSw1MTQuNywzNTMsNTI1LjQsMzM0LjgsNTE3LjV6IE00MjUuNyw2NzguNw0KCQkJYy0xNiwwLTI5LTExLjUtMjktMjUuNnMxMy0yNS42LDI5LTI1LjZzMjksMTEuNSwyOSwyNS42QzQ1NC43LDY2Ny4zLDQ0MS43LDY3OC43LDQyNS43LDY3OC43eiBNNTE2LjcsNTE3LjUNCgkJCWMtMTguMiw4LTI2LTIuOC00OS43LDExLjVjMS41LTQ1LjQsNDYuMi02MC4xLDc2LjgtNDAuOUM1NDMuOCw0ODgsNTM5LDUwNy42LDUxNi43LDUxNy41eiBNNTk4LjMsNDE0LjgNCgkJCWMtMjkuMS0yMC43LTU5LjctNTIuNC03Ni04Ni4yYzM4LjMtMjguNCw3MC42LTU1LjQsOTQuMi0xMTUuM0M2MzQuNiwyNzYuNSw2MjYuOCwzNTYuNiw1OTguMyw0MTQuOHoiLz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4NCg==',
    readyState: 'NotDetected',
    isAIP62Standard: true,
    deeplinkProvider: 'nightly://v1?network=aptos&url=',
  },
  {
    name: 'Petra',
    url: 'https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci?hl=en',
    icon: 'data:image/png;base64,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',
    readyState: 'NotDetected',
    isAIP62Standard: true,
    deeplinkProvider: 'https://petra.app/explore?link=',
  },
  {
    name: 'Pontem Wallet',
    url: 'https://pontem.network/pontem-wallet',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4IDBDOC4wNzMwNCAwIDAgOC4wNzEzOSAwIDE3Ljk5NjNDMCAyNS4xMjk4IDQuMTczMTYgMzEuMzEwOCAxMC4yMDc2IDM0LjIyMDNWMzQuMjM1MUgxMC4yMzcyQzEyLjU4NiAzNS4zNjQ5IDE1LjIyMjggMzYgMTggMzZDMjcuOTI3IDM2IDM2IDI3LjkyODYgMzYgMTguMDAzN0MzNiA4LjA3MTM4IDI3LjkyNyAwIDE4IDBaTTE4IDEuNDc2OTJDMjcuMTA3MSAxLjQ3NjkyIDM0LjUyMjggOC44OTEwOCAzNC41MjI4IDE3Ljk5NjNDMzQuNTIyOCAyMC42MTA1IDMzLjkwOTcgMjMuMDkxNyAzMi44MjQgMjUuMjkyM0MzMC40NDU2IDI0LjE0MDMgMjguMDMwNCAyMy4yODM3IDI1LjU5MjkgMjIuNzAwM1Y4LjkyMDYyQzI1LjU5MjkgOC40NDA2MiAyNS4yMTYyIDguMDU2NjIgMjQuNzQzNSA4LjA1NjYySDIxLjcxNTJIMTQuMDg1NEgxMS4wNTdDMTAuNTkxNyA4LjA1NjYyIDEwLjIwNzYgOC40NDA2MiAxMC4yMDc2IDguOTIwNjJWMjIuNzY2OEM3Ljg0NDA3IDIzLjM1MDIgNS40OTUyOCAyNC4xOTIgMy4xODM0MiAyNS4yOTk3QzIuMDkwMjcgMjMuMDkxNyAxLjQ3NzIzIDIwLjYxNzggMS40NzcyMyAxNy45OTYzQzEuNDc3MjMgOC44OTEwOCA4Ljg5MjkgMS40NzY5MiAxOCAxLjQ3NjkyWk00LjEzNjIzIDI2Ljk2MTJDNi4wOTM1NiAyNS45OTM4IDguMTI0NzQgMjUuMjQ4IDEwLjIxNSAyNC43MzExVjMyLjU1ODhDNy43NDA2NiAzMS4yMzY5IDUuNjUwMzkgMjkuMzAyMiA0LjEzNjIzIDI2Ljk2MTJaTTE0LjA4NTQgMzQuMDQzMVYxNS42MDM3QzE0LjA4NTQgMTMuNDY5NSAxNS44MzU5IDExLjcwNDYgMTcuOTI2MSAxMS43MDQ2QzIwLjAxNjQgMTEuNzA0NiAyMS43MTUyIDEzLjQzMjYgMjEuNzE1MiAxNS41NTk0QzIxLjcxNTIgMTUuNTc0MiAyMS43MDc4IDE1LjU4ODkgMjEuNzA3OCAxNS42MDM3SDIxLjcxNTJWMjIuMDIwOUMxOS45MzUyIDIxLjgxNDIgMTguMTQ3NyAyMS43NDc3IDE2LjM2MDMgMjEuODQzN0wxNC44OTA0IDIzLjk3NzhDMTcuMTgwMSAyMy43ODU4IDE5LjQxMDcgMjMuODAwNiAyMS42MTE4IDI0LjA1MTdDMjEuNjM0IDI0LjA1MTcgMjEuNjQ4NyAyNC4wNTE3IDIyLjY3MDkgMjQuMDU5MUMyMS42ODU3IDI0LjA1OTEgMjEuNzAwNSAyNC4wNTkxIDIxLjcyMjYgMjQuMDY2NUMyMi4xMDY3IDI0LjExMDggMjMuNTAyNyAyNC4yODggMjQuNzgwNSAyNC42MDU1TDIxLjcyMjYgMjUuNjQ2OFYzNC4xMDIyQzIwLjUyNjEgMzQuMzc1NCAxOS4yODUyIDM0LjUzMDUgMTguMDE0OCAzNC41MzA1QzE2LjY0ODMgMzQuNTE1NyAxNS4zNDEgMzQuMzQ1OCAxNC4wODU0IDM0LjA0MzFaTTI1LjU4NTYgMzIuNjYyMlYyNC43NjhDMjcuNjY4NCAyNS4yOTIzIDI5LjcyOTIgMjYuMDYwMyAzMS43OTczIDI3LjA2NDZDMzAuMjQ2MiAyOS40MjAzIDI4LjEwNDIgMzEuMzU1MSAyNS41ODU2IDMyLjY2MjJaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjIyXzE2NzApIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjIyXzE2NzAiIHgxPSIxNy45OTk3IiB5MT0iMzYuNzc4OSIgeDI9IjE3Ljk5OTciIHkyPSItNS41MTk3OCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBvZmZzZXQ9IjAuMDg1OCIgc3RvcC1jb2xvcj0iIzhEMjlDMSIvPgo8c3RvcCBvZmZzZXQ9IjAuMjM4MyIgc3RvcC1jb2xvcj0iIzk0MkJCQiIvPgo8c3RvcCBvZmZzZXQ9IjAuNDY2NyIgc3RvcC1jb2xvcj0iI0E5MkZBQyIvPgo8c3RvcCBvZmZzZXQ9IjAuNzQxMyIgc3RvcC1jb2xvcj0iI0NBMzc5MyIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGMDNGNzciLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K',
    readyState: 'NotDetected',
    isAIP62Standard: true,
  },
  {
    name: 'Rimosafe',
    url: 'https://chromewebstore.google.com/detail/rimo-safe-wallet/kiicddjcakdmobjkcpppkgcjbpakcagp',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9Im5vbmUiLz4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzLCAzKSBzY2FsZSgwLjgpIj4KICAgIDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjkuNTMxMSA5Ljg0MzY5VjBIMTkuNjg3NEwxOS42ODc3IDAuMDAwMzQwNTU1TDAgMC4wMDAzNDE0MTVMNC4zMjEzNGUtMDcgOS44NDQwM0g5Ljg0MzY5QzQuNDA3MTcgOS44NDQwMyAwIDE0LjI1MTIgMCAxOS42ODc3VjMwLjAwMDFIOS44NDM2OVYxOS42ODc5TDE5LjY4NzEgMzAuMDAwMUwxOS42ODcxIDE5LjY4NzdMMjkuNTMwOCA5Ljg0NDAzTDI5LjUzMTEgOS44NDQwM1Y5Ljg0MzY1TDI5LjUzMTEgOS44NDM2OVpNMTkuNjg3MSAxOS42ODc2TDE5LjY4NzEgOS44NDQwM0g5Ljg0MzY5VjE5LjY4NzZIMTkuNjg3MVpNMjkuNTMxMSA5Ljg0MzY1TDE5LjY4NzcgMC4wMDAzNDA1NTVMMjkuNTMxMSAwLjAwMDM0MDEyNVY5Ljg0MzY1Wk0xOS42ODc0IDE5LjY4NzZIMjkuNTMxMVYzMC4wMDAxSDE5LjY4NzRWMTkuNjg3NloiIGZpbGw9IiNGRjVDMjgiLz4KICA8L2c+Cjwvc3ZnPgo=',
    readyState: 'NotDetected',
    isAIP62Standard: true,
  },
  {
    name: 'OKX Wallet',
    url: 'https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJDSURBVHgB7Zq9jtpAEMfHlhEgQLiioXEkoAGECwoKxMcTRHmC5E3IoyRPkPAEkI7unJYmTgEFTYwA8a3NTKScLnCHN6c9r1e3P2llWQy7M/s1Gv1twCP0ej37dDq9x+Zut1t3t9vZjDEHIiSRSPg4ZpDL5fxkMvn1cDh8m0wmfugfO53OoFQq/crn8wxfY9EymQyrVCqMfHvScZx1p9ls3pFxXBy/bKlUipGPrVbLuQqAfsCliq3zl0H84zwtjQrOw4Mt1W63P5LvBm2d+Xz+YzqdgkqUy+WgWCy+Mc/nc282m4FqLBYL+3g8fjDxenq72WxANZbLJeA13zDX67UDioL5ybXwafMYu64Ltn3bdDweQ5R97fd7GyhBQMipx4POeEDHIu2LfDdBIGGz+hJ9CQ1ABjoA2egAZPM6AgiCAEQhsi/C4jHyPA/6/f5NG3Ks2+3CYDC4aTccDrn6ojG54MnEvG00GoVmWLIRNZ7wTCwDHYBsdACy0QHIhiuRETxlICWpMMhGZHmqS8qH6JLyGegAZKMDkI0uKf8X4SWlaZo+Pp1bRrwlJU8ZKLIvUjKh0WiQ3sRUbNVq9c5Ebew7KEo2m/1p4jJ4qAmDaqDQBzj5XyiAT4VCQezJigAU+IDU+z8vJFnGWeC+bKQV/5VZ71FV6L7PA3gg3tXrdQ+DgLhC+75Wq3no69P3MC0NFQpx2lL04Ql9gHK1bRDjsSBIvScBnDTk1WrlGIZBorIDEYJj+rhdgnQ67VmWRe0zlplXl81vcyEt0rSoYDUAAAAASUVORK5CYII=',
    readyState: 'NotDetected',
    isAIP62Standard: true,
  },
];

@customElement('wallet-item')
export class WalletItem extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String }) icon = '';

  static styles = css`
    .wallet-item {
      display: flex;
      align-items: center;
      padding: 5px;
      cursor: pointer;
      border-radius: 8px;
      width: 100%;
      box-sizing: border-box;
      transition: background-color 0.2s ease;
      background-color: #ffffff;
      border: 0px;
      margin-bottom: 8px;
    }
    .wallet-item:hover {
      background-color: #f0f2f5;
    }
    .icon {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      margin-right: 12px;
      object-fit: contain;
    }
    .name {
      font-size: 16px;
      font-weight: 500;
      color: #101828;
    }
  `;

  render() {
    return html`
      <button class="wallet-item" @click=${this._onConnectWallet}>
        <img src="${this.icon}" alt="${this.name} icon" class="icon" />
        <span class="name">${this.name}</span>
      </button>
    `;
  }

  private _onConnectWallet() {
    this.dispatchEvent(
      new CustomEvent('wallet-item-click', {
        detail: { name: this.name },
        bubbles: true,
        composed: true,
      }),
    );
    console.log(`Connecting to wallet: ${this.name}`);
  }
}

@customElement('connect-wallet-modal')
export class ConnectWalletModal extends LitElement {
  static baseStyles = css`
    :host {
      display: block;
      position: fixed;
      z-index: 9999;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
    }
    .modal-mask {
      position: fixed;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.35);
      z-index: 9998;
      pointer-events: auto;
    }
    .modal-center {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      pointer-events: auto;
    }
  `;
  static styles = [
    ConnectWalletModal.baseStyles,
    css`
      :host {
        display: block;
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
      .modal-container {
        display: flex;
        width: 680px;
        height: 500px;
        background-color: #ffffff;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .left-panel {
        width: 35%;
        padding: 16px 8px 16px 16px;
        border-right: 1px solid #e5e7eb;
        display: flex;
        flex-direction: column;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 48px;
        padding: 0 8px 8px 8px;
      }
      .title {
        font-size: 18px;
        font-weight: 600;
        color: #101828;
      }
      .close-button {
        position: absolute;
        top: 24px;
        right: 24px;
        z-index: 10;
        width: 32px;
        height: 32px;
        border: none;
        background-color: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
      }
      .close-button:hover {
        background-color: #f0f2f5;
      }
      .close-button svg {
        width: 14px;
        height: 14px;
        color: #667085;
      }
      .wallet-list {
        flex-grow: 1;
        overflow-y: auto;
        padding-right: 8px;
      }
      .wallet-list::-webkit-scrollbar {
        width: 6px;
      }
      .wallet-list::-webkit-scrollbar-track {
        background: transparent;
      }
      .wallet-list::-webkit-scrollbar-thumb {
        background-color: #d1d5db;
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: content-box;
      }
      .wallet-list::-webkit-scrollbar-thumb:hover {
        background-color: #9ca3af;
      }
      .list-section {
        margin-bottom: 12px;
      }
      .section-title {
        font-size: 12px;
        font-weight: 500;
        color: #667085;
        text-transform: uppercase;
        padding: 8px 8px;
      }
      .right-panel {
        width: 65%;
        box-sizing: border-box;
        padding: 16px 8px 16px 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
      }
      .wallet-detail {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 32px 40px 12px 40px;
        min-height: 400px;
        width: 100%;
        box-sizing: border-box;
        text-align: center;
      }
      .wallet-detail .wallet-logo {
        width: 56px;
        height: 56px;
        margin-bottom: 20px;
        border-radius: 12px;
        background: #f7f7f7;
        object-fit: contain;
      }
      .wallet-detail .wallet-title {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 18px;
        color: #101828;
      }
      .wallet-detail .wallet-desc {
        font-size: 16px;
        color: #555;
        margin-bottom: 24px;
      }
      .wallet-detail .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #007aff;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        animation: spin 1s linear infinite;
        margin: 24px auto 0 auto;
      }
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      .primary-button {
        background-color: #007aff;
        color: white;
        font-size: 16px;
        font-weight: 500;
        border: none;
        border-radius: 8px;
        padding: 12px 0;
        cursor: pointer;
        width: 100%;
        margin-top: 16px;
        transition: background-color 0.2s ease;
      }
      .primary-button:hover {
        background-color: #006ee6;
      }
      .secondary-link {
        color: #007aff;
        font-size: 16px;
        font-weight: 500;
        text-decoration: none;
        text-align: center;
        margin-top: 16px;
        cursor: pointer;
      }
      .secondary-link:hover {
        text-decoration: underline;
      }
    `,
  ];

  @property({ type: Boolean, reflect: true }) open = false;

  @property({ type: Array })
  wallets: readonly Wallet[] = [];

  @property({ type: Boolean })
  autoConnect = false;

  @property({ type: String })
  autoConnectWalletName = '';

  @state()
  private _installedWallets: Wallet[] = [];

  @state()
  private _uninstalledWallets: DefaultWallet[] = default_wallets;

  @state()
  private _needInstallWallet:
    | {
        name: string;
        url: string;
        icon: string;
      }
    | undefined = undefined;

  @state()
  private _selectedWallet: Wallet | undefined = undefined;

  @state()
  private _isConnecting = false;

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('wallets')) {
      this._installedWallets = this.wallets.filter((wallet) =>
        default_wallets.some((w) => w.name === wallet.name),
      );
      this._uninstalledWallets = default_wallets.filter(
        (wallet) => !this.wallets.some((installed) => installed.name === wallet.name),
      );

      if (this.autoConnect && this.autoConnectWalletName !== '') {
        const wallet = this.getWalletByName(this.autoConnectWalletName);
        if (wallet) {
          this._selectedWallet = wallet;
          this._isConnecting = true;
          this.connectWallet(wallet)
            .then((userResponse) => {
              if (userResponse.status === 'Rejected') {
                console.warn('User rejected the connection request');
                return;
              }
              const userAddress = userResponse.args.address;
              const userPublicKey = userResponse.args.publicKey;
              const userAnsName = userResponse.args.ansName;

              this.dispatchEvent(
                new CustomEvent<WalletConnectedEvent>('wallet-connected', {
                  detail: {
                    address: userAddress.toString(),
                    publicKey: userPublicKey.toString(),
                    ansName: userAnsName,
                    wallet,
                  },
                  bubbles: true,
                  composed: true,
                }),
              );
              this.closeModal();
            })
            .catch((error) => {
              console.error('Failed to connect wallet:', error);
            })
            .finally(() => {
              this._isConnecting = false;
              this._selectedWallet = undefined;
            });
        } else {
          console.warn(`Wallet ${this.autoConnectWalletName} not found`);
        }
      }
    }
  }

  protected willUpdate(_changedProperties: PropertyValues): void {
    if (
      _changedProperties.has('wallets') &&
      ((_changedProperties.get('wallets') as Wallet[]) || undefined)?.length > 0
    ) {
      this._installedWallets = this.wallets.filter((wallet) =>
        default_wallets.some((w) => w.name === wallet.name),
      );

      this._uninstalledWallets = default_wallets.filter(
        (wallet) => !this.wallets.some((installed) => installed.name === wallet.name),
      );
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.parentNode !== document.body) {
      document.body.appendChild(this);
    }
  }

  private connectWallet(wallet: Wallet): Promise<UserResponse<AptosConnectOutput>> {
    return (wallet.features as AptosConnectFeature)[AptosConnectNamespace].connect();
  }

  private getWalletByName(name: string): Wallet | undefined {
    const wallet = this.wallets.find((w) => w.name === name);
    if (wallet) {
      return wallet;
    }
    return undefined;
  }

  private _renderWalletDetail() {
    if (this._needInstallWallet) {
      return html`
        <img
          class="wallet-logo"
          src="${this._needInstallWallet.icon}"
          alt="${this._needInstallWallet.name} logo"
        />
        <div class="wallet-title">${this._needInstallWallet.name}</div>
        <div class="wallet-desc">This wallet is not installed yet. Click below to get it.</div>
        <a class="primary-button" href="${this._needInstallWallet.url}" target="_blank"
          >Get ${this._needInstallWallet.name}</a
        >
      `;
    }
    if (this._isConnecting && this._selectedWallet) {
      return html`
        <img class="wallet-logo" src="${this._selectedWallet.icon}" alt="Wallet logo" />
        <div class="wallet-title">Connecting to ${this._selectedWallet.name}...</div>
        <div class="loader"></div>
      `;
    }
    return html`
      <h2 class="wallet-title">What is a Wallet?</h2>
      <div class="wallet-desc">
        <div class="info-text">
          <h3>A Home for your Digital Assets</h3>
          <p>
            Wallets are used to send, receive, store, and display digital assets like Ethereum and
            NFTs.
          </p>
        </div>
      </div>
      <div class="wallet-desc">
        <div class="info-text">
          <h3>A New Way to Log In</h3>
          <p>
            Instead of creating new accounts and passwords on every website, just connect your
            wallet.
          </p>
        </div>
      </div>
      <button class="primary-button">Get a Wallet</button>
      <a href="#" class="secondary-link">Learn More</a>
    `;
  }

  render() {
    if (!this.open) return html``;
    return html`
      <div class="modal-mask" @click=${this.closeModal}></div>
      <div class="modal-center">
        <div class="modal-container">
          <div class="left-panel">
            <div class="header">
              <h2 class="title">Connect a Wallet</h2>
            </div>
            <div class="wallet-list">
              <div class="list-section">
                <h3 class="section-title">Installed</h3>
                ${this._installedWallets.map(
                  (wallet) =>
                    html`<wallet-item
                      .name=${wallet.name}
                      .icon=${wallet.icon}
                      @click=${() =>
                        this._onWalletItemClick({ wallet, name: wallet.name, isInstalled: true })}
                    ></wallet-item>`,
                )}
              </div>
              <div class="list-section">
                <h3 class="section-title">Popular</h3>
                ${this._uninstalledWallets.map(
                  (wallet) =>
                    html`<wallet-item
                      .name=${wallet.name}
                      .icon=${wallet.icon}
                      @click=${() =>
                        this._onWalletItemClick({ name: wallet.name, isInstalled: false })}
                    ></wallet-item>`,
                )}
              </div>
            </div>
          </div>
          <div class="right-panel">
            <button class="close-button" @click=${this.closeModal} aria-label="Close">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div class="wallet-detail">${this._renderWalletDetail()}</div>
          </div>
        </div>
      </div>
    `;
  }

  openModal() {
    this.open = true;
  }

  closeModal() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  _onWalletItemClick(args: { name: string; isInstalled: boolean; wallet?: Wallet }) {
    const { name, isInstalled, wallet } = args;
    this._isConnecting = false;
    this._selectedWallet = undefined;
    this._needInstallWallet = undefined;

    if (isInstalled) {
      if (wallet) {
        this._isConnecting = true;
        this._selectedWallet = wallet;
        this.connectWallet(wallet)
          .then((userResponse: UserResponse<AptosConnectOutput>) => {
            if (userResponse.status === 'Rejected') {
              console.warn('User rejected the connection request');
              return;
            }
            const userAddress = userResponse.args.address;
            const userPublicKey = userResponse.args.publicKey;
            const userAnsName = userResponse.args.ansName;

            this.dispatchEvent(
              new CustomEvent<WalletConnectedEvent>('wallet-connected', {
                detail: {
                  address: userAddress.toString(),
                  publicKey: userPublicKey.toString(),
                  ansName: userAnsName,
                  wallet,
                },
                bubbles: true,
                composed: true,
              }),
            );
            this.closeModal();
          })
          .catch((error) => {
            console.error('Failed to connect wallet:', error);
          })
          .finally(() => {
            this._isConnecting = false;
            this._selectedWallet = undefined;
          });
      } else {
        console.warn('Wallet not found:', name);
      }
    } else {
      const walletToInstall = default_wallets.find((w) => w.name === name);
      if (walletToInstall) {
        this._needInstallWallet = {
          name: walletToInstall.name,
          url: walletToInstall.url,
          icon: walletToInstall.icon,
        };
      } else {
        console.warn('Wallet not found:', name);
      }
    }
    return;
  }
}

// Usage example (for demo):
// <connect-wallet-modal></connect-wallet-modal>
