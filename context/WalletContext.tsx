"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { isConnected, getPublicKey } from "@stellar/freighter-api";

interface WalletContextType {
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    console.log("WalletContext: Starting connection process...");
    setIsConnecting(true);
    setError(null);
    
    try {
      // 1. Check if Freighter is even installed
      console.log("WalletContext: Checking if Freighter is connected...");
      const connected = await isConnected();
      console.log("WalletContext: isConnected result:", connected);

      if (!connected) {
        throw new Error("Freighter wallet not found. Please install the extension.");
      }

      // 2. Try to get public key
      console.log("WalletContext: Requesting public key...");
      let publicKey = "";
      
      try {
        // Prefer the direct window object if available as it's often more reliable in prod
        const freighter = (window as any).freighter;
        if (freighter && freighter.getPublicKey) {
          console.log("WalletContext: Using window.freighter.getPublicKey");
          publicKey = await freighter.getPublicKey();
        } else {
          console.log("WalletContext: Using @stellar/freighter-api getPublicKey");
          publicKey = await getPublicKey();
        }
      } catch (getPkErr: any) {
        console.warn("WalletContext: getPublicKey failed, trying fallback...", getPkErr);
        // Fallback: If they haven't shared access yet, request it
        const freighter = (window as any).freighter;
        if (freighter && freighter.requestAccess) {
          const result = await freighter.requestAccess();
          publicKey = Array.isArray(result) ? result[0] : result;
        } else {
          throw getPkErr;
        }
      }

      console.log("WalletContext: Received public key:", publicKey);

      if (publicKey && typeof publicKey === "string" && publicKey.length > 5) {
        setAddress(publicKey);
        console.log("WalletContext: Successfully connected to:", publicKey);
      } else {
        throw new Error("No public key returned from Freighter.");
      }
    } catch (err: any) {
      const msg = err.message || "Failed to connect to wallet.";
      setError(msg);
      console.error("WalletContext: Connection error:", err);
      alert(msg); // Provide immediate visual feedback for the user
    } finally {
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    // Auto-connect if already authorized
    const checkConnection = async () => {
      try {
        if (await isConnected()) {
          const pubKey = await getPublicKey();
          if (pubKey && typeof pubKey === "string" && pubKey.length > 5) {
            setAddress(pubKey);
          }
        }
      } catch (e) {
        // Ignore auto-connect failures
      }
    };
    checkConnection();
  }, []);

  const disconnect = useCallback(() => {
    console.log("WalletContext: Disconnecting wallet...");
    setAddress(null);
  }, []);

  return (
    <WalletContext.Provider value={{ address, isConnecting, error, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
}
