import { useState, useRef } from 'react';
import {
  Stack,
  Button,
  Input,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { useWeb3Context } from '../context/Web3Context';
import Loader from './Loader';

export const NFTModal = ({ tokenSymbol, triggerRefreshContent }) => {
  const initialRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    web3,
    userAddress,
    contracts: { collectibles, lunary },
  } = useWeb3Context();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false);

  const getNFT = async () => {
    // 671 characters
    const id = Math.floor(Math.random() * 670) + 1;
    const url = `https://rickandmortyapi.com/api/character/${id}`;
    const res = await fetch(url);
    const { image } = await res.json();
    setImageUri(image);
  };

  const handleSubmit = async () => {
    if (!name || !price || !imageUri) {
      toast({
        title: 'Please fill out all fields',
        position: 'bottom-right',
        status: 'error',
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    onClose();

    const receipt = await collectibles.methods
      .createCollectible(name, price, imageUri)
      .send({ from: userAddress });

    const { returnData } = receipt;
    const tokenId = web3.utils.hexToNumber(returnData);

    await collectibles.methods.approve(lunary._address, tokenId).send({ from: userAddress });

    triggerRefreshContent();
    setLoading(false);

    toast({
      title: 'NFT created!',
      position: 'bottom-right',
      isClosable: true,
    });
  };

  return (
    <>
      {loading && <Loader />}
      <Button onClick={onOpen} colorScheme="blue" fontSize="sm">
        Create NFT
      </Button>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create an NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  isRequired
                  id="nft-name"
                  type="text"
                  name="name"
                  ref={initialRef}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="name"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Price - {tokenSymbol}</FormLabel>
                <Input
                  isRequired
                  id="nft-price"
                  type="number"
                  name="price"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="price"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>URI</FormLabel>
                <Input
                  isRequired
                  id="nft-uri"
                  type="text"
                  name="uri"
                  value={imageUri}
                  onChange={e => setImageUri(e.target.value)}
                  placeholder="paste your url or get one below"
                />
              </FormControl>
              <Stack mt="5">
                <Button onClick={getNFT}>Get NFT</Button>
                {imageUri && <Image src={imageUri} alt="nft-image" />}
              </Stack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" onClick={handleSubmit} colorScheme="blue" mr={3}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NFTModal;
