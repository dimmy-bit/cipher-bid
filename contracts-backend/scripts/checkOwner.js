const { ethers } = require("ethers");

// Contract configuration
const CONTRACT_ADDRESS = "0x40a0b2d266262e8453F645a5FDc9237587Fde5f7";
const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";

// Minimal ABI for owner() function
const ABI = [
  "function owner() view returns (address)",
  "function totalBids() view returns (uint256)",
  "function claimed() view returns (bool)",
  "function ended() view returns (bool)",
  "function timeRemaining() view returns (uint256)"
];

async function checkOwner() {
  try {
    console.log("🔍 Checking CipherBid Contract Owner...\n");
    
    // Create provider
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    
    // Get owner address
    const ownerAddress = await contract.owner();
    console.log("👑 Contract Owner:", ownerAddress);
    
    // Get other contract details
    const totalBids = await contract.totalBids();
    const claimed = await contract.claimed();
    const ended = await contract.ended();
    const timeRemaining = await contract.timeRemaining();
    
    console.log("\n📊 Contract Status:");
    console.log("Total Bids:", totalBids.toString());
    console.log("Claimed:", claimed);
    console.log("Ended:", ended);
    console.log("Time Remaining:", timeRemaining.toString(), "seconds");
    
    console.log("\n🔗 Etherscan Link:");
    console.log(`https://sepolia.etherscan.io/address/${ownerAddress}`);
    
  } catch (error) {
    console.error("❌ Error checking contract:", error.message);
  }
}

checkOwner();
