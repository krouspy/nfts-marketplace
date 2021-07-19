//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Luna.sol";
import "./Collectibles.sol";


contract Lunary is Ownable {
  event CollectibleBought(address indexed seller, address indexed buyer, uint256 price);

  Luna private _luna;
  Collectibles private _collectibles;

  constructor(Luna luna, Collectibles collectibles) {
    _luna = luna;
    _collectibles = collectibles;
  }

  function buyCollectible(uint256 tokenId) public {
    uint256 balance = _luna.balanceOf(_msgSender());
    (, address owner,, uint256 price) = _collectibles.collectibles(tokenId);

    require(balance >= price, "Lunary: insufficient balance");

    _luna.transferFrom(_msgSender(), owner, price);
    _collectibles.safeTransferFrom(owner, _msgSender(), tokenId);

    emit CollectibleBought(owner, _msgSender(), price);
  }
}
