const fs = require('fs');
const path = require('path');

const artifactPath = path.join(__dirname, '../artifacts/contracts/CipherBid.sol/CipherBid.json');
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

// Extract ABI
const abi = artifact.abi;

// Write ABI to frontend
const frontendAbiPath = path.join(__dirname, '../../frontend/lib/abi.json');
fs.writeFileSync(frontendAbiPath, JSON.stringify(abi, null, 2));

console.log('ABI extracted and updated successfully!');
console.log('Contract address: 0x40a0b2d266262e8453F645a5FDc9237587Fde5f7');
