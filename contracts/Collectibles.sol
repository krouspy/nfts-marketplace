//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract Collectibles is ERC721URIStorage, Ownable {
  event CollectibleCreated(uint256 indexed tokenId, address indexed owner, string name, uint256 price, string tokenURI);
  event WhitelistedUpdated(address indexed from, address indexed to);

  struct Collectible {
    uint256 id;
    address owner;
    string name;
    uint256 price;
  }

  Collectible[] public collectibles;

  address private _whitelisted;

  constructor() ERC721("Collectibles", "CLB") {}

  function getWhitelisted() public view returns (address) {
    return _whitelisted;
  }

  function totalCollectibles() public view returns (uint256) {
    return collectibles.length;
  }

  function getCollectible(uint256 tokenId) public view returns (Collectible memory) {
    require(tokenId < collectibles.length, "Collectibles: query non-existent token");
    return collectibles[tokenId];
  }

  function createCollectible(string memory name, uint256 price, string memory tokenURI) public {
    uint256 tokenId = collectibles.length;

    collectibles.push(Collectible(tokenId, _msgSender(), name, price));

    super._safeMint(_msgSender(), tokenId);
    super._setTokenURI(tokenId, tokenURI);

    emit CollectibleCreated(tokenId, _msgSender(), name, price, tokenURI);
  }

  function updateWhitelisted(address whitelisted) public onlyOwner {
    emit WhitelistedUpdated(_whitelisted, whitelisted);

    _whitelisted = whitelisted;
  }

  function updateCollectibleOwner(uint256 tokenId, address newOwner) public {
    require(_msgSender() == _whitelisted, "Collectibles: caller must be whitelisted");
    collectibles[tokenId].owner = newOwner;
  }
}
