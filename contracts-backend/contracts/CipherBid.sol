// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@fhenixprotocol/cofhe-contracts/FHE.sol";

/**
 * @title CipherBid
 * @notice A blind auction contract using Fully Homomorphic Encryption (FHE)
 * @dev Re-implemented with Lazy Initialization and explicit ACL Refreshing
 */
contract CipherBid {
    euint32 private highestBid;
    eaddress private winner;
    uint256 public endTime;
    address public owner;
    bool public claimed;
    uint256 public totalBids;
    bool public ended;
    
    event BidPlaced(address indexed bidder);
    event AuctionEnded(address indexed winner);
    
    constructor(uint256 _durationInHours) {
        owner = msg.sender;
        endTime = block.timestamp + (_durationInHours * 1 hours);
        claimed = false;
        totalBids = 0;
        ended = false;
        // NOTE: We do NOT initialize handles here to avoid constructor-time ACL issues
    }
    
    /**
     * @notice Place an encrypted bid
     * @param encryptedAmount The encrypted bid amount (scaled by 100 on frontend)
     */
    function bid(InEuint32 calldata encryptedAmount) external {
        require(block.timestamp < endTime, "Auction has ended");
        require(!claimed, "Auction already claimed");
        require(!ended, "Auction has ended");
        
        // Increment bid counter
        totalBids++;
        
        // 1. Convert user input and immediately authorize this contract
        euint32 newBid = FHE.asEuint32(encryptedAmount);
        FHE.allowThis(newBid);

        // 2. Handle Lazy Initialization (First Bid)
        // If highestBid is 0 (uninitialized handle), this is the first bid
        if (euint32.unwrap(highestBid) == 0) {
            highestBid = newBid;
            winner = FHE.asEaddress(msg.sender);
            
            // Allow handles for future transactions
            FHE.allowGlobal(highestBid);
            FHE.allowGlobal(winner);
        } else {
            // 3. Regular Bidding Logic
            // REFRESH ACL for existing handles in this context
            FHE.allowThis(highestBid);
            FHE.allowThis(winner);

            // Compare: newBid > highestBid
            ebool isHigher = FHE.gt(newBid, highestBid);
            FHE.allowThis(isHigher);

            // Update state
            highestBid = FHE.select(isHigher, newBid, highestBid);
            winner = FHE.select(isHigher, FHE.asEaddress(msg.sender), winner);
            
            // Ensure result handles are saved with global permissions
            FHE.allowGlobal(highestBid);
            FHE.allowGlobal(winner);
        }
        
        emit BidPlaced(msg.sender);
    }
    
    function claim() external {
        require(block.timestamp >= endTime, "Auction has not ended yet");
        require(!claimed, "Auction already claimed");
        
        // For now, just mark as claimed and ended
        // TODO: Implement proper winner decryption in production
        claimed = true;
        ended = true;
        
        emit AuctionEnded(msg.sender);
    }
    
    function getEncryptedHighestBid() external view returns (euint32) {
        return highestBid;
    }
    
    function hasEnded() external view returns (bool) {
        return block.timestamp >= endTime;
    }
    
    function timeRemaining() external view returns (uint256) {
        if (block.timestamp >= endTime) return 0;
        return endTime - block.timestamp;
    }
    
    /**
     * @notice Start a new auction round
     * @param durationMinutes Duration of the new round in minutes
     */
    function startNewRound(uint256 durationMinutes) external onlyOwner {
        require(block.timestamp >= endTime, "Auction has not ended yet");
        
        // Reset auction state
        highestBid = FHE.asEuint32(0);
        winner = FHE.asEaddress(address(0));
        totalBids = 0;
        claimed = false;
        ended = false;
        
        // Set new end time
        endTime = block.timestamp + (durationMinutes * 1 minutes);
        
        // Allow handles for the new round
        FHE.allowGlobal(highestBid);
        FHE.allowGlobal(winner);
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
}
