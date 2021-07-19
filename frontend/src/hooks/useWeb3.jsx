import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { addresses, abis } from '../config';

export const useWeb3 = () => {
  const [web3, setWeb3] = useState(null);
  const [contracts, setContracts] = useState({ luna: null, collectibles: null, lunary: null });

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const luna = new web3.eth.Contract(abis.luna, addresses.luna);
      const lunary = new web3.eth.Contract(abis.lunary, addresses.lunary);
      const collectibles = new web3.eth.Contract(abis.collectibles, addresses.collectibles);

      setWeb3(web3);
      setContracts({ luna, collectibles, lunary });
    }
  }, []);

  return { web3, contracts };
};

export default useWeb3;
