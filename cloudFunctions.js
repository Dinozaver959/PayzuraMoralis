
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
      SellerWallet: 1,
      State: 1,
      index: 1
    }}
  ];
    
  const query = new Moralis.Query("Agreements");    
  return await query.aggregate(pipeline);
});

Moralis.Cloud.define("GetPersonalizedOffers", async (request) => {    
  const query = new Moralis.Query("Agreements");    
  query.equalTo("State", "Available");
  query.fullText("PersonalizedOffer", request.params.UserWallet)
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



