/**
 * Movement Transaction Executor with Wallet Adapter Support
 */

import { Aptos, AptosConfig, Network, InputTransactionData } from "@aptos-labs/ts-sdk";
import { MOVEMENT_SDK_CONFIG, TREASURY_CONTRACT_ADDRESS } from "./config";

export interface RebalancePayload {
  targetAllocation: number[];
}

export interface TreasuryState {
  balance: number;
  lastActionTimestamp: number;
  hasPendingProposal: boolean;
}

export interface TxStatus {
  success: boolean;
  hash: string;
  message?: string;
}

/**
 * Get Aptos client configured for Movement network
 */
export function getMovementClient(): Aptos {
  const config = new AptosConfig({
    network: Network.CUSTOM,
    fullnode: MOVEMENT_SDK_CONFIG.fullnode,
  });
  return new Aptos(config);
}

/**
 * Build transaction payload for wallet adapter
 */
export function buildTransactionPayload(
  functionName: string,
  functionArgs: any[],
  typeArgs: any[] = []
): InputTransactionData {
  return {
    data: {
      function: `${TREASURY_CONTRACT_ADDRESS}::treasury::${functionName}`,
      typeArguments: typeArgs,
      functionArguments: functionArgs,
    },
  };
}

/**
 * Submit a rebalance proposal transaction
 */
export function buildRebalanceTx(proposal: RebalancePayload): InputTransactionData {
  return buildTransactionPayload("propose_rebalance", [proposal.targetAllocation]);
}

/**
 * Execute pending rebalance
 */
export function buildExecuteRebalanceTx(): InputTransactionData {
  return buildTransactionPayload("execute_rebalance", []);
}

/**
 * Initialize treasury for a user
 */
export function buildInitializeTreasuryTx(initialBalance: number): InputTransactionData {
  return buildTransactionPayload("initialize_treasury", [initialBalance]);
}

/**
 * Update treasury balance (demo function)
 */
export function buildUpdateBalanceTx(newBalance: number): InputTransactionData {
  return buildTransactionPayload("update_balance", [newBalance]);
}

/**
 * Confirm transaction status on-chain
 */
export async function confirmOnChainState(txHash: string): Promise<TxStatus> {
  try {
    const client = getMovementClient();
    const transaction = await client.waitForTransaction({
      transactionHash: txHash,
    });

    return {
      success: transaction.success,
      hash: txHash,
      message: transaction.success ? "Transaction confirmed" : "Transaction failed",
    };
  } catch (error: any) {
    console.error("Transaction confirmation failed:", error);
    return {
      success: false,
      hash: txHash,
      message: error.message || "Confirmation failed",
    };
  }
}

/**
 * Get treasury state from on-chain with retry logic
 */
export async function getTreasuryState(ownerAddress: string): Promise<TreasuryState | null> {
  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const client = getMovementClient();
      
      // Check if treasury exists first
      const existsResponse = await client.view({
        payload: {
          function: `${TREASURY_CONTRACT_ADDRESS}::treasury::treasury_exists`,
          typeArguments: [],
          functionArguments: [ownerAddress],
        },
      });

      const exists = existsResponse[0] as boolean;
      
      if (!exists) {
        return null;
      }

      // Get treasury state
      const response = await client.view({
        payload: {
          function: `${TREASURY_CONTRACT_ADDRESS}::treasury::get_treasury_state`,
          typeArguments: [],
          functionArguments: [ownerAddress],
        },
      });

      return {
        balance: Number(response[0]),
        lastActionTimestamp: Number(response[1]),
        hasPendingProposal: Boolean(response[2]),
      };
    } catch (error: any) {
      lastError = error;
      
      // If rate limited, retry with exponential backoff
      if (error?.status === 429 || error?.response?.status === 429) {
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Rate limited, retrying in ${waitTime}ms...`);
        await sleep(waitTime);
        continue;
      }
      
      console.error("Failed to fetch treasury state:", error);
      return null;
    }
  }
  
  console.error("Failed after all retries:", lastError);
  return null;
}

/**
 * Get pending proposal from on-chain
 */
export async function getPendingProposal(ownerAddress: string): Promise<number[] | null> {
  try {
    const client = getMovementClient();
    
    const response = await client.view({
      payload: {
        function: `${TREASURY_CONTRACT_ADDRESS}::treasury::get_pending_proposal`,
        typeArguments: [],
        functionArguments: [ownerAddress],
      },
    });

    const proposal = response[0] as number[];
    return proposal.length > 0 ? proposal : null;
  } catch (error) {
    console.error("Failed to fetch pending proposal:", error);
    return null;
  }
}

/**
 * Sleep helper for retry logic
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if treasury is initialized for address with retry logic
 */
export async function isTreasuryInitialized(ownerAddress: string): Promise<boolean> {
  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const client = getMovementClient();
      
      const response = await client.view({
        payload: {
          function: `${TREASURY_CONTRACT_ADDRESS}::treasury::treasury_exists`,
          typeArguments: [],
          functionArguments: [ownerAddress],
        },
      });

      return response[0] as boolean;
    } catch (error: any) {
      lastError = error;
      
      // If rate limited (429), wait and retry with exponential backoff
      if (error?.status === 429 || error?.response?.status === 429) {
        const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.log(`Rate limited, retrying in ${waitTime}ms...`);
        await sleep(waitTime);
        continue;
      }
      
      // For other errors, don't retry
      console.error("Failed to check treasury initialization:", error);
      return false;
    }
  }
  
  // All retries failed
  console.error("Failed after all retries:", lastError);
  return false;
}


