"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import WalletConnect from "@/components/WalletConnect-new";
import TreasuryDashboard from "@/components/TreasuryDashboard";
import AIAnalysisPanel from "@/components/AIAnalysisPanel";
import ExecutionButton from "@/components/ExecutionButton";
import AnimatedBackground from "@/components/AnimatedBackground";
import { WalletAccount, TreasuryState, AIDecision, TransactionResult } from "@/lib/types";
import { 
  getTreasuryState, 
  isTreasuryInitialized,
  buildInitializeTreasuryTx,
  buildRebalanceTx,
  confirmOnChainState
} from "@/lib/movement/executor-adapter";
import { motion } from "framer-motion";

export default function Home() {
  const { signAndSubmitTransaction, account: walletAccount } = useWallet();
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [treasuryState, setTreasuryState] = useState<TreasuryState | null>(null);
  const [aiDecision, setAiDecision] = useState<AIDecision | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (account) {
      loadTreasuryState();
    }
  }, [account]);

  const loadTreasuryState = async () => {
    if (!account) return;

    setLoading(true);
    try {
      // Ensure address is a string
      const addressStr = String(account.address);
        
      const isInit = await isTreasuryInitialized(addressStr);
      setInitialized(isInit);

      if (isInit) {
        const state = await getTreasuryState(addressStr);
        setTreasuryState(state);
      }
    } catch (error) {
      console.error("Failed to load treasury state:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (acc: WalletAccount) => {
    setAccount(acc);
  };

  const handleDisconnect = () => {
    setAccount(null);
    setTreasuryState(null);
    setAiDecision(null);
    setInitialized(false);
  };

  const handleInitialize = async () => {
    if (!signAndSubmitTransaction) return;

    setLoading(true);
    try {
      const payload = buildInitializeTreasuryTx(100000); // Initialize with 100k MOVE
      const response = await signAndSubmitTransaction(payload);
      console.log("Treasury initialized:", response.hash);
      
      // Wait for confirmation and reload state
      await confirmOnChainState(response.hash);
      setTimeout(() => {
        loadTreasuryState();
      }, 2000);
    } catch (error: any) {
      console.error("Failed to initialize treasury:", error);
      alert("Failed to initialize treasury: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treasuryState: treasuryState || undefined,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.decision) {
        setAiDecision(data.decision);
      } else {
        throw new Error(data.error || "AI analysis failed");
      }
    } catch (error: any) {
      console.error("Analysis error:", error);
      alert("AI analysis failed: " + error.message);
    }
  };

  const handleExecute = async (decision: AIDecision): Promise<TransactionResult> => {
    if (!signAndSubmitTransaction || !decision.execution_payload) {
      throw new Error("Invalid execution state");
    }

    try {
      const payload = buildRebalanceTx(decision.execution_payload);
      const response = await signAndSubmitTransaction(payload);
      
      // Wait for confirmation
      const status = await confirmOnChainState(response.hash);
      
      // Reload treasury state after execution
      setTimeout(() => {
        loadTreasuryState();
      }, 2000);

      return {
        success: status.success,
        hash: response.hash,
        message: status.message || "Rebalance proposal submitted successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Transaction failed");
    }
  };

  return (
    <main className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12 glass-strong rounded-2xl p-6 border border-white/10"
        >
          <div>
            <h1 className="text-5xl font-bold mb-2">
              <span className="text-gradient">ATG-M</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Autonomous Treasury Guardian · Movement Edition
            </p>
          </div>
          <WalletConnect onConnect={handleConnect} onDisconnect={handleDisconnect} />
        </motion.div>

        {/* Hero / Landing Section */}
        {!account && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-strong border border-white/10 rounded-3xl p-16 text-center mb-12 relative overflow-hidden"
          >
            {/* Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-8xl mb-6 animate-float"
            >
              🏦
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Welcome to <span className="text-gradient">ATG-M</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered autonomous treasury management built natively on{" "}
              <span className="text-blue-400 font-semibold">Movement L1</span> using Move smart contracts
            </p>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
              Connect your wallet to experience intelligent treasury automation with real-time AI analysis, 
              on-chain execution, and production-ready security
            </p>
            
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-xl p-6 card-hover"
              >
                <div className="text-4xl mb-3">⚡</div>
                <div className="text-lg font-semibold text-white mb-2">Movement L1 Native</div>
                <div className="text-sm text-gray-400">Built from scratch for Movement blockchain</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-xl p-6 card-hover"
              >
                <div className="text-4xl mb-3">🤖</div>
                <div className="text-lg font-semibold text-white mb-2">AI-Powered</div>
                <div className="text-sm text-gray-400">HuggingFace Mistral-7B inference engine</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass rounded-xl p-6 card-hover"
              >
                <div className="text-4xl mb-3">🔐</div>
                <div className="text-lg font-semibold text-white mb-2">Real Execution</div>
                <div className="text-sm text-gray-400">Actual on-chain transactions, not simulation</div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Initialize Treasury */}
        {account && !initialized && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-12 text-center border border-amber-500/30 mb-8"
          >
            <div className="text-6xl mb-4 animate-float">🚀</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Initialize Your Treasury
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Get started with AI-powered autonomous treasury management on Movement L1
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleInitialize}
              disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white text-lg font-bold shadow-glow hover:shadow-glow-lg disabled:opacity-50 transition-all btn-premium"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Initializing...
                </span>
              ) : (
                "Initialize Treasury"
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Main Dashboard */}
        {account && initialized && (
          <div className="space-y-8 fade-in-stagger">
            {/* Treasury Dashboard */}
            <TreasuryDashboard state={treasuryState} loading={loading} />

            {/* AI Analysis Panel */}
            <AIAnalysisPanel
              decision={aiDecision}
              onAnalyze={handleAnalyze}
              loading={loading}
            />

            {/* Execution Button */}
            <ExecutionButton
              decision={aiDecision}
              wallet={signAndSubmitTransaction}
              onExecute={handleExecute}
              disabled={loading}
            />
          </div>
        )}

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center text-sm text-gray-500"
        >
          <div className="glass rounded-xl p-6 inline-block">
            <div className="mb-3 font-semibold text-white">
              Built for Movement L1 · Powered by Move + HuggingFace AI
            </div>
            <div className="flex items-center justify-center gap-6">
              <a
                href="https://docs.movementlabs.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors hover:underline"
              >
                Movement Docs
              </a>
              <span className="text-gray-600">·</span>
              <a
                href="https://explorer.movementlabs.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors hover:underline"
              >
                Explorer
              </a>
              <span className="text-gray-600">·</span>
              <a
                href="https://faucet.movementlabs.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors hover:underline"
              >
                Faucet
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
