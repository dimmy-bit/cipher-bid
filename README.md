# 🔐 CipherBid - Privacy-Preserving Blind Auction dApp

<div align="center">

![CipherBid Logo](https://img.shields.io/badge/CipherBid-Blind%20Auction-9D00FF?style=for-the-badge&logo=ethereum)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Network](https://img.shields.io/badge/Network-Sepolia-11155111?style=for-the-badge&logo=ethereum)
![Technology](https://img.shields.io/badge/Technology-FHE%20%2B%20Next.js-00FF00?style=for-the-badge)

**Quantifiably Private Auctions with Fully Homomorphic Encryption**

[Live Demo](#) • [Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture)

</div>

---

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🚀 Quick Start](#-quick-start)
- [📖 Usage Guide](#-usage-guide)
- [🔧 Smart Contract](#-smart-contract)
- [🎨 Frontend](#-frontend)
- [🔄 Rolling Rounds](#-rolling-rounds)
- [🧪 Testing](#-testing)
- [📜 API Reference](#-api-reference)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🌟 Features

### 🔒 **Privacy-Preserving Bidding**
- **Fully Homomorphic Encryption (FHE)**: Bids remain encrypted on-chain
- **Zero-Knowledge Auctions**: No one can see bid amounts until auction ends
- **Secure Comparison**: Contract compares encrypted bids without decryption

### 🔄 **Rolling Rounds System**
- **Dynamic Duration**: Owner can set custom round lengths (5 min, 1 hour, etc.)
- **Automatic Reset**: Clean state between rounds
- **Owner Controls**: Start new rounds instantly after auction ends

### 📊 **Real-Time Features**
- **Live Bid Counter**: "🔥 X Bids Placed" in real-time
- **Perfect Timer**: Accurate HH:MM:SS countdown
- **Smart UI States**: Different interfaces for owner vs regular users

### 🎨 **Modern UI/UX**
- **Dark Theme**: Sleek zinc-950 background with neon accents
- **Responsive Design**: Works on all devices
- **Smooth Animations**: Framer Motion powered transitions
- **Toast Notifications**: Real-time feedback for all actions

---

## 🏗️ Architecture

```
cipher-bid/
├── contracts-backend/          # Smart contracts & deployment
│   ├── contracts/
│   │   └── CipherBid.sol      # Main auction contract
│   ├── scripts/               # Deployment utilities
│   ├── ignition/              # Hardhat Ignition modules
│   └── hardhat.config.ts      # Network configuration
├── frontend/                   # Next.js dApp interface
│   ├── app/
│   │   └── page.tsx          # Main auction interface
│   ├── hooks/
│   │   └── useFhenix.ts      # FHE integration hook
│   ├── lib/
│   │   ├── abi.json          # Contract ABI
│   │   └── utils.ts          # Utility functions
│   └── components/           # Reusable UI components
└── skills.md                  # Project context & rules
```

---

## 🛠️ Technology Stack

### 🔗 **Smart Contract**
- **Solidity** `^0.8.25`
- **Fhenix CoFHE** `^0.0.13` - Fully Homomorphic Encryption
- **Hardhat** `^2.22.17` - Development framework
- **TypeChain** - Type-safe contract interactions

### ⚛️ **Frontend**
- **Next.js** `16.1.5` - React framework with App Router
- **TypeScript** `^5` - Type safety
- **Tailwind CSS** `^4` - Utility-first styling
- **Framer Motion** `^12.29.2` - Animations
- **Ethers.js** `^6.16.0` - Ethereum interaction
- **FhenixJS** `^0.3.1` - Client-side encryption

### 🎨 **UI Components**
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications
- **Radix UI** - Accessible components
- **Class Variance Authority** - Component variants

---

## 📦 Installation

### 📋 **Prerequisites**
- Node.js `^18.0.0`
- npm or yarn
- MetaMask or compatible wallet
- Ethereum Sepolia testnet ETH

### 🚀 **Clone & Setup**

```bash
# Clone the repository
git clone https://github.com/dimmy-bit/cipher-bid.git
cd cipher-bid

# Install backend dependencies
cd contracts-backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### 🔐 **Environment Setup**

Create `.env` file in `contracts-backend/`:

```env
# Your wallet private key (for deployment)
PRIVATE_KEY=your_private_key_here

# Alchemy RPC URL (or any Sepolia RPC)
ALCHEMY_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

### 🌐 **Network Configuration**

**Supported Networks:**
- **Sepolia Testnet** (Primary): Chain ID `11155111`
- **Fhenix Helium** (Future): Chain ID `8008135`

**RPC Endpoints:**
```javascript
// Sepolia
https://ethereum-sepolia-rpc.publicnode.com
// Or your Alchemy URL

// Fhenix Helium
https://api.helium.fhenix.zone
```

---

## 🚀 Quick Start

### 1️⃣ **Deploy Smart Contract**

```bash
cd contracts-backend

# Compile contracts
npm run compile

# Deploy to Sepolia
npm run deploy:sepolia

# Or deploy to Fhenix Helium
npm run deploy:helium
```

### 2️⃣ **Update Frontend Contract Address**

After deployment, update the contract address in `frontend/app/page.tsx`:

```typescript
const CONTRACT_ADDRESS = "0x40a0b2d266262e8453F645a5FDc9237587Fde5f7";
```

### 3️⃣ **Start Frontend**

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build
npm start
```

### 4️⃣ **Access dApp**

Open https://cipher-bid-z5n3.vercel.app/ (http://localhost:3000) in your browser.

---

## 📖 Usage Guide

### 🔗 **Connect Wallet**
1. Click "CONNECT BIDDER WALLET"
2. Approve connection in MetaMask
3. Ensure you're on Sepolia testnet

### 🎯 **Place Bids**
1. Enter bid amount in SEP (placeholder value)
2. Click "PLACE PRIVATE BID"
3. Approve transaction in MetaMask
4. Watch bid counter increment

### ⏰ **Auction Phases**

#### **Active Auction**
- Timer shows remaining time
- Bid input is visible
- Real-time bid counter

#### **Ended Auction**
- Timer shows `00:00:00`
- Bid input is hidden

**For Regular Users:**
- Shows "👑 Waiting for next round..."

**For Contract Owner:**
- Duration input field
- "START ROUND" button
- Can set any round length

### 🔄 **Rolling Rounds (Owner Only)**

1. Wait for auction to end
2. Enter desired duration in minutes
3. Click "START ROUND"
4. New round begins immediately

---

## 🔧 Smart Contract

### 📜 **Contract Overview**

```solidity
contract CipherBid {
    euint32 private highestBid;      // Encrypted highest bid
    eaddress private winner;         // Encrypted winner address
    uint256 public endTime;          // Auction end timestamp
    address public owner;            // Contract owner
    bool public claimed;             // Claim status
    uint256 public totalBids;        // Total bids placed
    bool public ended;               // Auction ended status
}
```

### 🎯 **Key Functions**

#### `bid(InEuint32 encryptedAmount)`
- Places an encrypted bid
- Increments `totalBids` counter
- Updates highest bid if greater

#### `claim()`
- Ends the auction
- Reveals winner (simplified version)
- Marks auction as claimed and ended

#### `startNewRound(uint256 durationMinutes)`
- Owner only function
- Resets all auction state
- Starts new round with custom duration

#### `getEncryptedHighestBid()`
- Returns encrypted highest bid
- Used to check if bids exist

#### `timeRemaining()`
- Returns seconds until auction ends
- `0` if auction has ended

### 🔐 **FHE Implementation**

**Critical Rules:**
- ❌ No conditional branching on encrypted types
- ✅ Use `FHE.select()` for conditional logic
- ✅ Always encrypt client-side before sending
- ✅ Use proper ACL management

---

## 🎨 Frontend

### 🏗️ **Component Structure**

```typescript
// Main auction interface
export default function Home() {
  // State management
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [totalBids, setTotalBids] = useState<number>(0);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Core functions
  const handleBid = async () => { /* ... */ };
  const handleClaim = async () => { /* ... */ };
  const handleStartNewRound = async () => { /* ... */ };
}
```

### 🎭 **UI States**

| State | Owner View | Regular User View |
|-------|------------|-------------------|
| **Active Auction** | Bid input + timer | Bid input + timer |
| **Ended Auction** | Duration input + "START ROUND" | "Waiting for next round..." |
| **Claimed** | "Auction Claimed" | "Auction Claimed" |

### 🎨 **Design System**

```css
/* Theme */
--bg-primary: zinc-950;
--accent-green: #00FF00;
--accent-purple: #9D00FF;

/* Typography */
font-family: "Geist Mono", monospace;

/* Animations */
- Smooth transitions (500ms)
- Hover effects with scale
- Neon glow effects
```

---

## 🔄 Rolling Rounds

### 📋 **Round Lifecycle**

1. **Setup Phase**
   ```solidity
   startNewRound(5) // 5-minute round
   ```

2. **Active Phase**
   - Timer counts down from 5:00
   - Users place encrypted bids
   - Bid counter increments

3. **End Phase**
   - Timer reaches 00:00
   - Bidding automatically stops
   - UI transitions to ended state

4. **Reset Phase**
   ```solidity
   highestBid = 0
   totalBids = 0
   winner = 0
   claimed = false
   ended = false
   ```

### 🎛️ **Duration Options**

| Use Case | Duration | Description |
|----------|----------|-------------|
| **Demo/Testing** | 5 minutes | Quick cycles for testing |
| **Short Auctions** | 15-30 minutes | Quick decision making |
| **Standard** | 1-2 hours | Normal auction length |
| **Extended** | 24 hours | Serious bidding periods |

---

## 🧪 Testing

### 🔬 **Smart Contract Testing**

```bash
cd contracts-backend

# Run tests (when implemented)
npm test

# Local deployment testing
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

### 🎨 **Frontend Testing**

```bash
cd frontend

# Linting
npm run lint

# Type checking
npm run build

# Manual testing
npm run dev
```

### 🌐 **Integration Testing**

1. **Wallet Connection**
   - Test MetaMask integration
   - Verify network switching
   - Check address display

2. **Bidding Flow**
   - Place encrypted bids
   - Verify bid counter
   - Test timer functionality

3. **Rolling Rounds**
   - Test owner controls
   - Verify round reset
   - Check duration settings

---

## 📜 API Reference

### 🔗 **Contract ABI**

Key functions and their signatures:

```json
[
  {
    "name": "bid",
    "inputs": [{"name": "encryptedAmount", "type": "tuple"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "claim",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "startNewRound",
    "inputs": [{"name": "durationMinutes", "type": "uint256"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "totalBids",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  }
]
```

### 🎯 **Frontend Hooks**

```typescript
// FHE integration hook
const { 
  address, 
  isInitialized, 
  connect, 
  disconnect, 
  encryptUint32, 
  provider 
} = useFhenix();

// Usage example
const encrypted = await encryptUint32(amount);
```

---

## 🤝 Contributing

### 📝 **Development Guidelines**

1. **FHE Rules**
   - Never use conditional logic on encrypted types
   - Always encrypt client-side
   - Follow CoFHE documentation

2. **Code Style**
   - Use TypeScript throughout
   - Follow ESLint configuration
   - Maintain consistent naming

3. **Testing**
   - Test all user flows
   - Verify FHE operations
   - Check edge cases

### 🔄 **Contribution Workflow**

```bash
# Fork repository
git clone https://github.com/your-username/cipher-bid.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes
git add .
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Fhenix Protocol** - For the CoFHE implementation
- **Hardhat** - Development framework
- **Next.js** - Frontend framework
- **OpenZeppelin** - Security standards

---

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs](https://github.com/dimmy-bit/cipher-bid/issues)
- **Discord**: Join our community
- **Twitter**: Follow for updates

---

<div align="center">

**Built with ❤️ using Fully Homomorphic Encryption**

[⭐ Star this repo](https://github.com/dimmy-bit/cipher-bid) • [🐦 Follow us](https://twitter.com) • [💬 Join Discord](https://discord.gg)

</div>
