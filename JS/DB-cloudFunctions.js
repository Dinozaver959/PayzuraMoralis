export var Moralis = require("moralis/node");

// ETH Server
//const serverUrl = "https://rbfqybjb4vga.usemoralis.com:2053/server";
//const appId = "FltzNNp8ebZsRkVnPTd6RKWTF2XoTLmVDMHSicVd";

// Matic Server 
const serverUrl = "https://gbmvbywfzibe.usemoralis.com:2053/server";
const appId = "6KNO1YxYUUp26EgElEHsfQ8ywPTJfs6D1C2H2yMR";
Moralis.start({ serverUrl, appId });

//-----------------------------------------------------------------------------------------------
//                             Functions for new /my-contracts page
//-----------------------------------------------------------------------------------------------


export async function GetUserContracts(UserWallet){
  const params =  { UserWallet : UserWallet };
  return Moralis.Cloud.run("GetUserContracts", params);
}

export async function GetContractsOffered(UserWallet){
  const params =  { UserWallet : UserWallet };
  return Moralis.Cloud.run("GetContractsOffered", params);
}

export async function GetContractsToValidate(UserWallet){
  const params =  { UserWallet : UserWallet };
  return Moralis.Cloud.run("GetContractsToValidate", params);
}



//-----------------------------------------------------------------------------------------------
//                                  Contract created by Seller
//-----------------------------------------------------------------------------------------------


export async function GetPublicOffers(){
    return Moralis.Cloud.run("GetPublicOffers");
}

export async function GetPersonalizedOffers(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetPersonalizedOffers", params);
}



//-----------------------------------------------------------------------------------------------
//                                  Contract created by Buyer
//-----------------------------------------------------------------------------------------------


export async function GetPublicOffers_CreatedByBuyer_await_seller_accepts_ALL(){
    return Moralis.Cloud.run("GetPublicOffers_CreatedByBuyer_await_seller_accepts_ALL");
}

export async function GetPublicOffers_CreatedByBuyer_await_seller_accepts(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetPublicOffers_CreatedByBuyer_await_seller_accepts", params);
}

export async function GetPublicOffers_CreatedByBuyer_buyer_initialized(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetPublicOffers_CreatedByBuyer_buyer_initialized", params);
}


export async function GetPublicOffers_CreatedByBuyer_buyer_initialized_and_paid(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetPublicOffers_CreatedByBuyer_buyer_initialized_and_paid", params);
}



//------------------------------------------------------------------------------------------------
//                    Later Stage of Contracts - Common for both initiators
//------------------------------------------------------------------------------------------------


export async function GetDisputesToManage(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetDisputesToManage", params);
}

export async function GetUsersAgreements(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetUsersAgreements", params);
}

export async function GetUsersAgreementsOnlyBuyer(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetUsersAgreementsOnlyBuyer", params);
}

export async function GetUsersAgreementsOnlySeller(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetUsersAgreementsOnlySeller", params);
}

export async function GetUsersDetails(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetUsersDetails", params);
}


export async function GetTotalNumberOfUsers(){ 
  return Moralis.Cloud.run("GetTotalNumberOfUsers"); 
}

export async function GetTotalNumberOfContracts(){ 
  return Moralis.Cloud.run("GetTotalNumberOfContracts"); 
}


// ------------------------------------------------------------------------------------------------
//                        Event Sync and Aggregated Data for Graphs          
// ------------------------------------------------------------------------------------------------
export async function GetAllAggregateData(){ 
    return Moralis.Cloud.run("getAllAggregateData"); 
}

export async function AggregateData(){ 
  await Moralis.Cloud.run("aggregateData");
}

//
//
//

export async function GetMyNotifications(UserWallet){
  const params =  { UserWallet : UserWallet };
  return Moralis.Cloud.run("GetMyNotifications", params);
}
export async function GetMyNotificationUnreadCount(UserWallet){
  const params =  { UserWallet : UserWallet };
  return Moralis.Cloud.run("GetMyNotificationUnreadCount", params);
}

export async function GetAgreementsTitle(objectId){
  const params =  { objectId : objectId };
  return Moralis.Cloud.run("GetAgreementsTitle", params);
}