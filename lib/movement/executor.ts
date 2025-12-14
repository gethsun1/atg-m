/**
 * Movement Transaction Executor
 * Handles transaction building, signing, and submission to Movement L1
 */

import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import { MOVEMENT_SDK_CONFIG, TREASURY_CONTRACT_ADDRESS, getNetworkConfig } from "./config";

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
 * Execute a Move transaction via connected wallet
 */
export async function executeMoveTx(
  wallet: any,
  functionName: string,
  functionArgs: any[],
  typeArgs: any[] = []
): Promise<string> {
  try {
    const transaction = {
      data: {
        function: `${TREASURY_CONTRACT_ADDRESS}::treasury::${functionName}`,
        typeArguments: typeArgs,
        functionArguments: functionArgs,
      },
    };

    const response = await wallet.signAndSubmitTransaction(transaction);
    return response.hash;
  } catch (error: any) {
    console.error("Transaction execution failed:", error);
    throw new Error(error.message || "Transaction failed");
  }
}

/**
 * Submit a rebalance proposal transaction
 */
export async function submitRebalanceTx(
  wallet: any,
  proposal: RebalancePayload
): Promise<string> {
  return executeMoveTx(
    wallet,
    "propose_rebalance",
    [proposal.targetAllocation]
  );
}

/**
 * Execute pending rebalance
 */
export async function executeRebalanceTx(wallet: any): Promise<string> {
  return executeMoveTx(wallet, "execute_rebalance", []);
}

/**
 * Initialize treasury for a user
 */
export async function initializeTreasuryTx(
  wallet: any,
  initialBalance: number
): Promise<string> {
  return executeMoveTx(wallet, "initialize_treasury", [initialBalance]);
}

/**
 * Update treasury balance (demo function)
 */
export async function updateBalanceTx(
  wallet: any,
  newBalance: number
): Promise<string> {
  return executeMoveTx(wallet, "update_balance", [newBalance]);
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
 * Get treasury state from on-chain
 */
export async function getTreasuryState(ownerAddress: string): Promise<TreasuryState | null> {
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
  } catch (error) {
    console.error("Failed to fetch treasury state:", error);
    return null;
  }
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
 * Check if treasury is initialized for address
 */
export async function isTreasuryInitialized(ownerAddress: string): Promise<boolean> {
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
  } catch (error) {
    console.error("Failed to check treasury initialization:", error);
    return false;
  }
}

