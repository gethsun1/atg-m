/**
 * Movement Explorer Utilities
 * Generate explorer URLs and format transaction data for display
 */

import { getNetworkConfig, CURRENT_NETWORK } from "./config";

/**
 * Get explorer URL for transaction
 */
export function getTransactionUrl(txHash: string): string {
  const config = getNetworkConfig(CURRENT_NETWORK);
  return `${config.explorerUrl}/txn/${txHash}?network=${CURRENT_NETWORK}`;
}

/**
 * Get explorer URL for account
 */
export function getAccountUrl(address: string): string {
  const config = getNetworkConfig(CURRENT_NETWORK);
  return `${config.explorerUrl}/account/${address}?network=${CURRENT_NETWORK}`;
}

/**
 * Get explorer URL for module
 */
export function getModuleUrl(moduleAddress: string, moduleName: string): string {
  const config = getNetworkConfig(CURRENT_NETWORK);
  return `${config.explorerUrl}/account/${moduleAddress}/modules/code/${moduleName}?network=${CURRENT_NETWORK}`;
}

/**
 * Format transaction hash for display (truncate middle)
 */
export function formatTxHash(txHash: string, prefixLength: number = 8, suffixLength: number = 6): string {
  if (txHash.length <= prefixLength + suffixLength) {
    return txHash;
  }
  return `${txHash.slice(0, prefixLength)}...${txHash.slice(-suffixLength)}`;
}

/**
 * Format address for display (truncate middle)
 */
export function formatAddress(address: string | any, prefixLength: number = 6, suffixLength: number = 4): string {
  // Convert to string if it's an object (AccountAddress from SDK)
  const addressStr = typeof address === 'string' ? address : address?.toString() || String(address);
  
  if (addressStr.length <= prefixLength + suffixLength) {
    return addressStr;
  }
  return `${addressStr.slice(0, prefixLength)}...${addressStr.slice(-suffixLength)}`;
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  return date.toLocaleString();
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

