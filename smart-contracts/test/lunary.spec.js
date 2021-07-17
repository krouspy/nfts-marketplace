const { expect } = require('chai');

const name = 'Doge';
const price = 1000;
const tokenURI = 'https://dogecoin.com/';

describe('Lunary', function () {
  let lunary;
  let luna;
  let collectibles;
  let deployer;
  let addr1;

  this.beforeEach(async () => {
    [deployer, addr1] = await ethers.getSigners();

    const Luna = await ethers.getContractFactory('Luna');
    luna = await Luna.deploy();
    await luna.deployed();

    const Collectibles = await ethers.getContractFactory('Collectibles');
    collectibles = await Collectibles.deploy();
    await collectibles.deployed();

    const Lunary = await ethers.getContractFactory('Lunary');
    lunary = await Lunary.deploy(luna.address, collectibles.address);
    await lunary.deployed();
  });

  it('should set deployer to contract owner', async () => {
    const owner = await lunary.owner();
    expect(owner).to.be.equal(deployer.address);
  });

  it('buyCollectible()', async () => {
    await collectibles.createCollectible(name, price, tokenURI);
    await luna.connect(addr1).claimTokens();

    const tokenId = 1;

    await luna.connect(addr1).approve(lunary.address, price);
    await collectibles.approve(lunary.address, tokenId);

    const sellerBalanceBefore = Number(await luna.balanceOf(deployer.address));
    const buyerBalanceBefore = Number(await luna.balanceOf(addr1.address));

    expect(await lunary.connect(addr1).buyCollectible(tokenId))
      .to.emit(lunary, 'CollectibleBought')
      .withArgs(deployer.address, addr1.address, price);

    const sellerBalanceAfter = Number(await luna.balanceOf(deployer.address));
    const buyerBalanceAfter = Number(await luna.balanceOf(addr1.address));
    expect(sellerBalanceAfter).to.be.equal(sellerBalanceBefore + price);
    expect(buyerBalanceAfter).to.be.equal(buyerBalanceBefore - price);

    const tokenOwner = await collectibles.ownerOf(tokenId);
    expect(tokenOwner).to.be.equal(addr1.address);
  });
});
