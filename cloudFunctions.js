
Moralis.Cloud.define("GetAvailableProposals", async (request) => {

  const pipeline = [
    { match: { State: "Available" } },
    { project: { 
      objectId : 1,
      ProposalTitle : 1,
      ProposalDescription: 1,
      Price: 1,
      TimeAllowed: 1,
      SellerWallet: 1,
      hashDescription: 1,
      State: 1,
      index: 1
    }}
  ];
    
  const query = new Moralis.Query("Agreements");    
  return await query.aggregate(pipeline);
});



Moralis.Cloud.define("GetUsersAgreements", async (request) => {

  const querySeller = new Moralis.Query("Agreements");
  querySeller.equalTo("SellerWallet", request.params.UserWallet);

  const queryBuyer = new Moralis.Query("Agreements");
  queryBuyer.equalTo("BuyerWallet", request.params.UserWallet);

  const mainQuery = Moralis.Query.or(querySeller, queryBuyer);

  return await mainQuery.find();
});



