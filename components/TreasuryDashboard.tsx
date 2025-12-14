"use client";

import { TreasuryState } from "@/lib/types";
import { formatTimestamp } from "@/lib/movement/explorer";
import CountUp from "react-countup";
import { motion } from "framer-motion";

interface TreasuryDashboardProps {
  state: TreasuryState | null;
  loading: boolean;
}

export default function TreasuryDashboard({ state, loading }: TreasuryDashboardProps) {
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 glow-border"
      >
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-white/10 rounded w-1/3 skeleton"></div>
          <div className="h-16 bg-white/10 rounded w-2/3 skeleton"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-white/10 rounded skeleton"></div>
            <div className="h-24 bg-white/10 rounded skeleton"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!state) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-12 glow-border card-hover"
      >
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float">💼</div>
          <div className="text-2xl font-bold text-white mb-3">No Treasury Found</div>
          <div className="text-gray-400 max-w-md mx-auto">
            Initialize your treasury to get started with AI-powered autonomous management
          </div>
        </div>
      </motion.div>
    );
  }

  const healthColor = state.balance > 50000 ? "text-emerald-400" : state.balance > 20000 ? "text-amber-400" : "text-red-400";
  const healthBgColor = state.balance > 50000 ? "from-emerald-500/20 to-green-500/20" : state.balance > 20000 ? "from-amber-500/20 to-yellow-500/20" : "from-red-500/20 to-orange-500/20";
  const healthLabel = state.balance > 50000 ? "Healthy" : state.balance > 20000 ? "Moderate" : "Low";
  const healthPercentage = Math.min((state.balance / 100000) * 100, 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-strong rounded-2xl p-8 glow-border card-hover group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">🏛️</span>
          Treasury Overview
        </h2>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${healthBgColor} border border-white/10`}>
          <div className={`w-2 h-2 rounded-full ${healthColor} animate-pulse`}></div>
          <span className={`text-sm font-semibold ${healthColor}`}>{healthLabel}</span>
        </div>
      </div>

      {/* Main Balance */}
      <div className="mb-8">
        <div className="text-sm text-gray-400 mb-2">Total Balance</div>
        <div className="text-5xl font-bold text-white mb-2">
          <CountUp 
            end={state.balance} 
            duration={2}
            separator=","
            suffix=" MOVE"
          />
        </div>
        
        {/* Health Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Treasury Health</span>
            <span>{healthPercentage.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${healthPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-full bg-gradient-to-r ${healthBgColor} relative`}
            >
              <div className="absolute inset-0 animate-pulse opacity-50"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Last Action */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-5 hover:bg-white/10 transition-all group/card"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <span className="text-xl">⏰</span>
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Last Action</div>
          </div>
          <div className="text-sm text-white font-medium pl-13">
            {formatTimestamp(state.lastActionTimestamp)}
          </div>
          <div className="text-xs text-gray-500 pl-13 mt-1">
            {(() => {
              const now = Date.now() / 1000;
              const diff = now - state.lastActionTimestamp;
              const hours = Math.floor(diff / 3600);
              const days = Math.floor(hours / 24);
              if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
              if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
              return 'Just now';
            })()}
          </div>
        </motion.div>

        {/* Pending Proposal */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-5 hover:bg-white/10 transition-all group/card"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Pending Proposal</div>
          </div>
          <div className="pl-13">
            {state.hasPendingProposal ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-amber-400">Active</span>
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
              </div>
            ) : (
              <span className="text-sm text-gray-500">None</span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Hover Effect Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl"></div>
    </motion.div>
  );
}
