import { useState, useEffect } from 'react';
import { Stack, Center } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Content from './components/Content';
import { useWeb3Context } from './context/Web3Context';
import { useLoader } from './hooks/useLoader';
import { useRefresh } from './hooks/useRefresh';
import Loader from './components/Loader';

function App() {
  const [tokenSymbol, setTokenSymbol] = useState('');
  const { loading, openLoading, closeLoading } = useLoader(false);
  const [refresh, triggerRefresh] = useRefresh();

  const {
    contracts: { luna },
  } = useWeb3Context();

  useEffect(() => {
    const getLunaInfo = async () => {
      if (luna) {
        openLoading();
        const symbol = await luna.methods.symbol().call();
        setTokenSymbol(symbol);
        closeLoading();
      }
    };

    getLunaInfo();
    // eslint-disable-next-line
  }, [luna]);

  return (
    <Stack direction="column" maxW="100vw" minH="100vh">
      {loading && <Loader />}
      <Navbar tokenSymbol={tokenSymbol} triggerRefreshContent={triggerRefresh} />
      <Center>
        <Content tokenSymbol={tokenSymbol} refresh={refresh} triggerRefresh={triggerRefresh} />
      </Center>
    </Stack>
  );
}

export default App;
