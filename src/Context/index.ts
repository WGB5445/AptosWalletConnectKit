import type { Wallet } from '@aptos-labs/wallet-standard';
import { createStore } from 'zustand/vanilla';

export interface WalletAdaptorState {
  installed_wallets: readonly Wallet[];
  address?: string;
  publicKey?: string;
  ansName?: string;
  network?: string;
  chainId?: number;
  url?: string;
  wallet?: Wallet;
  isAutoConnectEnabled?: boolean;
  setWallet: (wallet: Wallet | undefined) => void;
  reset: () => void;
  setWalletAddress: (address: string) => void;
  setWalletPublicKey: (publicKey: string) => void;
  setWalletAnsName: (ansName: string | undefined) => void;
  setWalletNetwork: (network: string) => void;
  setWalletChainId: (chainId: number) => void;
  setWalletUrl: (url: string) => void;
  setIsAutoConnectEnabled: (isAutoConnectEnabled: boolean) => void;
}

export const walletAdaptorStore = createStore<WalletAdaptorState>()((set) => ({
  wallet: undefined,
  installed_wallets: [],
  address: undefined,
  publicKey: undefined,
  ansName: undefined,
  network: undefined,
  chainId: undefined,
  url: undefined,
  isAutoConnectEnabled: true,
  setWallet: (wallet: Wallet | undefined) => {
    if (wallet == undefined) {
      set((state) => {
        return {
          ...state,
          wallet: undefined,
          address: undefined,
          publicKey: undefined,
          ansName: undefined,
          network: undefined,
          chainId: undefined,
          url: undefined,
        };
      });
    } else {
      set((state) => ({
        ...state,
        wallet,
      }));
    }
  },
  setInstalledWallets: (installed_wallets: Wallet[]) => {
    set((state) => ({
      ...state,
      installed_wallets,
    }));
  },
  setWalletAddress: (address: string) => {
    set((state) => {
      return {
        ...state,
        address,
      };
    });
  },
  setWalletPublicKey: (publicKey: string) => {
    set((state) => ({
      ...state,
      publicKey,
    }));
  },
  setWalletAnsName: (ansName: string | undefined) => {
    set((state) => ({
      ...state,
      ansName,
    }));
  },
  setWalletNetwork: (network: string) => {
    set((state) => ({
      ...state,
      network,
    }));
  },
  setWalletChainId: (chainId: number) => {
    set((state) => ({
      ...state,
      chainId,
    }));
  },
  setWalletUrl: (url: string) => {
    set((state) => ({
      ...state,
      url,
    }));
  },
  setIsAutoConnectEnabled: (isAutoConnectEnabled: boolean) => {
    set((state) => ({
      ...state,
      isAutoConnectEnabled,
    }));
  },
  reset: () =>
    set({
      wallet: undefined,
      address: undefined,
      publicKey: undefined,
      ansName: undefined,
      network: undefined,
      chainId: undefined,
      url: undefined,
      isAutoConnectEnabled: true,
    }),
}));

export const {
  getState: getWalletAdaptorStore,
  setState: setWalletAdaptorStore,
  subscribe: subscribeWalletAdaptorStore,
  getInitialState: getInitialWalletAdaptorStore,
} = walletAdaptorStore;
