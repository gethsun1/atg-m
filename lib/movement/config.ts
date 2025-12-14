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
  (process.env.NEXT_PUBLIC_MOVEMENT_NETWORK as NetworkType) || "testnet";

export const TREASURY_CONTRACT_ADDRESS = 
  process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS || "";

// Movement uses Aptos SDK
export const MOVEMENT_SDK_CONFIG = {
  network: CURRENT_NETWORK,
  fullnode: getNetworkConfig(CURRENT_NETWORK).rpcUrl,
};

