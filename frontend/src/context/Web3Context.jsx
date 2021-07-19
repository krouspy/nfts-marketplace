import { createContext, useContext } from 'react';
import useWeb3 from '../hooks/useWeb3';
import useWeb3Modal from '../hooks/useWeb3Modal';

const web3Context = createContext({
  web3: null,
  provider: null,
  userAddress: null,
  connect: null,
  disconnect: null,
  contracts: {
    luna: null,
    collectibles: null,
    lunary: null,
  },
});

export const Web3Context = ({ children }) => {
  const web3 = useWeb3();
  const web3Modal = useWeb3Modal();
  return <web3Context.Provider value={{ ...web3, ...web3Modal }}>{children}</web3Context.Provider>
};

export const useWeb3Context = () => useContext(web3Context);
