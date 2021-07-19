const { expect } = require('chai');

const name = 'Doge';
const price = 1000;
const tokenURI = 'https://dogecoin.com/';

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

describe('Collectibles', function () {
  let collectibles;
  let deployer;
  let addr1;

  this.beforeEach(async () => {
    [deployer, addr1] = await ethers.getSigners();

    const Collectibles = await ethers.getContractFactory('Collectibles');
    collectibles = await Collectibles.deploy();
    await collectibles.deployed();
  });

  describe('Deployment', () => {
    it('should set deployer to contract owner', async () => {
      const owner = await collectibles.owner();
      expect(owner).to.be.equal(deployer.address);
    });

    it('initial whitelisted address should be address zero', async () => {
      const whitelisted = await collectibles.getWhitelisted();
      expect(whitelisted).to.be.equal(ADDRESS_ZERO);
    });
  });

  describe('Whitelisted', () => {
    it('owner should be able to update whitelisted address', async () => {
      expect(await collectibles.updateWhitelisted(addr1.address))
        .to.emit(collectibles, 'WhitelistedUpdated')
        .withArgs(ADDRESS_ZERO, addr1.address);

      const whitelisted = await collectibles.getWhitelisted();
      expect(whitelisted).to.be.equal(addr1.address);
    });

    it('not owner should not be able to update whitelisted address', async () => {
      const owner = await collectibles.owner();
      expect(owner).to.not.be.equal(addr1.address);
      await expect(collectibles.connect(addr1).updateWhitelisted(deployer.address)).to.be.reverted;
    });
  });

  describe('Collectible', () => {
    it('should create a collectible', async () => {
      const tokenId = 0;

      expect(await collectibles.createCollectible(name, price, tokenURI))
        .to.emit(collectibles, 'CollectibleCreated')
        .withArgs(tokenId, deployer.address, name, price, tokenURI);

      const totalCollectibles_ = Number(await collectibles.totalCollectibles());
      expect(totalCollectibles_).to.be.equal(tokenId + 1);

      const [tokenId_, owner_, name_, price_] = await collectibles.collectibles(tokenId);
      expect(tokenId_).to.be.equal(tokenId);
      expect(owner_).to.be.equal(deployer.address);
      expect(name_).to.be.equal(name);
      expect(price_).to.be.equal(price);

      const tokenOwner = await collectibles.ownerOf(tokenId);
      expect(tokenOwner).to.be.equal(deployer.address);

      const tokenURI_ = await collectibles.tokenURI(tokenId);
      expect(tokenURI_).to.be.equal(tokenURI);
    });

    it('whitelisted should be able to update collectible owner', async () => {
      const tokenId = 0;
      await collectibles.createCollectible(name, price, tokenURI);
      await collectibles.updateWhitelisted(deployer.address);

      const [, previousOwner] = await collectibles.getCollectible(tokenId);

      await collectibles.updateCollectibleOwner(tokenId, addr1.address);

      const [, newOwner] = await collectibles.getCollectible(tokenId);
      expect(newOwner).to.be.equal(addr1.address);
    });

    it('non-whitelisted should not be able to update collectible owner', async () => {
      const tokenId = 0;
      await collectibles.createCollectible(name, price, tokenURI);

      const whitelisted = await collectibles.getWhitelisted();
      expect(whitelisted).to.not.be.equal(addr1.address);

      await expect(collectibles.connect(addr1).updateCollectibleOwner(tokenId, addr1.address)).to.be
        .reverted;
    });
  });
});
