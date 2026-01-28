import { ethers as hardhatEthers } from "hardhat";
import { ethers } from "ethers";

async function main() {
    const [deployer] = await hardhatEthers.getSigners();
    const balance = await hardhatEthers.provider.getBalance(deployer.address);
    console.log(`Account: ${deployer.address}`);
    console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
