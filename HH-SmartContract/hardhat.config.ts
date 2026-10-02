import "dotenv/config";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.34",
      },
      production: {
        version: "0.8.34",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    ...(process.env.SEPOLIA_RPC_URL
      ? {
          sepolia: {
            type: "http" as const,
            chainType: "l1" as const,
            url: process.env.SEPOLIA_RPC_URL,
            accounts: process.env.SEPOLIA_PRIVATE_KEY
              ? [process.env.SEPOLIA_PRIVATE_KEY]
              : [],
          },
        }
      : {}),
    localhost: {
      type: "http",
      chainType: "l1",
      url: "http://127.0.0.1:8545",
      accounts: process.env.LOCALHOST_PRIVATE_KEY
        ? [process.env.LOCALHOST_PRIVATE_KEY]
        : [],
    },
  },
});
