const hre = require('hardhat');

async function main() {
  await hre.run('compile');

  const Luna = await hre.ethers.getContractFactory('Luna');
  const Collectibles = await hre.ethers.getContractFactory('Collectibles');
  const Lunary = await hre.ethers.getContractFactory('Lunary');

  const luna = await Luna.deploy();
  const collectibles = await Collectibles.deploy();

  await luna.deployed();
  await collectibles.deployed();

  const lunary = await Lunary.deploy(luna.address, collectibles.address);
  await lunary.deployed();

  await collectibles.updateWhitelisted(lunary.address);

  console.log('Luna deployed to:', luna.address);
  console.log('Collectibles deployed to:', collectibles.address);
  console.log('Lunary deployed to:', lunary.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
