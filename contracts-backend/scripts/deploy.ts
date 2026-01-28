import { ethers as hardhatEthers } from "hardhat";

async function main() {
    const [deployer] = await hardhatEthers.getSigners();
    
    console.log("Deploying CipherBid with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());
    
    // Deploy with 1 hour duration (3600 seconds)
    const CipherBid = await hardhatEthers.getContractFactory("CipherBid");
    const cipherBid = await CipherBid.deploy(1); // 1 hour duration
    
    await cipherBid.waitForDeployment();
    
    const contractAddress = await cipherBid.getAddress();
    console.log("CipherBid deployed to:", contractAddress);
    
    // Save the contract address for frontend
    console.log("Update frontend CONTRACT_ADDRESS to:", contractAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
