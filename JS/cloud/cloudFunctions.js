
//-----------------------------------------------------------------------------------------------
//             Functions for JobZura / job marketplace (separate project for now)
//-----------------------------------------------------------------------------------------------


Moralis.Cloud.define("GetMaxJobzuraAgreementID", async (request) => {

  const pipeline = [ 
    { project: { id_: 1 } },
    { sort : { id_: -1 } }
  ];

  const query = new Moralis.Query("Jobzura_Agreements");
  const res = await query.aggregate(pipeline);

  return res[0].id_;
});

Moralis.Cloud.define("GetMaxJobsID", async (request) => {

  const pipeline = [ 
    { project: { id_: 1 } },
    { sort : { id_: -1 } }
  ];

  const query = new Moralis.Query("Jobs");
  const res = await query.aggregate(pipeline);

  return res[0].id_;
});

Moralis.Cloud.define("GetTotalNumberOfJobs", async (request) => {
  const query = new Moralis.Query("Jobs");
  return (await query.find()).length;
});

Moralis.Cloud.define("GetAllJobs", async (request) => {
  const query = new Moralis.Query("Jobs");
  return await query.find();
});

Moralis.Cloud.define("GetUserJobs", async (request) => {
  const query = new Moralis.Query("Jobs");
  query.equalTo("Seller", request.params.UserWallet);
  return await query.find();
});

Moralis.Cloud.define("GetJob", async (request) => {
  const pipeline = [{ match: { id_: request.params.JobID } }];
  const query = new Moralis.Query("Jobs");
  return await query.aggregate(pipeline);  
});

Moralis.Cloud.define("GetContract", async (request) => {
  const pipeline = [{ match: { id_: request.params.ContractID } }];
  const query = new Moralis.Query("Jobzura_Agreements");
  return await query.aggregate(pipeline);  
});

Moralis.Cloud.define("GetReferralCode", async (request) => {
  const query = new Moralis.Query("ReferralCodes");
  query.equalTo("UserAddress", request.params.UserWallet);
  return (await query.find())[0].ReferralCodeUsed;
});

Moralis.Cloud.define("IsUserAlreadyInDB", async (request) => {
  const query = new Moralis.Query(request.params.Table);
  query.equalTo("UserAddress", request.params.UserWallet);
  const res = await query.find();
  return (res.length > 0) ? true : false;
});

Moralis.Cloud.define("GetReferredBy", async (request) => {
  const query = new Moralis.Query("ReferralCodes");
  query.equalTo("ReferralCodeGenerated", request.params.ReferralCodeUsed);

  const res = await query.find();
  if (res.length > 0) {
    return res[0].get("UserAddress");
  }
  return res;
});


Moralis.Cloud.define("GetReferralChain3", async (request) => {

  var referralChain = [];

  const q1 = new Moralis.Query("Referrals");
  q1.equalTo("UserAddress", request.params.UserWallet);

  const res = await q1.find();
  if (res.length > 0) {
    const ref = res[0].get("ReferredBy");
    
    if (ref.length > 0) { // some data - probably need a better check
      referralChain.push(ref);


      
      // do 2 more loops for lvl 2 and lvl 3 ...
      const q2 = new Moralis.Query("Referrals");
      q2.equalTo("UserAddress", ref);

      const res2 = await q2.find();
      if (res2.length > 0) {
        
        const ref2 = res2[0].get("ReferredBy");
        
        if (ref2.length > 0) { // some data - probably need a better check
          referralChain.push(ref2);


          
          // do loop for lvl 3 ...
          const q3 = new Moralis.Query("Referrals");
          q3.equalTo("UserAddress", ref2);
    
          const res3 = await q3.find();
          if (res3.length > 0) {
            
            const ref3 = res3[0].get("ReferredBy");
            
            if (ref3.length > 0) { // some data - probably need a better check
              referralChain.push(ref3);
            }
            
          }
        }
        
      }

    }
  }
  return referralChain;
});



//-----------------------------------------------------------------------------------------------
//                        JobZura - Front-Back end secure connection
//-----------------------------------------------------------------------------------------------


Moralis.Cloud.define("GetWalletFromAlias", async (request) => {
  const query = new Moralis.Query("Aliases");
  query.equalTo("Alias", request.params.Alias);

  const res = await query.find();
  return (res.length > 0) ? res[0].get("Address") : "";
});

Moralis.Cloud.define("DoesAliasBelongToWallet", async (request) => {
  const query = new Moralis.Query("Aliases");
  query.equalTo("Address", request.params.Address);
  query.equalTo("Alias", request.params.Alias);

  const res = await query.find();
  return (res.length > 0) ? true : false;
});


//-----------------------------------------------------------------------------------------------
//                                     JobZura - reviews
//-----------------------------------------------------------------------------------------------


Moralis.Cloud.define("GetMaxReviewsID", async (request) => {
  // create a pipeline to get the max id and check if the id_ is defined (not null)
  const pipeline = [
    { project: { id_: 1 } },
    { sort : { id_: -1 } }
  ];

  const query = new Moralis.Query("Ratings");
  const res = await query.aggregate(pipeline);

  return res[0].id_;
});

Moralis.Cloud.define("GetTotalNumberOfReviews", async (request) => {
  const query = new Moralis.Query("Ratings");
  return (await query.find()).length;
});

Moralis.Cloud.define("GetAllReviews", async (request) => {
  const query = new Moralis.Query("Ratings");
  return await query.find();
});

Moralis.Cloud.define("GetUserReviews", async (request) => {
  const query = new Moralis.Query("Ratings");
  query.equalTo("JobSeller", request.params.UserWallet);
  return await query.find();
});

Moralis.Cloud.define("GetReview", async (request) => {
  const pipeline = [{ match: { id_: request.params.ReviewID } }];
  const query = new Moralis.Query("Ratings");
  return await query.aggregate(pipeline);
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



Moralis.Cloud.define("GetUserMessages", async (request) => {
  const pipeline = [{ match: { sender: request.params.messageSender, receiver: request.params.messageReceiver } }];
  const query = new Moralis.Query("Messages");
  return await query.aggregate(pipeline);  
});


Moralis.Cloud.define("GetUserMessagesPair", async (request) => {

  const q1 = new Moralis.Query("Messages");
  q1.equalTo("sender", request.params.messageSender);
  q1.equalTo("receiver", request.params.messageReceiver);

  const q2 = new Moralis.Query("Messages");
  q2.equalTo("receiver", request.params.messageSender);
  q2.equalTo("sender", request.params.messageReceiver);
  
  const mainQuery = Moralis.Query.or(q1, q2);
  return await mainQuery.find();
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

  const query = new Moralis.Query("UserParticipationData");
  query.equalTo("userAddress", request.params.UserWallet);

  return await query.find();
});

Moralis.Cloud.define("GetTotalNumberOfUsers", async (request) => {
  const query = new Moralis.Query("UserParticipationData");
  return (await query.find()).length;
});

Moralis.Cloud.define("GetTotalNumberOfContracts", async (request) => {
  const query1 = new Moralis.Query("OfferAcceptedBuyer");
  const query2 = new Moralis.Query("OfferAcceptedSeller");

  return ((await query1.find()).length + (await query2.find()).length);
});


//-----------------------------------------------------------------------------------------------
//                                Getter and setter functions
//-----------------------------------------------------------------------------------------------

// not sure we need this...
Moralis.Cloud.define("getAllOffersCreated", async (request) => {
  const query = new Moralis.Query("OfferCreatedSeller");
  return await query.find();
});


Moralis.Cloud.define("getAllAggregateData", async (request) => {
  const query = new Moralis.Query("AggregatedEvents");
  query.ascending("block_day");
  return await query.find();
});



//-----------------------------------------------------------------------------------------------
//                                  Aggregate EventSync data
//-----------------------------------------------------------------------------------------------

Moralis.Cloud.define("aggregateData", async (request) => {

  // working double group identifier
  const pipeline1 = 
  [
    { project: { block_day: 1, tokenCurrency: 1, price:1, buyer: 1 } },
    { group: { objectId: { block_day : "$block_day", tokenCurrency : "$tokenCurrency" }, total: { $sum: {$toLong : '$price'} } } }  ///    block_day : "$block_day"         buyer : "$buyer"
  ];

  // working correctly, will count the number of offers for each day                  
  const pipeline2 = 
  [
    { project: { block_day: 1 } },
    { group: { objectId: "$block_day" , total : {$sum : 1} }}
  ];

  const pipeline_1a = JSON.parse(JSON.stringify(pipeline1));
  const pipeline_1b = JSON.parse(JSON.stringify(pipeline1));
  const pipeline_1c = JSON.parse(JSON.stringify(pipeline1));
  const pipeline_1d = JSON.parse(JSON.stringify(pipeline1));
  const pipeline_1e = JSON.parse(JSON.stringify(pipeline1));
  const pipeline_1f = JSON.parse(JSON.stringify(pipeline1));
  const pipeline_2a = JSON.parse(JSON.stringify(pipeline2));
  const pipeline_2b = JSON.parse(JSON.stringify(pipeline2));
  const pipeline_2c = JSON.parse(JSON.stringify(pipeline2));
  const pipeline_2d = JSON.parse(JSON.stringify(pipeline2));
  const pipeline_2e = JSON.parse(JSON.stringify(pipeline2));


  // PIPELINE1 - calculating the value ETH/USDC of events

  // for the value in contracts.... need to sum together the values from Buyer and Seller side
  const query_OfferAcceptedBuyerValue = new Moralis.Query("OfferAcceptedBuyer");
  const pipeline_OfferAcceptedBuyerValue = await query_OfferAcceptedBuyerValue.aggregate(pipeline_1a);
  const params_OfferAcceptedBuyerValue =  { "data" : pipeline_OfferAcceptedBuyerValue, "column": "valueBuyerAccepted"};           //  valueBuyer -> valueBuyerAccepted
  await Moralis.Cloud.run("UpdateAggregateDataTableValue", params_OfferAcceptedBuyerValue);

  // for the value in contracts.... need to sum together the values from Buyer and Seller side
  const query_OfferAcceptedSellerValue = new Moralis.Query("OfferAcceptedSeller");
  const pipeline_OfferAcceptedSellerValue = await query_OfferAcceptedSellerValue.aggregate(pipeline_1b);
  const params_OfferAcceptedSellerValue =  { "data" : pipeline_OfferAcceptedSellerValue, "column": "valueSellerAccepted"};        //  valueSeller -> valueSellerAccepted
  await Moralis.Cloud.run("UpdateAggregateDataTableValue", params_OfferAcceptedSellerValue);


  // DeliveryConfirmed
  const query_DeliveryConfirmedValue = new Moralis.Query("DeliveryConfirmed");
  const pipeline_DeliveryConfirmedValue = await query_DeliveryConfirmedValue.aggregate(pipeline_1c);
  const params_DeliveryConfirmedValue =  { "data" : pipeline_DeliveryConfirmedValue, "column": "valueDeliveryConfirmed"};
  await Moralis.Cloud.run("UpdateAggregateDataTableValue", params_DeliveryConfirmedValue);

  // FundsClaimed
  const query_FundsClaimedValue = new Moralis.Query("FundsClaimed");
  const pipeline_FundsClaimedValue = await query_FundsClaimedValue.aggregate(pipeline_1d);
  const params_FundsClaimedValue =  { "data" : pipeline_FundsClaimedValue, "column": "valueFundsClaimed"};
  await Moralis.Cloud.run("UpdateAggregateDataTableValue", params_FundsClaimedValue);

  // PaymentReturned
  const query_PaymentReturnedValue = new Moralis.Query("PaymentReturned");
  const pipeline_PaymentReturnedValue = await query_PaymentReturnedValue.aggregate(pipeline_1e);
  const params_PaymentReturnedValue =  { "data" : pipeline_PaymentReturnedValue, "column": "valuePaymentReturned"};
  await Moralis.Cloud.run("UpdateAggregateDataTableValue", params_PaymentReturnedValue);

  // DisputeClosed
  const query_DisputeClosedValue = new Moralis.Query("DisputeClosed");
  const pipeline_DisputeClosedValue = await query_DisputeClosedValue.aggregate(pipeline_1f);
  const params_DisputeClosedValue =  { "data" : pipeline_DisputeClosedValue, "column": "valueDisputeClosed"};
  await Moralis.Cloud.run("UpdateAggregateDataTableValue", params_DisputeClosedValue);





  // PIPELINE2 - just counting the number of events

  // OfferAcceptedBuyer
  const query_OfferAcceptedBuyer = new Moralis.Query("OfferAcceptedBuyer");
  const pipeline_OfferAcceptedBuyer = await query_OfferAcceptedBuyer.aggregate(pipeline_2a);
  const params_OfferAcceptedBuyer =  { "data" : pipeline_OfferAcceptedBuyer, "column": "OfferAcceptedBuyer" };
  await Moralis.Cloud.run("UpdateAggregateDataTable", params_OfferAcceptedBuyer);

  // OfferAcceptedSeller
  const query_OfferAcceptedSeller = new Moralis.Query("OfferAcceptedSeller");
  const pipeline_OfferAcceptedSeller = await query_OfferAcceptedSeller.aggregate(pipeline_2b);
  const params_OfferAcceptedSeller =  { "data" : pipeline_OfferAcceptedSeller, "column": "OfferAcceptedSeller" };
  await Moralis.Cloud.run("UpdateAggregateDataTable", params_OfferAcceptedSeller);

  // DisputeStarted
  const query_DisputeStarted = new Moralis.Query("DisputeStarted");
  const pipeline_DisputeStarted = await query_DisputeStarted.aggregate(pipeline_2c);
  const params_DisputeStarted =  { "data" : pipeline_DisputeStarted, "column": "DisputeStarted" };
  await Moralis.Cloud.run("UpdateAggregateDataTable", params_DisputeStarted);

  // DisputeClosed
  const query_DisputeClosed = new Moralis.Query("DisputeClosed");
  const pipeline_DisputeClosed = await query_DisputeClosed.aggregate(pipeline_2d);
  const params_DisputeClosed =  { "data" : pipeline_DisputeClosed, "column": "DisputeClosed" };
  await Moralis.Cloud.run("UpdateAggregateDataTable", params_DisputeClosed);

  // FundsClaimed
  const query_FundsClaimed = new Moralis.Query("FundsClaimed");
  const pipeline_FundsClaimed = await query_FundsClaimed.aggregate(pipeline_2e);
  const params_FundsClaimed =  { "data" : pipeline_FundsClaimed, "column": "FundsClaimed" };
  await Moralis.Cloud.run("UpdateAggregateDataTable", params_FundsClaimed);


  //return pipeline_OfferAcceptedBuyer;
  //return await query_OfferAcceptedBuyer.find();
 
  return "Tables updated"

});


// works well for counts (for value/currency we will need a different function)
Moralis.Cloud.define("UpdateAggregateDataTable", async (request) => {

  const json_pipeline2 = request.params.data;
  const column = request.params.column;

  for(let i = 0; i < json_pipeline2.length; i++){
    const block_day = json_pipeline2[i].objectId;
    var val = json_pipeline2[i].total;

    const AggregatedEvents = Moralis.Object.extend("AggregatedEvents");
    const query1 = new Moralis.Query(AggregatedEvents);
    query1.equalTo("block_day", block_day);
    const results1 = await query1.find();

    if (results1.length > 0) {
      const day = results1[0];
      day.set(column, val);

      await day.save()
      .then((day) => {
        console.log(`table updated, with objectId: ${day.id}`);
      }, (error) => {
        console.log(`Failed to update table, with error code: ${error.message}`);
      });
    
    } else {
      const day = new AggregatedEvents();
      day.set("block_day", block_day);
      day.set(column, val);

      await day.save()
      .then((day) => {
        console.log(`table updated, with objectId: ${day.id}`);
      }, (error) => {
        console.log(`Failed to update table, with error code: ${day.message}`);
      });
    } 
  }
});

// updates the value/tokenCurrency
Moralis.Cloud.define("UpdateAggregateDataTableValue", async (request) => {

  const json_pipeline2 = request.params.data;
  const column = request.params.column;

  for(let i = 0; i < json_pipeline2.length; i++){
    const block_day = json_pipeline2[i].objectId.block_day;
    const tokenCurrency = json_pipeline2[i].objectId.tokenCurrency;
    var val = json_pipeline2[i].total;

    const AggregatedEvents = Moralis.Object.extend("AggregatedEvents");
    const query1 = new Moralis.Query(AggregatedEvents);
    query1.equalTo("block_day", block_day);
    const results1 = await query1.find();

    if (results1.length > 0) {
      const day = results1[0];
      day.set(column + "_" + tokenCurrency, val);

      await day.save()
      .then((day) => {
        console.log(`table updated, with objectId: ${day.id}`);
      }, (error) => {
        console.log(`Failed to update table, with error code: ${error.message}`);
      });
    
    } else {
      const day = new AggregatedEvents();
      day.set("block_day", block_day);
      day.set(column + "_" + tokenCurrency, val);

      await day.save()
      .then((day) => {
        console.log(`table updated, with objectId: ${day.id}`);
      }, (error) => {
        console.log(`Failed to update table, with error code: ${error.message}`);
      });
    } 
  }
});



//-----------------------------------------------------------------------------------------------
//                             Functions for the EventSync tables
//-----------------------------------------------------------------------------------------------
// time_[0] - Sat
// time_[1] - Aug
// time_[2] - 8
// time_[3] - 2022

Moralis.Cloud.define("MonthToNum", (request) => {

  const month = request.params.month;
  switch(month) {
    case "Jan":
      return 1;
    case "Feb":
      return 2;
    case "Mar":
      return 3;
    case "Apr":
      return 4;
    case "May":
      return 5;
    case "Jun":
      return 6;
    case "Jul":
      return 7;
    case "Aug":
      return 8;
    case "Sep":
      return 9;
    case "Oct":
      return 10;
    case "Nov":
      return 11;
    case "Dec":
      return 12;              
    default:
      return 1;
  }
});


// beforeSave only works for contracts created after the table (not for historic contracts)
// need to create a function like this for every event where we want to convert block_timestamp to days
Moralis.Cloud.beforeSave("OfferCreatedBuyer", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("OfferCreatedSeller", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("OfferAcceptedBuyer", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("OfferAcceptedSeller", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("DisputeStarted", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("DeliveryConfirmed", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("FundsClaimed", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("PaymentReturned", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("DisputeVoted", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("DisputeClosed", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("ContractCanceled", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});


// can run before save on each column to check if the value is not null/undefined, otherwise set it to 0 (as default value)
Moralis.Cloud.beforeSave("AggregatedEvents", async (request) => {

  const arrayOfColumnsToSetDefaultValues = [
    "OfferAcceptedBuyer", 
    "OfferAcceptedSeller", 
    "DisputeStarted", 
    "DisputeClosed", 
    "valueSellerAccepted_0x0000000000000000000000000000000000000000",
    "valueSellerAccepted_0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    "valueBuyerAccepted_0x0000000000000000000000000000000000000000",
    "valueBuyerAccepted_0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    "valueDeliveryConfirmed_0x0000000000000000000000000000000000000000",
    "valueDeliveryConfirmed_0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    "valueFundsClaimed_0x0000000000000000000000000000000000000000",
    "valueFundsClaimed_0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    "valuePaymentReturned_0x0000000000000000000000000000000000000000",
    "valuePaymentReturned_0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    "valueDisputeClosed_0x0000000000000000000000000000000000000000",
    "valueDisputeClosed_0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
  ];

  for (let i = 0; i < arrayOfColumnsToSetDefaultValues.length; i++){
    if(request.object.get(arrayOfColumnsToSetDefaultValues[i]) == undefined){
      request.object.set(arrayOfColumnsToSetDefaultValues[i], 0)
    }
  }
  
  return request.object
});


//------------------------------------------------------------------------------------------------
//                                    Notifications
//------------------------------------------------------------------------------------------------


Moralis.Cloud.define("GetMyNotifications", async (request) => {
  const query = new Moralis.Query("Notifications");
  query.equalTo("Wallet", request.params.UserWallet);
  query.descending("updatedAt")
  
  return await query.find();
});

Moralis.Cloud.define("GetMyNotificationUnreadCount", async (request) => {
  const query = new Moralis.Query("Notifications");
  query.equalTo("Wallet", request.params.UserWallet);
  query.equalTo("Read", 0);
  const result = await query.find();
  return result.length
});


Moralis.Cloud.define("GetAgreementsTitle", async (request) => {
  const query = new Moralis.Query("Agreements");
  query.equalTo("objectId", request.params.objectId);
  return await query.first();
});

//------------------------------------------------------------------------------------------------


// to update the file run 
// moralis-admin-cli watch-cloud-folder --moralisApiKey NJb8ptNvFULrAUZ --moralisApiSecret Lk8NN6ShmEEoLx0 --moralisSubdomain gbmvbywfzibe.usemoralis.com --autoSave 1 --moralisCloudfolder D:\Test\Payzura\payzura\JS\cloud

// for Jules
// moralis-admin-cli watch-cloud-folder --moralisApiKey NJb8ptNvFULrAUZ --moralisApiSecret Lk8NN6ShmEEoLx0 --moralisSubdomain gbmvbywfzibe.usemoralis.com --autoSave 1 --moralisCloudfolder ./JS/cloud