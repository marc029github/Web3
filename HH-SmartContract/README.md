# Web3 Examples

This is my evolving Web3 and smart-contract development project. It uses Hardhat 3, Solidity, ethers.js, Mocha, and TypeScript to explore contract development, testing, deployment, and transaction inspection.

## What’s in the project

- `contracts/Counter.sol` — a sample contract with two counters: `x` (updated by `inc()` and `incBy()`) and `count` (updated by `incrementTotal()` and `decrement()`). The `Increment` event is emitted by the `x` increment functions.
- `contracts/Counter.t.sol` — Solidity unit tests.
- `test/Counter.ts` — Mocha/ethers tests, including checks for the `Increment` event.
- `scripts/deploy.js` — deploys `Counter` to the selected Hardhat network.
- `scripts/interact.js` — sends `incrementTotal()` and `decrement()` transactions, then reports transactions found in the scanned blocks.
- `ignition/modules/Counter.ts` — a Hardhat Ignition deployment module.
- `hardhat.config.ts` — Solidity compiler, plugin, simulated networks, localhost, and optional Sepolia configuration.

The codebase has been adapted and extended for this project; it is not the unmodified starter repository.

## Getting started

Install dependencies from the project root:

```bash
npm install
```

Build contracts and run tests:

```bash
npx hardhat build
npx hardhat test
```

To run one test layer at a time:

```bash
npx hardhat test solidity
npx hardhat test mocha
```

## Run locally

For the complete local workflow—including `.env` setup, starting the node, deploying `Counter`, and running the interaction/report script—see [HOW_TO_RUN.md](HOW_TO_RUN.md).

The local Hardhat node is temporary. Restarting it resets its chain, so deploy the contract again and update `COUNTER_ADDRESS` before using `scripts/interact.js`. Each run of that script sends two transactions; it is not a read-only report.

## Optional Sepolia network

The `sepolia` network is added to the Hardhat configuration only when `SEPOLIA_RPC_URL` is set. Set `SEPOLIA_PRIVATE_KEY` to a funded Sepolia development account if you intend to send transactions there. Keep these values in an untracked `.env` file, and never use a Mainnet wallet key for development.

This repository does not currently configure an Ethereum Mainnet network.

## Source acknowledgment

This project began with, and adapts examples/source code from, Vijay Krishnan, *The Essential Guide to Web3: Develop, deploy, and manage distributed applications on the Ethereum network*, p. 222 (Kindle edition). The repository has since been modified and extended as a personal learning project. Hardhat documentation: [Getting Started with Hardhat 3](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3).
