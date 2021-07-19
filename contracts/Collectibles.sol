//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract Collectibles is ERC721URIStorage, Ownable {
  event CollectibleCreated(uint256 indexed tokenId, address indexed owner, string name, uint256 price, string tokenURI);

  struct Collectible {
    uint256 id;
    address owner;
    string name;
    uint256 price;
  }

  Collectible[] public collectibles;

  constructor() ERC721("Collectibles", "CLB") {}

  function totalCollectibles() public view returns (uint256) {
    return collectibles.length;
  }

  function getCollectible(uint256 tokenId) public view returns (Collectible memory) {
    require(tokenId < collectibles.length, "Collectibles: query non-existant token");
    return collectibles[tokenId];
  }

  function createCollectible(string memory name, uint256 price, string memory tokenURI) public {
    uint256 tokenId = collectibles.length;

    collectibles.push(Collectible(tokenId, _msgSender(), name, price));

    super._safeMint(_msgSender(), tokenId);
    super._setTokenURI(tokenId, tokenURI);

    emit CollectibleCreated(tokenId, _msgSender(), name, price, tokenURI);
  }
}
