import { useState, useEffect } from 'react';
import { Grid, Box } from '@chakra-ui/react';
import { useWeb3Context } from '../../context/Web3Context';
import Card from './Card';
import { useLoader } from '../../hooks/useLoader';

const formatNfts = (nftsRaw, nftsUris) => {
  const result = nftsRaw.map(({ id, owner, name, price }) => ({
    tokenId: Number(id),
    owner: owner,
    name: name,
    price: Number(price),
    uri: nftsUris[id],
  }));

  return result;
};

export const Content = ({ tokenSymbol, refresh, triggerRefresh }) => {
  const [nfts, setNfts] = useState([]);
  const { openLoading, closeLoading } = useLoader();
  const {
    contracts: { collectibles },
  } = useWeb3Context();

  useEffect(() => {
    const init = async () => {
      if (collectibles) {
        openLoading();
        const totalCollectibles = await collectibles.methods.totalCollectibles().call();

        const nftsArr = [];
        const nftsUrisArr = [];
        for (let tokenId = 0; tokenId < totalCollectibles; tokenId++) {
          nftsArr.push(collectibles.methods.collectibles(tokenId).call());
          nftsUrisArr.push(collectibles.methods.tokenURI(tokenId).call());
        }

        const nftsRaw = await Promise.all(nftsArr);
        const nftsUris = await Promise.all(nftsUrisArr);

        const nfts = formatNfts(nftsRaw, nftsUris);

        setNfts(nfts);
        closeLoading();
      }
    };

    init();
    // eslint-disable-next-line
  }, [collectibles, refresh]);

  return (
    <Box>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {nfts.map(nft => (
          <Card
            key={nft.tokenId}
            tokenSymbol={tokenSymbol}
            triggerRefreshContent={triggerRefresh}
            {...nft}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default Content;
