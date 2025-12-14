"use client";

import { useState } from "react";
import { AIDecision, TransactionResult } from "@/lib/types";
import { getTransactionUrl, formatTxHash, copyToClipboard } from "@/lib/movement/explorer";
import { motion, AnimatePresence } from "framer-motion";

interface ExecutionButtonProps {
  decision: AIDecision | null;
  wallet: any;
  onExecute: (decision: AIDecision) => Promise<TransactionResult>;
  disabled: boolean;
}

export default function ExecutionButton({ decision, wallet, onExecute, disabled }: ExecutionButtonProps) {
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExecute = async () => {
    if (!decision || !wallet) return;

    setExecuting(true);
    setResult(null);

    try {
      const txResult = await onExecute(decision);
      setResult(txResult);
    } catch (error: any) {
      setResult({
        success: false,
        hash: "",
        message: error.message || "Execution failed",
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const canExecute = decision && decision.action === "rebalance" && !disabled;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-strong rounded-2xl p-8 glow-border"
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-3xl">🚀</span>
        Execute Action
      </h2>

      <AnimatePresence mode="wait">
        {!decision && (
          <motion.div
            key="no-decision"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4">⏳</div>
            <div className="text-lg font-medium text-white mb-2">Awaiting AI Decision</div>
            <div className="text-sm text-gray-400">
              Run AI analysis first to get actionable recommendations
            </div>
          </motion.div>
        )}

        {decision && decision.action === "hold" && (
          <motion.div
            key="hold"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass rounded-xl p-8 border border-gray-500/30 text-center"
          >
            <div className="text-6xl mb-4">✋</div>
            <div className="text-xl font-semibold text-white mb-3">Hold Position</div>
            <div className="text-sm text-gray-400 max-w-md mx-auto">
              AI recommends maintaining current allocation. No action required at this time.
            </div>
          </motion.div>
        )}

        {decision && decision.action === "rebalance" && (
          <motion.div
            key="execute"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Ready State */}
            {!result && !executing && (
              <>
                <div className="glass rounded-xl p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">⚡</span>
                    <div className="text-sm font-semibold text-blue-400">Ready to Execute Rebalance</div>
                  </div>
                  <div className="text-xs text-gray-400 pl-9">
                    This will submit a transaction to Movement L1 blockchain
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExecute}
                  disabled={!canExecute}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white text-lg font-bold shadow-glow hover:shadow-glow-lg disabled:opacity-50 transition-all btn-premium relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Execute Rebalance
                    <span className="text-xl">🚀</span>
                  </span>
                </motion.button>
              </>
            )}

            {/* Executing State */}
            {executing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-xl p-8 border border-purple-500/30"
              >
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">⚙️</span>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <div className="text-lg font-semibold text-white mb-2">Executing Transaction</div>
                    <div className="text-sm text-gray-400">
                      Please confirm in your wallet...
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Result State */}
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`glass rounded-xl p-6 border ${
                  result.success
                    ? "bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30"
                    : "bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    result.success ? "bg-emerald-500/20" : "bg-red-500/20"
                  }`}>
                    <span className="text-2xl">{result.success ? "✅" : "❌"}</span>
                  </div>
                  <div className="flex-1">
                    <div className={`text-lg font-semibold mb-2 ${
                      result.success ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {result.success ? "Transaction Successful!" : "Transaction Failed"}
                    </div>
                    
                    {result.hash && (
                      <div className="space-y-3 mt-4">
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Transaction Hash</div>
                          <div className="flex items-center gap-2 bg-black/20 rounded-lg p-3">
                            <code className="text-xs text-white font-mono flex-1 break-all">
                              {formatTxHash(result.hash, 16, 12)}
                            </code>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCopy(result.hash)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="Copy hash"
                            >
                              {copied ? (
                                <span className="text-green-400">✓</span>
                              ) : (
                                <span className="text-gray-400">📋</span>
                              )}
                            </motion.button>
                          </div>
                        </div>
                        
                        <motion.a
                          href={getTransactionUrl(result.hash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-sm text-blue-400 transition-all"
                        >
                          <span>View on Explorer</span>
                          <span>↗️</span>
                        </motion.a>
                      </div>
                    )}

                    {result.message && (
                      <div className="text-xs text-gray-400 mt-3">{result.message}</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
