import * as Modal from './WalletConnectModal';
import * as Button from './WalletConnectButton';
import * as Context from './Context';
import * as WalletInfoModal from './WalletInfoModal';
import {
  AccountInfo,
  AptosConnectNamespace,
  AptosDisconnectNamespace,
  AptosGetAccountNamespace,
  AptosGetNetworkNamespace,
  AptosSignAndSubmitTransactionNamespace,
  AptosSignMessageNamespace,
  AptosSignTransactionNamespace,
  type AptoGetsAccountOutput,
  type AptosConnectFeature,
  type AptosDisconnectFeature,
  type AptosGetAccountFeature,
  type AptosGetNetworkFeature,
  type AptosSignAndSubmitTransactionFeature,
  type AptosSignAndSubmitTransactionInput,
  type AptosSignAndSubmitTransactionOutput,
  type AptosSignMessageFeature,
  type AptosSignMessageInput,
  type AptosSignMessageOutput,
  type AptosSignTransactionFeature,
  type AptosSignTransactionInputV1_1,
  type AptosSignTransactionOutputV1_1,
  type NetworkInfo,
  type UserResponse,
} from '@aptos-labs/wallet-standard';

class WalletAdapter {
  private store;
  constructor() {
    this.store = Context.getWalletAdaptorStore();
    Context.subscribeWalletAdaptorStore((state) => {
      this.store = state;
    });
  }

  connect(walletName?: string): Promise<UserResponse<AccountInfo>> {
    return (this.store.installed_wallets.filter(w => w.name === walletName)[0]?.features as AptosConnectFeature)[AptosConnectNamespace].connect();
  }

  isConnected() {
    return this.store.wallet !== undefined && this.store.address !== undefined;
  }

  disconnect() {
    if (!this.store.wallet) {
      throw new Error('No wallet connected');
    }
    return (this.store.wallet.features as AptosDisconnectFeature)[
      AptosDisconnectNamespace
    ].disconnect();
  }

  getWalletInfo(): Promise<AptoGetsAccountOutput> {
    if (!this.store.wallet) {
      throw new Error('No wallet connected');
    }
    return (this.store.wallet.features as AptosGetAccountFeature)[
      AptosGetAccountNamespace
    ].account();
  }

  getNetwokrInfo(): Promise<NetworkInfo> {
    if (!this.store.wallet) {
      throw new Error('No wallet connected');
    }
    return (this.store.wallet.features as AptosGetNetworkFeature)[
      AptosGetNetworkNamespace
    ].network();
  }

  async getAccount(): Promise<string> {
    if (!this.store.wallet) {
      throw new Error('No wallet connected');
    }
    return (this.store.wallet.features as AptosGetAccountFeature)[
      AptosGetAccountNamespace
    ].account().then((v) => v.address.toString());
  }

  signMessage(message: AptosSignMessageInput): Promise<UserResponse<AptosSignMessageOutput>> {
    if (!this.store.wallet) {
      throw new Error('No wallet connected');
    }
    return (this.store.wallet.features as AptosSignMessageFeature)[
      AptosSignMessageNamespace
    ].signMessage(message);
  }

  signAndSubmitTransaction(
    transaction: AptosSignAndSubmitTransactionInput,
  ): Promise<UserResponse<AptosSignAndSubmitTransactionOutput>> {
    if (!this.store.wallet) {
      throw new Error('No wallet connected');
    }
    return (this.store.wallet.features as AptosSignAndSubmitTransactionFeature)[
      AptosSignAndSubmitTransactionNamespace
    ].signAndSubmitTransaction(transaction);
  }

  signTransaction(
    transaction: AptosSignTransactionInputV1_1,
  ): Promise<UserResponse<AptosSignTransactionOutputV1_1>> {
    if (!this.store.wallet) {
      throw new Error('No wallet connected');
    }
    const feature = (this.store.wallet.features as AptosSignTransactionFeature)[
      AptosSignTransactionNamespace
    ];
    if (!feature || typeof feature.version !== 'string') {
      throw new Error('signTransaction feature is not available or has no version');
    }
    if (feature.version === '1.0.0') {
      throw new Error('Wallet does not support signTransaction feature');
    }
    if (feature.version !== '1.1') {
      throw new Error(`Unsupported version of signTransaction feature: ${feature['version']}`);
    }
    return feature.signTransaction(transaction);
  }
}

const walletAdapter = new WalletAdapter();
(
  window as unknown as { AptosWalletConnectKitAdapter: WalletAdapter }
).AptosWalletConnectKitAdapter = walletAdapter;

export { Modal, Button, Context, WalletInfoModal, walletAdapter };
