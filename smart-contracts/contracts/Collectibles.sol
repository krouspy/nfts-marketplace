//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract Collectibles is ERC721URIStorage, Ownable {
  event CollectibleCreated(uint256 indexed tokenId, address indexed owner, string name, uint256 price, string tokenURI);

  struct Collectible {
    address owner;
    string name;
    uint256 price;
  }

  mapping(uint256 => Collectible) public collectibles;

  uint256 public totalCollectibles;

  constructor() ERC721("Collectibles", "CLB") {}

  function createCollectible(string memory name, uint256 price, string memory tokenURI) public {
    totalCollectibles++;

    uint256 tokenId = totalCollectibles;
    collectibles[tokenId] = Collectible(_msgSender(), name, price);

    super._safeMint(_msgSender(), tokenId);
    super._setTokenURI(tokenId, tokenURI);

    emit CollectibleCreated(tokenId, _msgSender(), name, price, tokenURI);
  }
}
