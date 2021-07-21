Basic NFT marketplace built on Arbitrum. The goal was for me to have a better view of the developer experience one can get when developing a Dapp on it from smart-contracts to the user interface.

Conclusion: It seems exactly the same with just a preliminary step that requires us to [bridge](https://bridge.arbitrum.io/) Eth from L1 to L2.

Demo: [https://jolly-dtra-e21f8c.netlify.app/](https://jolly-dtra-e21f8c.netlify.app/)

Tools:

- solidity v0.8.4
- hardhat v2.4.3
- web3js v1.4.0
- react

## Setup

You'll need to add Arbitrum testnet on Metamask

```
Network Name: Arbitrum Testnet
RPC URL: https://rinkeby.arbitrum.io/rpc
ChainID: 421611
Symbol: ETH
Block Explorer URL: https://rinkeby-explorer.arbitrum.io/#/
```

Install

```bash
$ yarn
```

Deployments

```bash
$ yarn deploy:local
$ yarn deploy:arbitrum
```

## Environment variables

```
# ./.env

RINKEBY_PRIVATE_KEY=<your_private_key>
```

```
# ./frontend/.env

REACT_APP_LUNA=<luna_contract_address>
REACT_APP_COLLECTIBLES=<collectibles_contract_address>
REACT_APP_LUNARY=<lunary_contract_address>
```
