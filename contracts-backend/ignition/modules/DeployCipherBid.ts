import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Deployment module for CipherBid contract
 * Deploys the blind auction with a 24-hour duration
 */
const CipherBidModule = buildModule("CipherBidModule", (m) => {
    // Auction duration: 24 hours
    const durationInHours = m.getParameter("durationInHours", 24);

    // Deploy CipherBid contract
    const cipherBid = m.contract("CipherBid", [durationInHours]);

    return { cipherBid };
});

export default CipherBidModule;
