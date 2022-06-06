var Moralis = require("moralis/node");

const serverUrl = "https://shwkwtgzxazu.usemoralis.com:2053/server";
const appId = "2usVTlONkHgHkToWJNY6WEaWsklpD2PD5bjkhZ8T";
Moralis.start({ serverUrl, appId });


export async function GetAvailableProposals(){
    return Moralis.Cloud.run("GetAvailableProposals");
}


export async function GetUsersAgreements(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetUsersAgreements", params);
}



