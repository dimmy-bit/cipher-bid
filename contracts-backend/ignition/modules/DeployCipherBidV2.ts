import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Deployment module for updated CipherBid contract
 * Deploys the blind auction with a 5-minute duration for testing
 */
const CipherBidV2Module = buildModule("CipherBidV2Module", (m) => {
    // Auction duration: 5 minutes (as hours, so 5/60 = 0.08333 hours)
    const durationInHours = m.getParameter("durationInHours", 1); // 1 hour for now

    // Deploy updated CipherBid contract
    const cipherBid = m.contract("CipherBid", [durationInHours]);

    return { cipherBid };
});

export default CipherBidV2Module;
