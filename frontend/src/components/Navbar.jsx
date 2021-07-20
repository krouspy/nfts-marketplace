import { useState, useEffect } from 'react';
import {
  Flex,
  Text,
  IconButton,
  Button,
  HStack,
  useToast,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import NFTModal from './NFTModal';
import { useWeb3Context } from '../context/Web3Context';
import { useLoader } from '../hooks/useLoader';
import { useRefresh } from '../hooks/useRefresh';
import { truncateMiddleString } from '../utils';

export const Navbar = ({ tokenSymbol, triggerRefreshContent }) => {
  const { isOpen, onToggle } = useDisclosure();
  const [balance, setBalance] = useState(0);
  const [refreshBalance, triggerRefreshBalance] = useRefresh();
  const { openLoading, closeLoading } = useLoader();
  const toast = useToast();

  const {
    provider,
    connect,
    disconnect,
    userAddress,
    contracts: { luna },
  } = useWeb3Context();

  useEffect(() => {
    const getBalance = async () => {
      if (luna && userAddress) {
        openLoading();
        const balance = await luna.methods.balanceOf(userAddress).call();
        setBalance(balance);
        closeLoading();
      }
    };

    getBalance();
    // eslint-disable-next-line
  }, [luna, userAddress, refreshBalance]);

  const claimTokens = async () => {
    try {
      openLoading();
      await luna.methods.claimTokens().send({ from: userAddress });
      toast({
        title: 'Tokens claimed!',
        position: 'bottom-right',
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: 'Error encountered',
        position: 'bottom-right',
        status: 'error',
        isClosable: true,
      });
    } finally {
      triggerRefreshBalance();
      closeLoading();
    }
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
          Lunary
        </Text>
      </Flex>

      <HStack display={{ base: 'flex' }} align="center" spacing={6}>
        {provider ? (
          <>
            <NFTModal tokenSymbol={tokenSymbol} triggerRefreshContent={triggerRefreshContent} />
            <Button onClick={claimTokens} colorScheme="blue" fontSize="sm">
              Claim Tokens
            </Button>
            <Text>{`Balance: ${balance} ${tokenSymbol}`}</Text>
            <Text>{truncateMiddleString(userAddress)}</Text>
            <Button onClick={disconnect} colorScheme="blue" fontSize="sm">
              Disconnect
            </Button>
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
