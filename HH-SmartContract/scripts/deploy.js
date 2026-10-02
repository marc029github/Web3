import { network } from "hardhat";

async function main() {
  const { ethers } = await network.create();
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  const counter = await ethers.deployContract("Counter");
  await counter.waitForDeployment();

  console.log("Counter deployed to:", await counter.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});