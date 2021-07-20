import { Flex, Box, Button, Text, Image, useColorModeValue } from '@chakra-ui/react';
import { useWeb3Context } from '../../context/Web3Context';
import { truncateMiddleString } from '../../utils';

const userIsOwner = (userAddress, owner) => {
  if (!userAddress || !owner) {
    return false;
  }
  return userAddress.toLowerCase() === owner.toLowerCase();
};

export const Card = ({ tokenId, name, owner, price, uri, tokenSymbol, triggerRefreshContent }) => {
  const {
    contracts: { collectibles, luna, lunary },
    userAddress,
  } = useWeb3Context();

  const buy = async () => {
    await luna.methods.approve(lunary._address, price).send({ from: userAddress });
    await lunary.methods.buyCollectible(tokenId).send({ from: userAddress });
    triggerRefreshContent();
    await collectibles.methods.approve(lunary._address, tokenId).send({ from: userAddress });
  };

  return (
    <Flex w="full" alignItems="center" justifyContent="center">
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        maxW="sm"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative"
      >
        <Image src={uri} alt={`Picture of ${name}`} roundedTop="lg" />

        <Box p="6">
          <Flex mt="1" justifyContent="space-between" align="center">
            <Box fontSize="2xl" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
              {name}
            </Box>
            <Box as="span" color="gray.600" fontSize="lg">
              {price + ' ' + tokenSymbol}
            </Box>
          </Flex>

          <Flex mt="3" justifyContent="space-between" align="center">
            <Text>owner: {truncateMiddleString(owner)}</Text>
            {!userIsOwner(userAddress, owner) && (
              <Button onClick={buy} size="sm" colorScheme="blue">
                Buy
              </Button>
            )}
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default Card;
