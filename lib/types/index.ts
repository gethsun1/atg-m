/**
 * Shared TypeScript types for ATG-M
 */

export interface WalletAccount {
  address: string;
  publicKey: string;
}

export interface TreasuryState {
  balance: number;
  lastActionTimestamp: number;
  hasPendingProposal: boolean;
}

export interface AIDecision {
  risk_level: "low" | "medium" | "high";
  action: "rebalance" | "hold";
  confidence: number;
  reasoning: string;
  execution_payload?: {
    targetAllocation: number[];
  };
}

export interface TransactionResult {
  success: boolean;
  hash: string;
  message?: string;
}

