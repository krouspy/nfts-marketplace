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
  useDisclosure,
} from '@chakra-ui/react';
import { useWeb3Context } from '../context/Web3Context';

export const NFTModal = ({ tokenSymbol }) => {
  const initialRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    userAddress,
    contracts: { collectibles },
  } = useWeb3Context();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState('');

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
      alert('Please fill out all fields');
      return;
    }

    const receipt = await collectibles.methods
      .createCollectible(name, price, imageUri)
      .send({ from: userAddress });
    console.log(receipt);
  };

  return (
    <>
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
            <Button>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NFTModal;
