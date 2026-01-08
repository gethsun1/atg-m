/**
 * Movement L1 Network Configuration
 */

export const MOVEMENT_CONFIG = {
  testnet: {
    name: "Movement Testnet Porto",
    rpcUrl: process.env.NEXT_PUBLIC_MOVEMENT_RPC_URL || "https://aptos.testnet.porto.movementlabs.xyz/v1",
    chainId: 177,
    explorerUrl: "https://explorer.movementlabs.xyz",
    faucetUrl: "https://faucet.movementlabs.xyz",
  },
  devnet: {
    name: "Aptos Devnet",
    rpcUrl: process.env.NEXT_PUBLIC_MOVEMENT_RPC_URL || "https://fullnode.devnet.aptoslabs.com/v1",
    chainId: 2,
    explorerUrl: "https://explorer.aptoslabs.com",
    faucetUrl: "https://faucet.devnet.aptoslabs.com",
  },
  mainnet: {
    name: "Movement Mainnet",
    rpcUrl: "https://mainnet.movementlabs.xyz/v1",
    chainId: 126,
    explorerUrl: "https://explorer.movementlabs.xyz",
    faucetUrl: undefined,
  },
} as const;

export type NetworkType = keyof typeof MOVEMENT_CONFIG;

export function getNetworkConfig(network: NetworkType = "testnet") {
  return MOVEMENT_CONFIG[network];
}

export const CURRENT_NETWORK: NetworkType = 
  (process.env.NEXT_PUBLIC_MOVEMENT_NETWORK as NetworkType) || "devnet";

export const TREASURY_CONTRACT_ADDRESS = 
  process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS || "0x74a6726862a2c1b1c3e864fbb44c82d288ce7b2e18a3593a3b444ba2a238abe5";

// Movement uses Aptos SDK
export const MOVEMENT_SDK_CONFIG = {
  network: CURRENT_NETWORK,
  fullnode: getNetworkConfig(CURRENT_NETWORK).rpcUrl,
};

