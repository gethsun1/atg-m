"use client";

import { useState, useEffect } from "react";
import { getAvailableWallet, isWalletInstalled, getWalletType, WalletAccount } from "@/lib/movement/wallet";
import { formatAddress } from "@/lib/movement/explorer";

interface WalletConnectProps {
  onConnect: (account: WalletAccount) => void;
  onDisconnect: () => void;
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const wallet = getAvailableWallet();
      if (wallet) {
        const isConn = await wallet.isConnected();
        if (isConn) {
          const acc = await wallet.account();
          setAccount(acc);
          setConnected(true);
          onConnect(acc);
        }
      }
    } catch (err) {
      console.error("Failed to check connection:", err);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!isWalletInstalled()) {
        setError("No wallet found. Please install Petra or Pontem wallet.");
        setLoading(false);
        return;
      }

      const wallet = getAvailableWallet();
      if (!wallet) {
        setError("Failed to access wallet");
        setLoading(false);
        return;
      }

      const acc = await wallet.connect();
      setAccount(acc);
      setConnected(true);
      onConnect(acc);
    } catch (err: any) {
      console.error("Connection error:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const wallet = getAvailableWallet();
      if (wallet) {
        await wallet.disconnect();
      }
      setAccount(null);
      setConnected(false);
      onDisconnect();
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  };

  if (connected && account) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
          <div className="text-xs text-green-400 mb-1">{getWalletType()} Wallet</div>
          <div className="text-sm font-mono text-green-300">
            {formatAddress(account.address)}
          </div>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleConnect}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-white font-medium transition-colors"
      >
        {loading ? "Connecting..." : "Connect Wallet"}
      </button>
      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
          {error}
        </div>
      )}
      {!isWalletInstalled() && (
        <div className="text-xs text-gray-400 text-center">
          Install{" "}
          <a
            href="https://petra.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Petra
          </a>{" "}
          or{" "}
          <a
            href="https://pontem.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Pontem
          </a>
        </div>
      )}
    </div>
  );
}

