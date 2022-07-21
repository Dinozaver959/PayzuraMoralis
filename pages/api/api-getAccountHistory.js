import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import { ethers } from "ethers";
import {ParsePathGiveUserWallet} from "../../JS/BackendFunctions";

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
    console.log(req.body)
 
    const UserWallet = ParsePathGiveUserWallet(req.url);
    if(UserWallet == -1){res.end()}

    console.log("UserWallet: " + UserWallet);

    await GetHistory(UserWallet.toLowerCase());

    res.end(JSON.stringify([], null, 3));
})

export const config = {
    api: {
      bodyParser: false
    }
} 
export default apiRoute



async function GetHistory(address){

    //console.log("inside GetHistory, address: " + address);

    const provider = new ethers.providers.EtherscanProvider('homestead', "4P25TGYM4CBH6AKZAUK98ZEXKH9RAYHCKC");

    const currentBlock= await provider.getBlockNumber()
    const blockTime = 15; // ETH block time is 15 seconds

    //Block number 2 hours, 24 hours and 48 hours ago
    const block2 = currentBlock - (2 * 60 * 60 / blockTime);
    const block24 = currentBlock - (24 * 60 * 60 / blockTime);
    const block48 = currentBlock - (48 * 60 * 60 / blockTime);
    const block10d = currentBlock - (10 * 24 * 60 * 60 / blockTime);
    const block20d = currentBlock - (20 * 24 * 60 * 60 / blockTime);

    var history;

    // Get all txs for address since 2 hours ago
    //history = await provider.getHistory(address);
    //console.log("history 0:", history);

    history = await provider.getHistory(address, null, currentBlock);
    console.log("history 0:", history[0]);

    const zeroTransaction = history[0].timestamp; // first Tx of an account
    console.log(`zeroTransaction: ${zeroTransaction}`);

    const lastTransaction = history[history.length - 1].timestamp; // last Tx
    console.log(`lastTransaction: ${lastTransaction}`);

    const currentEpoch = Math.round(new Date().getTime() / 1000) 
    console.log(currentEpoch);

    const sinceFirstTx = currentEpoch - zeroTransaction;
    const sinceLastTx = currentEpoch - lastTransaction;
    const TenDays = 10 * 24 * 60 * 60;

    console.log(`Total number of tractions by account: ${history.length}`)

    if(sinceFirstTx > TenDays) {
        console.log("first Tx is older than 10 days");
    }

    if(sinceLastTx > TenDays) {
        console.log("last Tx is older than 10 days");
    }


    // If you got nothing back (i.e no txns), try 24 hours and then 48 hours
    //(history.length === 0 ? history = await provider.getHistory(address, block24, currentBlock) : null);
    //console.log("history 2:", history);
}
