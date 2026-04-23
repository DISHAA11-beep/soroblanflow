"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { isConnected, getPublicKey, requestAccess } from "@stellar/freighter-api";

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
    console.log("WalletContext: connect triggered");
    setIsConnecting(true);
    setError(null);
    
    try {
      // 1. Check if Freighter is available
      const freighterAvailable = await isConnected();
      console.log("WalletContext: Freighter detected:", freighterAvailable);

      if (!freighterAvailable) {
        throw new Error("Freighter wallet not found or not responding. Please ensure it is installed and unlocked.");
      }

      // 2. Request Access / Get Public Key
      console.log("WalletContext: Requesting access...");
      let pk = "";
      
      try {
        // First, try requestAccess (Modern pattern)
        const accessResult = await requestAccess();
        console.log("WalletContext: requestAccess result:", accessResult);
        
        if (Array.isArray(accessResult) && accessResult.length > 0) {
          pk = accessResult[0];
        } else if (typeof accessResult === "string" && accessResult.length > 10) {
          pk = accessResult;
        }

        // If requestAccess didn't return a key, try getPublicKey
        if (!pk) {
          console.log("WalletContext: No key from requestAccess, trying getPublicKey...");
          pk = await getPublicKey();
        }
      } catch (innerErr: any) {
        console.warn("WalletContext: Primary connection failed, trying fallback...", innerErr);
        // Fallback: Direct window object
        const freighter = (window as any).freighter;
        if (freighter && freighter.getPublicKey) {
          pk = await freighter.getPublicKey();
        } else {
          throw innerErr;
        }
      }

      console.log("WalletContext: Final PK:", pk);

      if (pk && pk.startsWith("G") && pk.length === 56) {
        setAddress(pk);
        console.log("WalletContext: Success!");
      } else {
        throw new Error("Invalid or missing public key. Please unlock Freighter and approve the request.");
      }
    } catch (err: any) {
      console.error("WalletContext: Error:", err);
      const msg = err.message || "Failed to connect to wallet.";
      setError(msg);
      alert(msg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    const checkAuto = async () => {
      try {
        if (await isConnected()) {
          const pk = await getPublicKey();
          if (pk && pk.length === 56) setAddress(pk);
        }
      } catch (e) {}
    };
    checkAuto();
  }, []);

  const disconnect = useCallback(() => {
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
  if (context === undefined) throw new Error("useWalletContext must be used within a WalletProvider");
  return context;
}
