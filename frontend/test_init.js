import { SorobanRpc, Operation, nativeToScVal, TransactionBuilder, Networks, TimeoutInfinite } from "@stellar/stellar-sdk";

async function main() {
    const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org");
    const accountId = "GBSDMBQCO3Q73LABJKLHVARIBKESOXBATZ5UTMJE6PMQ6NX4CQPNBM";
    const contractId = "CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE";
    const tokenId = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

    console.log("Simulating init...");
    
    // Create a dummy account object for simulation
    const account = new Account(accountId, "1");

    const op = Operation.invokeContractFunction({
        contract: contractId,
        function: "init",
        args: [
            nativeToScVal(tokenId, { type: "address" }),
        ],
    });

    const tx = new TransactionBuilder(account, { fee: "2000", networkPassphrase: Networks.TESTNET })
        .addOperation(op)
        .setTimeout(TimeoutInfinite)
        .build();

    try {
        const sim = await server.simulateTransaction(tx);
        console.log("Simulation Result:");
        console.log(JSON.stringify(sim, null, 2));
    } catch (e) {
        console.error("Error simulating:", e);
    }
}
main();
