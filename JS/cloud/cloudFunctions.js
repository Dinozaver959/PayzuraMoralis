
//-----------------------------------------------------------------------------------------------
//             Functions for JobZura / job marketplace (separate project for now)
//-----------------------------------------------------------------------------------------------

Moralis.Cloud.define("GetUserGigs", async (request) => {
  const query = new Moralis.Query("Gigs");
  query.equalTo("BuyerWallet", request.params.UserWallet);
  return await query.find();
});

Moralis.Cloud.define("GetAllGigs", async (request) => {
  const query = new Moralis.Query("Gigs");
  return await query.find();
});




//-----------------------------------------------------------------------------------------------
//                             Functions for new /my-contracts page
//-----------------------------------------------------------------------------------------------

Moralis.Cloud.define("GetUserContracts", async (request) => {

  const querySeller = new Moralis.Query("Agreements");
  querySeller.equalTo("SellerWallet", request.params.UserWallet);

  const queryBuyer = new Moralis.Query("Agreements");
  queryBuyer.equalTo("BuyerWallet", request.params.UserWallet);

  const mainQuery = Moralis.Query.or(querySeller, queryBuyer);

  return await mainQuery.find();
});


Moralis.Cloud.define("GetContractsOffered", async (request) => {    
 
  const query1 = new Moralis.Query("Agreements"); 
  query1.equalTo("State", "Available");
  query1.contains("PersonalizedOffer", request.params.UserWallet);
  
  const query2 = new Moralis.Query("Agreements");    
  query2.equalTo("State", "buyer_initialized_and_paid"); 
  query2.contains("PersonalizedOffer", request.params.UserWallet);
  
  const mainQuery = Moralis.Query.or(query1, query2);
  return await mainQuery.find();  
});


Moralis.Cloud.define("GetContractsToValidate", async (request) => {    
 
  const query1 = new Moralis.Query("Agreements"); 
  query1.equalTo("State", "dispute"); 
  
  const query2 = new Moralis.Query("Agreements");    
  query2.equalTo("State", "disputeSolved"); 
  
  const mainQuery = Moralis.Query.or(query1, query2);
  mainQuery.contains("Arbiters", request.params.UserWallet);
  return await mainQuery.find();  
});




//-----------------------------------------------------------------------------------------------
//                                  Contract created by Seller
//-----------------------------------------------------------------------------------------------

Moralis.Cloud.define("GetPublicOffers", async (request) => {            //  need to differentiate between Contract created by Buyer and Contract created by Seller 
  const query = new Moralis.Query("Agreements");    
  query.equalTo("State", "Available");
  query.equalTo("PersonalizedOffer", "");
  return await query.find();                  
});


Moralis.Cloud.define("GetPersonalizedOffers", async (request) => {      //  need to differentiate between Contract created by Buyer and Contract created by Seller
  const query = new Moralis.Query("Agreements");    
  query.equalTo("State", "Available");
  query.contains("PersonalizedOffer", request.params.UserWallet);
  return await query.find();                  
});




//-----------------------------------------------------------------------------------------------
//                                  Contract created by Buyer
//-----------------------------------------------------------------------------------------------

Moralis.Cloud.define("GetPublicOffers_CreatedByBuyer_await_seller_accepts_ALL", async (request) => {            
  const query = new Moralis.Query("Agreements");    
  query.equalTo("State", "await_seller_accepts");                       // possible states on smart contract level:
                                                                        // buyer_initialized, buyer_initialized_and_paid, await_seller_accepts
  //query.equalTo("PersonalizedOffer", "");   // ?
  return await query.find();                  
});

Moralis.Cloud.define("GetPublicOffers_CreatedByBuyer_await_seller_accepts", async (request) => {            
  const query = new Moralis.Query("Agreements");    
  query.equalTo("State", "await_seller_accepts");
  query.equalTo("BuyerWallet", request.params.UserWallet);
  return await query.find();                  
});

Moralis.Cloud.define("GetPublicOffers_CreatedByBuyer_buyer_initialized", async (request) => {            
  const query = new Moralis.Query("Agreements");    
  query.equalTo("State", "buyer_initialized");
  query.equalTo("BuyerWallet", request.params.UserWallet);
  return await query.find();                  
});

Moralis.Cloud.define("GetPublicOffers_CreatedByBuyer_buyer_initialized_and_paid", async (request) => {            
  const query = new Moralis.Query("Agreements");    
  query.equalTo("State", "buyer_initialized_and_paid");
  query.equalTo("BuyerWallet", request.params.UserWallet);
  return await query.find();                  
});




//------------------------------------------------------------------------------------------------
//                    Later Stage of Contracts - Common for both initiators
//------------------------------------------------------------------------------------------------


Moralis.Cloud.define("GetDisputesToManage", async (request) => {    
 
  const query1 = new Moralis.Query("Agreements"); 
  query1.equalTo("State", "dispute"); 
  
  const query2 = new Moralis.Query("Agreements");    
  query2.equalTo("State", "disputeSolved"); 
  
  const mainQuery = Moralis.Query.or(query1, query2);
  mainQuery.contains("Arbiters", request.params.UserWallet);
  return await mainQuery.find();  
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

  const querySeller = new Moralis.Query("UserParticipationData");
  querySeller.equalTo("userAddress", request.params.UserWallet);

  return await querySeller.find();
});

//------------------------------------------------------------------------------------------------
//                                    Get all Messages
//------------------------------------------------------------------------------------------------


Moralis.Cloud.define("getAllMessages", async (request) => {
  
  const query = new Moralis.Query("Messages");
  const result = await query.find();

  const userQuery = new Moralis.Query(Moralis.User);
  const userResult = await userQuery.find({ userMasterKey : true });

  const messages = result.map((data) => {
    return userResult.map((res) => {
      if (data.attributes.userId === res.id) {
        return {
          data,
          userId: res.id,
          userName: res.attributes.userName,
          ethAddress: res.attributes.ethAddress,
        };
      }
    }).filter(n => n);
  });
  
});



// to update the file run 
// moralis-admin-cli watch-cloud-folder --moralisApiKey NJb8ptNvFULrAUZ --moralisApiSecret Lk8NN6ShmEEoLx0 --mo...main rbfqybjb4vga.usemoralis.com --autoSave 1 --moralisCloudfolder D:\Test\Payzura\payzura\JS\cloud