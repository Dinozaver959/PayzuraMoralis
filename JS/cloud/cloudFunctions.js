
/*
Moralis.Cloud.define("GetPublicOffers", async (request) => {

  const pipeline = [
    { match: { State: "Available" } }, 
    { match: { PersonalizedOffer: "" } },
    { project: { 
      objectId : 1,
      OfferTitle : 1,
      OfferDescription: 1,
      hashDescription: 1,
      Price: 1,
      TimeToDeliver: 1,
      OfferValidUntil: 1,
      PersonalizedOffer : 1,
      Arbiters: 1,
      SellerWallet: 1,
      State: 1,
      index: 1
    }}
  ];
    
  const query = new Moralis.Query("Agreements");    
  return await query.aggregate(pipeline);
});
*/

Moralis.Cloud.define("GetPublicOffers", async (request) => {    
  const query = new Moralis.Query("Agreements");    
  query.equalTo("State", "Available");
  query.equalTo("PersonalizedOffer", "");
  return await query.find();                  
});


Moralis.Cloud.define("GetDisputesToManage", async (request) => {    
  /*
    const query = new Moralis.Query("Agreements");    
    //query.equalTo("State", "dispute"); // optional - should include the complited state as well
    query.fullText("Arbiters", request.params.UserWallet);
    return await query.find();     
  */
  
  const query1 = new Moralis.Query("Agreements");    
  query1.equalTo("State", "dispute"); 
  
  const query2 = new Moralis.Query("Agreements");    
  query2.equalTo("State", "complete"); 
  
  const mainQuery = Moralis.Query.or(query1, query2);
  //mainQuery.fullText("Arbiters", request.params.UserWallet);    // comment out for testing - no idea why it is causing problems
  return await mainQuery.find();  
});


Moralis.Cloud.define("GetPersonalizedOffers", async (request) => {    
  const query = new Moralis.Query("Agreements");    
  query.equalTo("State", "Available");
  query.fullText("PersonalizedOffer", request.params.UserWallet);
  return await query.find();                  
});




Moralis.Cloud.define("GetUsersAgreements", async (request) => {

  const querySeller = new Moralis.Query("Agreements");
  querySeller.equalTo("SellerWallet", request.params.UserWallet);

  const queryBuyer = new Moralis.Query("Agreements");
  queryBuyer.equalTo("BuyerWallet", request.params.UserWallet);

  const mainQuery = Moralis.Query.or(querySeller, queryBuyer);

  return await mainQuery.find();
});


Moralis.Cloud.define("GetUsersAgreementsOnlyBuyer", async (request) => {

  const queryBuyer = new Moralis.Query("Agreements");
  queryBuyer.equalTo("BuyerWallet", request.params.UserWallet);

  return await queryBuyer.find();
});


Moralis.Cloud.define("GetUsersAgreementsOnlySeller", async (request) => {

  const querySeller = new Moralis.Query("Agreements");
  querySeller.equalTo("SellerWallet", request.params.UserWallet);

  return await querySeller.find();
});


Moralis.Cloud.define("GetUsersDetails", async (request) => {

  const querySeller = new Moralis.Query("DisputeMeter");
  querySeller.equalTo("userAddress", request.params.UserWallet);

  return await querySeller.find();
});




// to update the file run 
// moralis-admin-cli watch-cloud-folder --moralisApiKey DmJlMFi7bq6YsSn --moralisApiSecret 0e5r309G7jnsBsZ --moralisCloudfolder D:\Test\Payzura\payzura\JS\cloud