// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  // Ensure you have at least one signer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Use your ERC20 token address //obtain this by npx hardhat node for testing
  const tokenAddress = "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844";

  // Deploy the Crowdfunding contract
  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
  const crowdfunding = await Crowdfunding.deploy(tokenAddress);
  
  // Wait for the deployment to finish
  await crowdfunding.deployed();

  console.log("Crowdfunding contract deployed to:", crowdfunding.address);
}

// Execute the main function and handle any errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
