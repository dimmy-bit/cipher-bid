import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Deployment module for CipherBid contract v3
 * Fixed version that allows starting new rounds without requiring claim
 */
const CipherBidV3Module = buildModule("CipherBidV3Module", (m) => {
    // Auction duration: 1 hour
    const durationInHours = m.getParameter("durationInHours", 1);

    // Deploy updated CipherBid contract
    const cipherBid = m.contract("CipherBid", [durationInHours]);

    return { cipherBid };
});

export default CipherBidV3Module;
