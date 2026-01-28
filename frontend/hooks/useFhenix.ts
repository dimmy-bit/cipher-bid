"use client";

import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { cofhejs, Encryptable } from "cofhejs/web";
import { toast } from "sonner";

const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111

export const useFhenix = () => {
    const [address, setAddress] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const connect = useCallback(async () => {
        console.group("Fhenix: Connect");
        try {
            console.log("1. Environment check...");
            if (!window.ethereum) {
                throw new Error("MetaMask not found");
            }

            console.log("2. Switching network to Sepolia...");
            try {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: SEPOLIA_CHAIN_ID }],
                });
            } catch (switchError: any) {
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: SEPOLIA_CHAIN_ID,
                                chainName: "Sepolia Test Network",
                                rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
                                nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
                                blockExplorerUrls: ["https://sepolia.etherscan.io"],
                            },
                        ],
                    });
                } else {
                    throw switchError;
                }
            }

            console.log("3. Setting up Ethers v6...");
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const signer = await browserProvider.getSigner();
            const userAddress = await signer.getAddress();
            console.log("-> Connected Address:", userAddress);

            console.log("4. Bridging Provider/Signer to CoFHE SDK...");
            const manualProvider = {
                getChainId: async () => (await browserProvider.getNetwork()).chainId.toString(),
                call: async (tx: any) => await browserProvider.call(tx),
                send: async (method: string, params: any[]) => await browserProvider.send(method, params),
            };

            const manualSigner = {
                getAddress: async () => await signer.getAddress(),
                signTypedData: async (domain: any, types: any, value: any) => await signer.signTypedData(domain, types, value),
                sendTransaction: async (tx: any) => {
                    const res = await signer.sendTransaction(tx);
                    return res.hash;
                },
                provider: manualProvider,
            };

            console.log("5. Initializing CoFHE (TESTNET, SecurityZone 0)...");
            const result = await cofhejs.initialize({
                provider: manualProvider as any,
                signer: manualSigner as any,
                environment: "TESTNET",
                generatePermit: true,
                securityZones: [0],
            });

            if (!result.success) {
                console.error("-> SDK Initialization Failed:", result.error);
                throw new Error(`SDK Error: ${result.error.message}`);
            }

            console.log("6. SUCCESS: SDK and Permit ready.");
            setAddress(userAddress);
            setProvider(browserProvider);
            setIsInitialized(true);
            setError(null);
            toast.success("Wallet Connected!");
        } catch (err: any) {
            console.error("-> Connection Error:", err);
            const msg = err.message || "Failed to initialize Fhenix SDK";
            setError(msg);
            toast.error(msg);
        } finally {
            console.groupEnd();
        }
    }, []);

    const encryptUint32 = useCallback(async (value: number) => {
        console.group(`Fhenix: Encryption Trace (${value})`);
        try {
            if (!isInitialized) throw new Error("Fhenix not initialized");

            const scaledValue = Math.floor(value * 100);
            console.log("1. Plaintext scaled value (x100):", scaledValue);

            console.log("2. Encrypting with SecurityZone 0...");
            const item = Encryptable.uint32(BigInt(scaledValue), 0);
            console.log("-> Encryptable Item:", item);

            const result = await cofhejs.encrypt([item]);

            if (!result.success) {
                console.error("-> Encryption call failed:", result.error);
                throw result.error;
            }

            const encryptedData = result.data[0];
            console.log("3. SUCCESS: Encryption Output:", {
                ctHash: encryptedData.ctHash.toString(),
                securityZone: encryptedData.securityZone,
                utype: encryptedData.utype,
                signatureLength: encryptedData.signature.length
            });

            return encryptedData;
        } catch (err: any) {
            console.error("-> Encryption Error:", err);
            throw err;
        } finally {
            console.groupEnd();
        }
    }, [isInitialized]);

    const disconnect = useCallback(() => {
        console.group("Fhenix: Disconnect");
        setAddress(null);
        setProvider(null);
        setIsInitialized(false);
        setError(null);
        toast.info("Wallet Disconnected");
        console.log("-> State reset.");
        console.groupEnd();
    }, []);

    return {
        address,
        provider,
        isInitialized,
        error,
        connect,
        disconnect,
        encryptUint32,
    };
};
