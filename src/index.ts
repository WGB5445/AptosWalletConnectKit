import * as Modal from './WalletConnectModal';
import * as Button from './WalletConnectButton';
import * as Context from './Context';
import * as WalletInfoModal from './WalletInfoModal';
import { AptosDisconnectNamespace, AptosGetAccountNamespace, type AptoGetsAccountOutput, type AptosConnectFeature, type AptosDisconnectFeature, type AptosGetAccountFeature } from '@aptos-labs/wallet-standard';

class WalletAdapter {
  private store;
  constructor() {
    this.store = Context.getWalletAdaptorStore();
  }

//   connect() {
//     (this.store.wallet?.features as AptosConnectFeature)[AptosConnectNamespace].connect()
//   }

  disconnect() {
    if (!this.store.wallet) {
      throw new Error('No wallet connected');
    }
    return (this.store.wallet.features as AptosDisconnectFeature)[AptosDisconnectNamespace].disconnect()
  }

  getWalletInfo(): Promise<AptoGetsAccountOutput>{
     if (!this.store.wallet) {
      throw new Error('No wallet connected');
    }
    return (this.store.wallet.features as AptosGetAccountFeature)[AptosGetAccountNamespace].account()
  }
}

const walletAdapter = new WalletAdapter();

export { Modal, Button, Context, WalletInfoModal, walletAdapter };
