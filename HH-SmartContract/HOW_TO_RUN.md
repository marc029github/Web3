# Run the Counter interaction script on a local Hardhat node

These steps start a local Hardhat blockchain, deploy `Counter` to it, and run `scripts/interact.js`. The interaction script sends two transactions (`incrementTotal()` and `decrement()`), then prints details for transactions in the scanned blocks.

> **Disclaimer:** The source code and examples in this project are based on material from Vijay Krishnan, *The Essential Guide to Web3: Develop, deploy, and manage distributed applications on the Ethereum network*, p. 222 (Kindle edition). The code and instructions have been adapted for this project’s Hardhat 3 setup.

> This is a local development chain, not Ethereum Mainnet. Use only a development private key printed by your local Hardhat node. Never use or share a real wallet private key.

## 1. Install dependencies (if needed)

From the project root, install the npm dependencies:

```bash
npm install
```

## 2. Configure `.env`

Create or edit `.env` in the project root. `hardhat.config.ts` loads this file and uses `LOCALHOST_PRIVATE_KEY` as the transaction signer. The script uses `COUNTER_ADDRESS` to find the deployed contract.

```dotenv
LOCALHOST_PRIVATE_KEY=0xPASTE_A_LOCAL_HARDHAT_NODE_PRIVATE_KEY_HERE
COUNTER_ADDRESS=0xPASTE_THE_DEPLOYED_COUNTER_ADDRESS_HERE
```

For `LOCALHOST_PRIVATE_KEY`, copy one private key printed by `npx hardhat node` in the next step. Do not commit `.env`; this project’s `.gitignore` excludes it. You will fill in `COUNTER_ADDRESS` after deployment.

## 3. Start the local blockchain

In **Terminal 1**, from the project root, start the node:

```bash
npx hardhat node
```

Leave this terminal running. The node prints development accounts and private keys; copy one private key into `LOCALHOST_PRIVATE_KEY` in `.env`. The configured `localhost` network connects to `http://127.0.0.1:8545`.

## 4. Build and deploy `Counter`

Open **Terminal 2** in the project root. Build the project:

```bash
npx hardhat build
```

Deploy the contract to the running node:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

The output includes a line like `Counter deployed to: 0x...`. Copy that address into `COUNTER_ADDRESS` in `.env`, replacing the placeholder. Save the file.

The address must be from this deployment on the currently running node. The deployer key in `.env` must correspond to an account printed by that node.

## 5. Run the interaction and transaction report

Still in **Terminal 2**, run:

```bash
npx hardhat run scripts/interact.js --network localhost
```

The script will:

1. Read and print the current `count`.
2. Send `incrementTotal()` and wait for it to be mined.
3. Send `decrement()` and wait for it to be mined.
4. Read and print `count` again. The two calls cancel each other out, so the count should return to its starting value.
5. Scan all blocks currently available on the local chain and print details for their transactions, including hashes, sender/recipient, decoded Counter function calls where possible, receipt status, gas information, and events.

Each run sends **two new transactions** and typically adds two blocks to the local chain. The block scan includes the earlier deployment and interaction transactions too; a contract-creation transaction may have large deployment bytecode in its calldata.

## 6. Stop or restart the node

When finished, stop the node in Terminal 1 with **Ctrl+C**. This local node’s blockchain is temporary. After restarting it, deploy `Counter` again and update `COUNTER_ADDRESS` with the new deployment address before running `interact.js`.

## Troubleshooting

- **`Set COUNTER_ADDRESS...`**: Set `COUNTER_ADDRESS` in the project-root `.env` to the address printed by the latest deployment.
- **No signer is configured**: Set `LOCALHOST_PRIVATE_KEY` to one of the development private keys printed by the currently running `npx hardhat node` process.
- **Connection refused / cannot connect**: Check that Terminal 1 still has `npx hardhat node` running.
- **Contract call fails or address has no code**: The address may belong to an earlier node session. Redeploy on the current node and update `.env`.
- **Script refuses Mainnet**: This guide uses `--network localhost`. Do not enable `ALLOW_MAINNET` for this workflow.
