# CIPHERBID PROJECT CONTEXT & RULES

## 1. Project Overview
We are building "CipherBid," a Blind Auction dApp on the Fhenix Helium Testnet (Layer 2).
- **Core Concept:** Users submit encrypted bids. The contract compares them on-chain using FHE (Fully Homomorphic Encryption) without decrypting the values publicly.
- **Network:** Fhenix Helium (ChainID: 8008135).

## 2. CRITICAL CODING RULES (Do Not Violate)
### Smart Contract (Solidity)
1.  **NO Conditional Branching:** You CANNOT use `if`, `else`, or `require` on encrypted types (`euint32`, `ebool`).
    - *WRONG:* `if (bid > highest) { ... }`
    - *RIGHT:* `euint32 newHighest = FHE.select(isHighest, bid, currentHighest);`
2.  **Data Types:** - Use `euint32` for bid amounts.
    - Use `eaddress` for storing the winner's address privately.
    - Input arguments must be `inEuint32`.
3.  **Imports:** Always import `@fhenixprotocol/contracts/FHE.sol`.
4.  **Debugging:** Use `console.log` only for unencrypted data. You cannot log encrypted data.

### Frontend (Next.js + FhenixJS)
1.  **Encryption:** Before sending a bid transaction, the client MUST encrypt the value using `fhenixjs`.
    - `const encryptedAmount = await client.encrypt_uint32(amount);`
2.  **Provider:** Use `ethers.BrowserProvider` to wrap `window.ethereum`.

## 3. Technical Configuration
- **RPC URL:** `https://api.helium.fhenix.zone`
- **Explorer:** `https://explorer.helium.fhenix.zone`
- **Faucet:** Fhenix Discord or Faucet.

## 4. Design System (Vibe)
- **Theme:** Dark Mode Only (`bg-zinc-950`).
- **Accent:** Neon Green (`#00FF00`) or Purple (`#9D00FF`) for "Encrypted" states.
- **Font:** "Geist Mono" or any monospace font for numbers.