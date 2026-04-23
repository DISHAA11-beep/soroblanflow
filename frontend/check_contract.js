import { SorobanRpc } from "@stellar/stellar-sdk";

async function main() {
    const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org");
    const contractId = "CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE";
    
    // We want to check if the contract has "TOKEN_ID" or "token" in its instance storage.
    try {
        const ledgerEntries = await server.getLedgerEntries(
            SorobanRpc.LedgerKey.contractData(
                SorobanRpc.Address.fromString(contractId).toScAddress(),
            )
        );
        console.log(JSON.stringify(ledgerEntries, null, 2));
    } catch (e) {
        console.error(e);
    }
}
main();
