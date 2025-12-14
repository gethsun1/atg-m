"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { formatAddress } from "@/lib/movement/explorer";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WalletConnectProps {
  onConnect: (account: { address: string; publicKey: string }) => void;
  onDisconnect: () => void;
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const { 
    connect, 
    disconnect, 
    account, 
    connected, 
    wallets,
    wallet
  } = useWallet();

  useEffect(() => {
    if (connected && account) {
      onConnect({
        address: account.address?.toString() || account.address,
        publicKey: account.publicKey?.toString() || "",
      });
    }
  }, [connected, account, onConnect]);

  const handleConnect = async () => {
    try {
      // Get Petra wallet (first available wallet)
      const petraWallet = wallets.find((w) => w.name === "Petra");
      if (petraWallet) {
        await connect(petraWallet.name);
      } else {
        alert("Petra wallet not found. Please install Petra wallet extension.");
      }
    } catch (error: any) {
      console.error("Connection error:", error);
      alert(error.message || "Failed to connect wallet");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      onDisconnect();
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  if (connected && account) {
    const displayAddress = typeof account.address === 'string' 
      ? account.address 
      : account.address?.toString() || '';
      
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <div className="glass-strong rounded-xl px-5 py-3 border border-emerald-500/30 glow-border group hover:scale-105 transition-transform">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20"></div>
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-semibold mb-0.5">{wallet?.name || "Wallet"}</div>
              <div className="text-sm font-mono text-white">
                {formatAddress(displayAddress)}
              </div>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDisconnect}
          className="px-4 py-3 glass-strong hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 font-medium transition-all"
        >
          Disconnect
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleConnect}
        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-semibold shadow-glow hover:shadow-glow-lg transition-all btn-premium relative overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          Connect Wallet
          <span className="text-lg">🔗</span>
        </span>
      </motion.button>
      {wallets.length === 0 && (
        <div className="text-xs text-gray-400 text-center">
          Install{" "}
          <a
            href="https://petra.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            Petra Wallet
          </a>
        </div>
      )}
    </div>
  );
}
