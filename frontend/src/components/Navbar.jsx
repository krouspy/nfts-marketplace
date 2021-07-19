import { useState, useEffect } from 'react';
import {
  Flex,
  Text,
  IconButton,
  Button,
  HStack,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import NFTModal from './NFTModal';
import { useWeb3Context } from '../context/Web3Context';
import { truncateMiddleString } from '../utils';

export const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [token, setToken] = useState({ symbol: '', balance: 0 });

  const {
    provider,
    connect,
    userAddress,
    contracts: { luna },
  } = useWeb3Context();

  useEffect(() => {
    const getBalance = async () => {
      if (luna && userAddress) {
        const symbol = await luna.methods.symbol().call();
        const balance = await luna.methods.balanceOf(userAddress).call();
        setToken({ symbol, balance });
      }
    };

    getBalance();
  }, [luna, userAddress]);

  const claimTokens = async () => {
    const receipt = await luna.methods.claimTokens().send({ from: userAddress });
    console.log(receipt);
  };

  return (
    <Flex
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.600', 'white')}
      minH="60px"
      py={{ base: 2 }}
      px={{ base: 4 }}
      borderBottom={1}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.200', 'gray.900')}
      align="center"
      direction="row"
    >
      <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
        <IconButton
          onClick={onToggle}
          icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
          variant="ghost"
          aria-label="Toggle Navigation"
        />
      </Flex>
      <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
        <Text
          textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
          fontFamily="heading"
          color={useColorModeValue('gray.800', 'white')}
        >
          Logo
        </Text>
      </Flex>

      <HStack display={{ base: 'flex' }} align="center" spacing={6}>
        {provider ? (
          <>
            <NFTModal tokenSymbol={token.symbol} />
            <Button onClick={claimTokens} colorScheme="blue" fontSize="sm">
              Claim Tokens
            </Button>
            <Text>{`Balance: ${token.balance} ${token.symbol}`}</Text>
            <Text>{truncateMiddleString(userAddress)}</Text>
          </>
        ) : (
          <Button onClick={connect} colorScheme="blue" fontSize="sm" fontWeight={400}>
            Connect Wallet
          </Button>
        )}
      </HStack>
    </Flex>
  );
};

export default Navbar;
