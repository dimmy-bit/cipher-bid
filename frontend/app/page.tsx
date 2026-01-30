"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useFhenix } from "@/hooks/useFhenix";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Gavel, Timer, Trophy, Lock, ShieldCheck, AlertCircle, CheckCircle2, ChevronRight, Flame, RotateCcw, Crown } from "lucide-react";
import ABI from "@/lib/abi.json";
import { toast, Toaster } from "sonner";

const CONTRACT_ADDRESS = "0x40a0b2d266262e8453F645a5FDc9237587Fde5f7";

export default function Home() {
  const { address, isInitialized, connect, disconnect, encryptUint32, error: fhenixError, provider } = useFhenix();
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [highestBidEncrypted, setHighestBidEncrypted] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [totalBids, setTotalBids] = useState<number>(0);
  const [isWinner, setIsWinner] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [newRoundDuration, setNewRoundDuration] = useState("5");

  useEffect(() => {
    if (provider && isInitialized) {
      fetchAuctionDetails();
      const interval = setInterval(fetchAuctionDetails, 10000);
      return () => clearInterval(interval);
    }
  }, [provider, isInitialized]);

  const fetchAuctionDetails = async () => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const remaining = await contract.timeRemaining();
      setTimeLeft(Number(remaining));
      setAuctionEnded(Number(remaining) === 0);

      const hb = await contract.getEncryptedHighestBid();
      setHighestBidEncrypted(hb !== BigInt(0));
      
      // Fetch total bids
      const bids = await contract.totalBids();
      setTotalBids(Number(bids));
      
      // Check if user is owner
      if (address) {
        const ownerAddress = await contract.owner();
        const ownerStatus = address.toLowerCase() === ownerAddress.toLowerCase();
        setIsOwner(ownerStatus);
        console.log("Owner Debug:", {
          userAddress: address,
          contractOwner: ownerAddress,
          isOwner: ownerStatus
        });
      }
      
      // Check claimed status
      const claimedStatus = await contract.claimed();
      setClaimed(claimedStatus);
      console.log("Auction Status Debug:", {
        auctionEnded,
        claimed: claimedStatus,
        isOwner,
        totalBids
      });
      
    } catch (err) {
      console.error("Failed to fetch auction details:", err);
    }
  };

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    console.group("Transaction: Place Bid");

    if (!isInitialized) {
      toast.error("Please connect your wallet first");
      console.groupEnd();
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid bid amount");
      console.groupEnd();
      return;
    }

    setLoading(true);
    const bidToastId = toast.loading("Executing Trace: Encrypting...");

    try {
      console.log("Step 1: Encrypting bid amount:", amount);
      const encrypted = await encryptUint32(amount);

      toast.loading("Step 2: Preparing Transaction...", { id: bidToastId });
      const signer = await provider!.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      console.log("Step 2: Encrypted Payload prepared:", encrypted);
      console.log("Step 3: Estimating Gas / Simulating...");

      try {
        const gasEstimate = await contract.bid.estimateGas(encrypted);
        console.log("-> Gas Estimate Success:", gasEstimate.toString());
      } catch (estErr: any) {
        console.error("-> GAS ESTIMATION FAILED (SIMULATION ERROR):", estErr);
        if (estErr.data) console.error("-> Raw Revert Data:", estErr.data);
        throw new Error("Contract Simulation Failed: The transaction will likely revert. Check console for 0x4d13139e logic.");
      }

      toast.loading("Step 3: Sending to MetaMask...", { id: bidToastId });
      const tx = await contract.bid(encrypted);
      console.log("Step 4: Transaction Sent. Hash:", tx.hash);

      toast.loading("Step 4: Waiting for Block Confirmation...", { id: bidToastId });
      const receipt = await tx.wait();
      console.log("Step 5: SUCCESS! Receipt:", receipt);

      toast.success("Bid placed successfully!", { id: bidToastId, icon: <CheckCircle2 className="text-neon-green" /> });
      setBidAmount("");
      fetchAuctionDetails();
    } catch (err: any) {
      console.error("-> TRACE FAILED:", err);
      const errorMsg = err.reason || err.message || "Failed to place bid";
      toast.error(errorMsg, { id: bidToastId });
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  const handleClaim = async () => {
    if (!isInitialized) {
      toast.error("Please connect your wallet first");
      return;
    }

    setLoading(true);
    const claimToastId = toast.loading("Claiming prize...");

    try {
      const signer = await provider!.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      
      const tx = await contract.claim();
      await tx.wait();
      
      toast.success("Prize claimed successfully!", { id: claimToastId, icon: <Trophy className="text-neon-green" /> });
      fetchAuctionDetails();
    } catch (err: any) {
      console.error("Claim failed:", err);
      const errorMsg = err.reason || err.message || "Failed to claim prize";
      toast.error(errorMsg, { id: claimToastId });
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewRound = async () => {
    if (!isInitialized) {
      toast.error("Please connect your wallet first");
      return;
    }

    const duration = parseInt(newRoundDuration);
    if (isNaN(duration) || duration <= 0) {
      toast.error("Please enter a valid duration");
      return;
    }

    setLoading(true);
    const startToastId = toast.loading("Starting new round...");

    try {
      const signer = await provider!.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      
      // Use custom duration from input
      const tx = await contract.startNewRound(duration);
      await tx.wait();
      
      toast.success(`New ${duration}-minute round started!`, { id: startToastId, icon: <RotateCcw className="text-neon-green" /> });
      fetchAuctionDetails();
    } catch (err: any) {
      console.error("Start new round failed:", err);
      const errorMsg = err.reason || err.message || "Failed to start new round";
      toast.error(errorMsg, { id: startToastId });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-4 selection:bg-neon-purple/30">
      <Toaster position="top-center" theme="dark" richColors />

      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-green/10 blur-[120px] rounded-full" />
      </div>

      {/* Disconnect Button at Top Right */}
      <AnimatePresence>
        {isInitialized && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-8 right-8 z-50"
          >
            <button
              onClick={disconnect}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-400/50 transition-all font-mono text-sm"
            >
              <div className="w-2 h-2 rounded-full bg-neon-green neon-glow-green" />
              {address?.slice(0, 6)}...{address?.slice(-4)}
              <ChevronRight size={14} className="rotate-90" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            animate={{ scale: [1, 1.01, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block"
          >
            <h1 className="text-6xl font-bold tracking-tighter mb-2 italic">
              CIPHER<span className="text-neon-green neon-glow-green">BID</span>
            </h1>
          </motion.div>
          <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase">
            Quantifiably Private Auctions
          </p>
        </div>

        {/* Debug Info - Remove in production */}
        <div className="mb-4 p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-xs font-mono">
          <div>Connected: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "No"}</div>
          <div>Is Owner: {isOwner ? "YES" : "NO"}</div>
          <div>Auction Ended: {auctionEnded ? "YES" : "NO"}</div>
          <div>Claimed: {claimed ? "YES" : "NO"}</div>
          <div>Total Bids: {totalBids}</div>
        </div>

        {/* Main Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-neon-green to-neon-purple opacity-50" />

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider font-bold">
                <Timer size={14} /> Time Remaining
              </div>
              <div className="text-3xl font-mono tracking-tighter text-neon-green">
                {timeLeft !== null ? formatTime(timeLeft) : "00:00:00"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider font-bold">
                <Trophy size={14} /> Current Leader
              </div>
              <div className="flex items-center gap-2 text-3xl font-mono tracking-tighter truncate">
                {highestBidEncrypted ? (
                  <span className="flex items-center gap-2 text-neon-purple animate-pulse">
                    <Lock size={20} /> ENCRYPTED
                  </span>
                ) : (
                  <span className="text-zinc-800 text-xl italic uppercase">0.00 SEP</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider font-bold">
                <Flame size={14} /> Total Bids
              </div>
              <div className="flex items-center gap-2 text-3xl font-mono tracking-tighter text-neon-green">
                🔥 {totalBids}
              </div>
            </div>
          </div>

          {!isInitialized ? (
            <button
              onClick={connect}
              className="w-full h-16 rounded-2xl bg-zinc-50 text-zinc-950 font-bold text-lg flex items-center justify-center gap-3 hover:bg-neon-green transition-all duration-500 active:scale-95 group"
            >
              <Wallet size={20} className="group-hover:rotate-12 transition-transform" />
              CONNECT BIDDER WALLET
            </button>
          ) : auctionEnded ? (
            // Auction Ended UI
            <div className="space-y-4">
              {!claimed ? (
                <>
                  {isOwner ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Minutes"
                          value={newRoundDuration}
                          onChange={(e) => setNewRoundDuration(e.target.value)}
                          disabled={loading}
                          className="flex-1 h-12 bg-zinc-950/50 border-2 border-zinc-800 rounded-xl px-4 text-lg font-mono focus:border-neon-purple focus:outline-none focus:ring-4 focus:ring-neon-purple/10 transition-all placeholder:text-zinc-800 text-center"
                        />
                        <button
                          onClick={handleStartNewRound}
                          disabled={loading}
                          className="flex-1 h-12 rounded-xl bg-neon-purple text-zinc-50 font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(157,0,255,0.4)] hover:scale-[1.01] active:scale-95 transition-all duration-500"
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              PROCESSING...
                            </div>
                          ) : (
                            <>
                              <RotateCcw size={16} />
                              START ROUND
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-16 rounded-2xl bg-zinc-800 text-zinc-500 font-bold text-lg flex items-center justify-center gap-3">
                      <Crown size={20} />
                      Waiting for next round...
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-16 rounded-2xl bg-zinc-800 text-zinc-500 font-bold text-lg flex items-center justify-center gap-3">
                  <Trophy size={20} />
                  Auction Claimed
                </div>
              )}
            </div>
          ) : (
            // Active Auction UI
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleBid}
              className="space-y-4"
            >
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  disabled={loading || auctionEnded}
                  className="w-full h-20 bg-zinc-950/50 border-2 border-zinc-800 rounded-2xl px-6 text-3xl font-mono focus:border-neon-purple focus:outline-none focus:ring-4 focus:ring-neon-purple/10 transition-all placeholder:text-zinc-800 text-center"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700 font-bold">
                  SEP
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || auctionEnded}
                className={`w-full h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-500 relative overflow-hidden
                  ${auctionEnded
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-neon-purple text-zinc-50 hover:shadow-[0_0_30px_rgba(157,0,255,0.4)] hover:scale-[1.01] active:scale-95"
                  }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    PROCESSING...
                  </div>
                ) : (
                  <>
                    <Gavel size={20} />
                    PLACE PRIVATE BID
                  </>
                )}
              </button>
            </motion.form>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { label: "Network", val: "Sepolia" },
            { label: "Privacy", val: "FHE v1" },
            { label: "Status", val: auctionEnded ? "Ended" : "Live" }
          ].map((item) => (
            <div key={item.label} className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 text-center">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{item.label}</div>
              <div className="text-zinc-300 font-mono text-sm">{item.val}</div>
            </div>
          ))}
        </div>

        {/* Made by Mir */}
        <div className="mt-6 text-center">
          <a
            href="https://x.com/0xmirx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] font-mono text-neon-green/60 hover:text-neon-green/80 transition-all duration-300 hover:scale-105 tracking-widest uppercase"
            style={{
              textShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
            }}
          >
            <span className="inline-block w-1 h-1 bg-neon-green/60 rounded-full animate-pulse"></span>
            MADE BY MIR
            <span className="inline-block w-1 h-1 bg-neon-green/60 rounded-full animate-pulse"></span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
