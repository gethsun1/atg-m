"use client";

import { useState } from "react";
import { AIDecision } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface AIAnalysisPanelProps {
  decision: AIDecision | null;
  onAnalyze: () => Promise<void>;
  loading: boolean;
}

export default function AIAnalysisPanel({ decision, onAnalyze, loading }: AIAnalysisPanelProps) {
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      await onAnalyze();
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return { text: "text-emerald-400", bg: "from-emerald-500/20 to-green-500/20", border: "border-emerald-500/30", glow: "shadow-emerald-500/50" };
      case "medium": return { text: "text-amber-400", bg: "from-amber-500/20 to-yellow-500/20", border: "border-amber-500/30", glow: "shadow-amber-500/50" };
      case "high": return { text: "text-red-400", bg: "from-red-500/20 to-orange-500/20", border: "border-red-500/30", glow: "shadow-red-500/50" };
      default: return { text: "text-gray-400", bg: "from-gray-500/20 to-gray-500/20", border: "border-gray-500/30", glow: "shadow-gray-500/50" };
    }
  };

  const getActionColor = (action: string) => {
    return action === "rebalance" 
      ? { text: "text-blue-400", bg: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/30" }
      : { text: "text-gray-400", bg: "from-gray-500/20 to-gray-600/20", border: "border-gray-500/30" };
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-strong rounded-2xl p-8 glow-border card-hover relative overflow-hidden"
    >
      {/* AI Theme Background Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl animate-pulse">🤖</span>
          AI Analysis
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAnalyze}
          disabled={analyzing || loading}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-glow disabled:opacity-50 transition-all btn-premium relative overflow-hidden"
        >
          {analyzing ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Analyzing...
            </span>
          ) : (
            "Run AI Analysis"
          )}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {analyzing && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">🧠</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="text-lg font-semibold text-white mb-2">AI Processing</div>
              <div className="text-sm text-gray-400 flex items-center gap-1">
                Analyzing treasury data
                <span className="animate-pulse">...</span>
              </div>
            </div>
          </motion.div>
        )}

        {!analyzing && decision && (
          <motion.div
            key="decision"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Risk & Action Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-xl p-6 bg-gradient-to-br ${getRiskColor(decision.risk_level).bg} border ${getRiskColor(decision.risk_level).border} shadow-lg ${getRiskColor(decision.risk_level).glow}`}
              >
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Risk Level</div>
                <div className={`text-3xl font-bold ${getRiskColor(decision.risk_level).text} uppercase flex items-center gap-2`}>
                  {decision.risk_level}
                  {decision.risk_level === 'low' && '✅'}
                  {decision.risk_level === 'medium' && '⚠️'}
                  {decision.risk_level === 'high' && '🚨'}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-xl p-6 bg-gradient-to-br ${getActionColor(decision.action).bg} border ${getActionColor(decision.action).border} shadow-lg`}
              >
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Recommended Action</div>
                <div className={`text-3xl font-bold ${getActionColor(decision.action).text} uppercase flex items-center gap-2`}>
                  {decision.action}
                  {decision.action === 'rebalance' ? '🔄' : '✋'}
                </div>
              </motion.div>
            </div>

            {/* Confidence Meter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-400 uppercase tracking-wide">AI Confidence</div>
                <div className="text-2xl font-bold text-white">
                  {(decision.confidence * 100).toFixed(0)}%
                </div>
              </div>
              <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${decision.confidence * 100}%` }}
                  transition={{ duration: 1, delay: 0.5, type: "spring" }}
                  className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 relative"
                >
                  <div className="absolute inset-0 shimmer"></div>
                </motion.div>
              </div>
            </motion.div>

            {/* AI Reasoning */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6 group hover:bg-white/10 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">💡</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">AI Reasoning</div>
                  <div className="text-sm text-white leading-relaxed">
                    {decision.reasoning}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Proposed Allocation */}
            {decision.execution_payload && decision.action === "rebalance" && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass rounded-xl p-6 border border-blue-500/30"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">📊</span>
                  <div className="text-sm text-blue-400 uppercase tracking-wide font-semibold">Proposed Allocation</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {decision.execution_payload.targetAllocation.map((percentage, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="glass-strong rounded-lg p-4 text-center hover:scale-105 transition-transform"
                    >
                      <div className="text-3xl font-bold text-gradient mb-1">{percentage}%</div>
                      <div className="text-xs text-gray-400">Asset {idx + 1}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Powered by Badge */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-2 text-xs text-gray-500"
            >
              <span>⚡</span>
              <span>Powered by HuggingFace Mistral-7B</span>
            </motion.div>
          </motion.div>
        )}

        {!analyzing && !decision && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4 animate-float">🤖</div>
            <div className="text-lg font-semibold text-white mb-2">Ready for AI Analysis</div>
            <div className="text-sm text-gray-400 max-w-md mx-auto">
              Click "Run AI Analysis" to get intelligent treasury recommendations powered by advanced machine learning
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
