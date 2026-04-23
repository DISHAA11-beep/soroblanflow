import * as StellarSdk from "@stellar/stellar-sdk";

async function main() {
    const horizon = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
    const kp = StellarSdk.Keypair.random();
    console.log("Created random pair", kp.publicKey());

    // Friendbot
    try {
        await fetch(`https://friendbot.stellar.org?addr=${kp.publicKey()}`);
        console.log("Friendbot funded");
        
        const account = await horizon.loadAccount(kp.publicKey());
        const tx = new StellarSdk.TransactionBuilder(account, {
            fee: "100",
            networkPassphrase: StellarSdk.Networks.TESTNET,
        })
        .addOperation(StellarSdk.Operation.payment({
            destination: kp.publicKey(),
            asset: StellarSdk.Asset.native(),
            amount: "1.0"
        }))
        .setTimeout(StellarSdk.TimeoutInfinite)
        .build();

        tx.sign(kp);

        const xdr = tx.toXDR();
        console.log("Submitting transaction...");
        
        try {
            const submission = await horizon.submitTransaction(StellarSdk.TransactionBuilder.fromXDR(xdr, StellarSdk.Networks.TESTNET));
            console.log("Success:", submission.successful);
        } catch (e) {
            console.error("Submission failed!", e);
        }
    } catch(e) {
        console.error(e);
    }
}
main();
