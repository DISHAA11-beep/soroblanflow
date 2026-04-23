import { SorobanRpc, Operation, nativeToScVal, TransactionBuilder, Networks, TimeoutInfinite, Account } from "@stellar/stellar-sdk";

async function main() {
    const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org");
    const accountId = "GBSDMBQCO3Q73LABJKLHVGRAIBKESOXBATZ5UTMJE6PMQ6N6X4CQPNBM";
    const NATIVE_XLM = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

    const account = new Account(accountId, "1");

    const op = Operation.invokeContractFunction({
        contract: NATIVE_XLM,
        function: "transfer",
        args: [
            nativeToScVal(accountId, { type: "address" }),
            nativeToScVal(accountId, { type: "address" }),
            nativeToScVal(500000000n, { type: "i128" }),
        ],
    });

    const tx = new TransactionBuilder(account, { fee: "2000", networkPassphrase: Networks.TESTNET })
        .addOperation(op)
        .setTimeout(TimeoutInfinite)
        .build();

    try {
        const sim = await server.simulateTransaction(tx);
        console.log(JSON.stringify(sim, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}
main();
