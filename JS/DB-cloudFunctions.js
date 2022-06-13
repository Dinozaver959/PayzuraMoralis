var Moralis = require("moralis/node");

const serverUrl = "https://fordrbswdskl.usemoralis.com:2053/server";
const appId = "8AGWP86FEWcfCRwNLa0LGffGPs5kpcHxqRpEp4PF";
Moralis.start({ serverUrl, appId });


export async function GetPublicOffers(){
    return Moralis.Cloud.run("GetPublicOffers");
}

export async function GetPersonalizedOffers(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetPersonalizedOffers", params);
}


export async function GetUsersAgreements(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetUsersAgreements", params);
}



