"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import * as Freighter from "@stellar/freighter-api";

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
    console.log("WalletContext V3: Connect Clicked");
    setIsConnecting(true);
    setError(null);
    
    try {
      // Direct access to window.freighter is often most reliable for debugging
      const freighter = (window as any).freighter;
      console.log("WalletContext V3: window.freighter available:", !!freighter);

      let pk = "";

      // 1. Try modern requestAccess
      console.log("WalletContext V3: Calling Freighter.requestAccess()...");
      try {
        const result = await Freighter.requestAccess();
        console.log("WalletContext V3: requestAccess result:", result);
        if (Array.isArray(result)) pk = result[0];
        else if (typeof result === "string") pk = result;
      } catch (e) {
        console.warn("WalletContext V3: requestAccess failed:", e);
      }

      // 2. Fallback to getPublicKey
      if (!pk) {
        console.log("WalletContext V3: Calling Freighter.getPublicKey()...");
        try {
          pk = await Freighter.getPublicKey();
          console.log("WalletContext V3: getPublicKey result:", pk);
        } catch (e) {
          console.warn("WalletContext V3: getPublicKey failed:", e);
        }
      }

      // 3. Fallback to direct window.freighter
      if (!pk && freighter && freighter.getPublicKey) {
        console.log("WalletContext V3: Calling window.freighter.getPublicKey()...");
        pk = await freighter.getPublicKey();
        console.log("WalletContext V3: window.freighter result:", pk);
      }

      if (pk && pk.length === 56 && pk.startsWith("G")) {
        console.log("WalletContext V3: Success setting address:", pk);
        setAddress(pk);
      } else {
        throw new Error("Could not retrieve a valid Stellar address. Please ensure Freighter is unlocked and authorized.");
      }
    } catch (err: any) {
      console.error("WalletContext V3: Final Error:", err);
      const msg = err.message || "Connection failed";
      setError(msg);
      alert("SOROBANFLOW ERROR: " + msg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    const auto = async () => {
      try {
        if (await Freighter.isConnected()) {
          const pk = await Freighter.getPublicKey();
          if (pk && pk.length === 56) setAddress(pk);
        }
      } catch (e) {}
    };
    auto();
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
