const { expect } = require('chai');

describe('Luna', function () {
  let luna;
  let deployer;

  this.beforeEach(async () => {
    [deployer] = await ethers.getSigners();

    const Luna = await ethers.getContractFactory('Luna');
    luna = await Luna.deploy();
    await luna.deployed();
  });

  it('should set deployer to contract owner', async () => {
    const owner = await luna.owner();
    expect(owner).to.be.equal(deployer.address);
  });

  it('claimTokens()', async () => {
    await luna.claimTokens();
    const balance = Number(await luna.balanceOf(deployer.address));
    expect(balance).to.be.equal(10000);
  });
});
