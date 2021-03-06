//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Luna is ERC20, Ownable {
  constructor() ERC20("Luna", "LNA") {}

  function claimTokens() public {
    super._mint(_msgSender(), 10000);
  }
}
