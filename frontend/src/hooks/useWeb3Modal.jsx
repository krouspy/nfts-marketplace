import { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

const web3Modal = new Web3Modal({
  cacheProvider: true,
  disableInjectedProvider: false,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: '8043bb2cf99347b1bfadfb233c5325c0',
      },
    },
  },
});

export const useWeb3Modal = () => {
  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  useEffect(() => {
    const init = async () => {
      const provider = await web3Modal.connect();
      setProvider(provider);
    };

    init();

    if (provider) {
      setUserAddress(provider.selectedAddress);
    }
  }, [provider]);

  const connect = async () => {
    const provider = await web3Modal.connect();
    setProvider(provider);
  };

  const disconnect = async () => {
    if (provider && provider.close) {
      await provider.close();
    }
    setProvider(null);
    await web3Modal.clearCachedProvider();
  };

  return {
    provider,
    connect,
    disconnect,
    userAddress,
  };
};

export default useWeb3Modal;
