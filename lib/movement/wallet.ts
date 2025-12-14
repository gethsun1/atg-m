/**
 * Movement Wallet Connection Utilities
 * Supports Petra and Pontem wallets via Aptos standard
 */

export interface WalletAccount {
  address: string;
  publicKey: string;
}

export interface MovementWallet {
  connect: () => Promise<WalletAccount>;
  disconnect: () => Promise<void>;
  account: () => Promise<WalletAccount>;
  signAndSubmitTransaction: (transaction: any) => Promise<any>;
  isConnected: () => Promise<boolean>;
}

/**
 * Get Petra wallet if available
 */
export function getPetraWallet(): MovementWallet | null {
  if (typeof window === "undefined") return null;
  
  const petra = (window as any).petra;
  if (!petra) return null;

  return {
    connect: async () => {
      const response = await petra.connect();
      return {
        address: response.address,
        publicKey: response.publicKey,
      };
    },
    disconnect: async () => {
      await petra.disconnect();
    },
    account: async () => {
      const account = await petra.account();
      return {
        address: account.address,
        publicKey: account.publicKey,
      };
    },
    signAndSubmitTransaction: async (transaction: any) => {
      return await petra.signAndSubmitTransaction(transaction);
    },
    isConnected: async () => {
      return await petra.isConnected();
    },
  };
}

/**
 * Get Pontem wallet if available
 */
export function getPontemWallet(): MovementWallet | null {
  if (typeof window === "undefined") return null;
  
  const pontem = (window as any).pontem;
  if (!pontem) return null;

  return {
    connect: async () => {
      await pontem.connect();
      const account = await pontem.account();
      return {
        address: account.address,
        publicKey: account.publicKey,
      };
    },
    disconnect: async () => {
      await pontem.disconnect();
    },
    account: async () => {
      const account = await pontem.account();
      return {
        address: account.address,
        publicKey: account.publicKey,
      };
    },
    signAndSubmitTransaction: async (transaction: any) => {
      return await pontem.signAndSubmitTransaction(transaction);
    },
    isConnected: async () => {
      return pontem.isConnected?.() || false;
    },
  };
}

/**
 * Get any available Movement-compatible wallet
 */
export function getAvailableWallet(): MovementWallet | null {
  return getPetraWallet() || getPontemWallet();
}

/**
 * Check if any wallet is installed
 */
export function isWalletInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as any).petra || !!(window as any).pontem;
}

/**
 * Get wallet type name
 */
export function getWalletType(): string | null {
  if (typeof window === "undefined") return null;
  if ((window as any).petra) return "Petra";
  if ((window as any).pontem) return "Pontem";
  return null;
}

