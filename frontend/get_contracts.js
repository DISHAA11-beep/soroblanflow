import { Horizon, xdr, StrKey } from '@stellar/stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const accountId = 'GBSDMBQCO3Q73LABJKLHVARIBKESOXBATZ5UTMJE6PMQ6NX4CQPNBM';

async function main() {
    try {
        console.log(`Fetching transactions for ${accountId}...`);
        const txs = await server.transactions().forAccount(accountId).order('desc').limit(50).call();
        
        const contractIds = new Set();
        
        for (const txRecord of txs.records) {
            try {
                const meta = xdr.TransactionMeta.fromXDR(txRecord.result_meta_xdr, 'base64');
                if (meta.switch().value === 3) { // v3
                    const v3 = meta.v3();
                    const opsMeta = v3.operations();
                    for (const opMeta of opsMeta) {
                        const changes = opMeta.changes();
                        for (const change of changes) {
                            let state;
                            if (change.switch().name === 'ledgerEntryState') {
                                state = change.state();
                            } else if (change.switch().name === 'ledgerEntryCreated') {
                                state = change.created();
                            } else if (change.switch().name === 'ledgerEntryUpdated') {
                                state = change.updated();
                            }
                            
                            if (state && state.data().switch().name === 'contractData') {
                                const contractData = state.data().contractData();
                                if (contractData.contract().switch().name === 'scAddressTypeContract') {
                                    const rawHash = contractData.contract().contractId();
                                    const contractId = StrKey.encodeContract(rawHash);
                                    contractIds.add(contractId);
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                // Ignore parsing errors for individual txs
            }
        }
        
        console.log("Found Contract IDs:");
        for (const id of contractIds) {
            console.log(id);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
main();
