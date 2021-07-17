const { expect } = require('chai');

const name = 'Doge';
const price = 1000;
const tokenURI = 'https://dogecoin.com/';

describe('Collectibles', function () {
  let collectibles;
  let deployer;

  this.beforeEach(async () => {
    [deployer] = await ethers.getSigners();

    const Collectibles = await ethers.getContractFactory('Collectibles');
    collectibles = await Collectibles.deploy();
    await collectibles.deployed();
  });

  it('should set deployer to contract owner', async () => {
    const owner = await collectibles.owner();
    expect(owner).to.be.equal(deployer.address);
  });

  it('should create a collectible', async () => {
    const tokenId = 1;

    expect(await collectibles.createCollectible(name, price, tokenURI))
      .to.emit(collectibles, 'CollectibleCreated')
      .withArgs(tokenId, deployer.address, name, price, tokenURI);

    const totalCollectibles_ = Number(await collectibles.totalCollectibles());
    expect(totalCollectibles_).to.be.equal(tokenId);

    const [owner_, name_, price_] = await collectibles.collectibles(tokenId);
    expect(owner_).to.be.equal(deployer.address);
    expect(name_).to.be.equal(name);
    expect(price_).to.be.equal(price);

    const tokenOwner = await collectibles.ownerOf(tokenId);
    expect(tokenOwner).to.be.equal(deployer.address);

    const tokenURI_ = await collectibles.tokenURI(tokenId);
    expect(tokenURI_).to.be.equal(tokenURI);
  });
});
