import { network } from "hardhat";

async function reportExistingTransaction(hash, counter, provider, contractAddress) {
  const transaction = await provider.getTransaction(hash);
  const receipt = await provider.getTransactionReceipt(hash);

  if (!transaction || !receipt) {
    console.log(`Transaction ${hash}: details or receipt unavailable.`);
    return;
  }

  let call;
  if (transaction.to?.toLowerCase() === contractAddress.toLowerCase()) {
    try {
      call = counter.interface.parseTransaction({
        data: transaction.data,
        value: transaction.value,
      });
    } catch {
      // The calldata may not match the Counter ABI.
    }
  }

  const events = receipt.logs
    .filter((log) => log.address.toLowerCase() === contractAddress.toLowerCase())
    .map((log) => {
      try {
        const event = counter.interface.parseLog(log);
        return event
          ? {
              name: event.name,
              args: Array.from(event.args, (value) => value.toString()),
            }
          : null;
      } catch {
        return null;
      }
    })
    .filter((event) => event !== null);

  console.log("Transaction details:", {
    hash: transaction.hash,
    from: transaction.from,
    to: transaction.to ?? "contract creation",
    nonce: transaction.nonce,
    value: transaction.value.toString(),
    calldata: transaction.data,
    function: call?.name ?? "unknown / not a Counter call",
    args: call ? Array.from(call.args, (value) => value.toString()) : [],
    status: receipt.status,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    gasPrice: receipt.gasPrice.toString(),
    fee: (receipt.gasUsed * receipt.gasPrice).toString(),
    events: events.length > 0 ? events : "none",
  });
}

async function main() {
  const contractAddress = process.env.COUNTER_ADDRESS;

  if (!contractAddress) {
    throw new Error("Set COUNTER_ADDRESS to the deployed Counter address.");
  }

  const { ethers } = await network.create();
  const chain = await ethers.provider.getNetwork();

  if (chain.chainId === 1n && process.env.ALLOW_MAINNET !== "true") {
    throw new Error("Refusing to send transactions on Mainnet without ALLOW_MAINNET=true.");
  }

  const [signer] = await ethers.getSigners();
  if (!signer) {
    throw new Error("No signer is configured for this network; configure an account to send transactions.");
  }

  const counter = await ethers.getContractAt("Counter", contractAddress, signer);

  console.log("Network chain ID:", chain.chainId.toString());
  console.log("Interacting with Counter:", contractAddress);
  console.log("Count before transactions:", (await counter.getCount()).toString());

  console.log("Executing incrementTotal()...");
  const incrementTransaction = await counter.incrementTotal();
  const incrementReceipt = await incrementTransaction.wait();
  console.log("incrementTotal() mined:", {
    hash: incrementTransaction.hash,
    blockNumber: incrementReceipt.blockNumber,
  });

  console.log("Executing decrement()...");
  const decrementTransaction = await counter.decrement();
  const decrementReceipt = await decrementTransaction.wait();
  console.log("decrement() mined:", {
    hash: decrementTransaction.hash,
    blockNumber: decrementReceipt.blockNumber,
  });

  console.log("Count after transactions:", (await counter.getCount()).toString());

  const latestBlockNumber = await ethers.provider.getBlockNumber();
  const firstBlockNumber = chain.chainId === 31337n
    ? 0
    : Math.max(0, latestBlockNumber - 19);

  console.log(`Existing transactions in blocks ${firstBlockNumber} through ${latestBlockNumber}:`);
  for (let blockNumber = firstBlockNumber; blockNumber <= latestBlockNumber; blockNumber++) {
    const block = await ethers.provider.getBlock(blockNumber);
    if (!block) continue;

    console.log(`\nBlock ${block.number} (${block.hash})`);
    if (block.transactions.length === 0) {
      console.log("No transactions in this block.");
      continue;
    }

    for (const hash of block.transactions) {
      await reportExistingTransaction(hash, counter, ethers.provider, contractAddress);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});