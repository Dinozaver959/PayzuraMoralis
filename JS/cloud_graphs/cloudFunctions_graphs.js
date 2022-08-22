const logger = Moralis.Cloud.getLogger();


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
  const pipeline_2a = JSON.parse(JSON.stringify(pipeline2));
  const pipeline_2b = JSON.parse(JSON.stringify(pipeline2));
  const pipeline_2c = JSON.parse(JSON.stringify(pipeline2));
  const pipeline_2d = JSON.parse(JSON.stringify(pipeline2));
  const pipeline_2e = JSON.parse(JSON.stringify(pipeline2));


  // for the value in contracts.... need to sum together the values from Buyer and Seller side
  const query_OfferAcceptedBuyerValue = new Moralis.Query("OfferAcceptedBuyer");
  const pipeline_OfferAcceptedBuyerValue = await query_OfferAcceptedBuyerValue.aggregate(pipeline_1a);
  const params_OfferAcceptedBuyerValue =  { "data" : pipeline_OfferAcceptedBuyerValue, "column": "valueBuyer"};
  await Moralis.Cloud.run("UpdateAggregateDataTableValue", params_OfferAcceptedBuyerValue);

  // for the value in contracts.... need to sum together the values from Buyer and Seller side
  const query_OfferAcceptedSellerValue = new Moralis.Query("OfferAcceptedSeller");
  const pipeline_OfferAcceptedSellerValue = await query_OfferAcceptedSellerValue.aggregate(pipeline_1b);
  const params_OfferAcceptedSellerValue =  { "data" : pipeline_OfferAcceptedSellerValue, "column": "valueSeller"};
  await Moralis.Cloud.run("UpdateAggregateDataTableValue", params_OfferAcceptedSellerValue);
  
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
  //const day = time_[0] + ' ' + time_[1] + ' ' + time_[2] + ' ' + time_[3];    // time.toString()   ' at'
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
  //const day = time_[0] + ' ' + time_[1] + ' ' + time_[2] + ' ' + time_[3];    // time.toString()   ' at'
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("OfferAcceptedSeller", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  //const day = time_[0] + ' ' + time_[1] + ' ' + time_[2] + ' ' + time_[3];    // time.toString()   ' at'
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("DisputeStarted", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  //const day = time_[0] + ' ' + time_[1] + ' ' + time_[2] + ' ' + time_[3];    // time.toString()   ' at'
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("DeliveryConfirmed", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  //const day = time_[0] + ' ' + time_[1] + ' ' + time_[2] + ' ' + time_[3];    // time.toString()   ' at'
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("FundsClaimed", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  //const day = time_[0] + ' ' + time_[1] + ' ' + time_[2] + ' ' + time_[3];    // time.toString()   ' at'
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("PaymentReturned", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  //const day = time_[0] + ' ' + time_[1] + ' ' + time_[2] + ' ' + time_[3];    // time.toString()   ' at'
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("DisputeVoted", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  //const day = time_[0] + ' ' + time_[1] + ' ' + time_[2] + ' ' + time_[3];    // time.toString()   ' at'
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("DisputeClosed", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  //const day = time_[0] + ' ' + time_[1] + ' ' + time_[2] + ' ' + time_[3];    // time.toString()   ' at'
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});

Moralis.Cloud.beforeSave("ContractCanceled", async (request) => {

  const time = request.object.get("block_timestamp");
  const time_ = (time.toString()).split(" ");
  //const day = time_[0] + ' ' + time_[1] + ' ' + time_[2] + ' ' + time_[3];    // time.toString()   ' at'
  const month = await (Moralis.Cloud.run("MonthToNum", { "month" : time_[1] }));
  const day = time_[2] + '.' + month + '.' + time_[3];    // time.toString()   ' at' 
  request.object.set("block_day", day);

  return request.object
});


// can run before save on each column to check if the value is not null/undefined, otherwise set it to 0 (as default value)
Moralis.Cloud.beforeSave("AggregatedEvents", async (request) => {

  if(request.object.get("OfferAcceptedBuyer") == undefined){
    request.object.set("OfferAcceptedBuyer", 0)
  }

  if(request.object.get("OfferAcceptedSeller") == undefined){
    request.object.set("OfferAcceptedSeller", 0)
  }

  if(request.object.get("valueSeller_0x0000000000000000000000000000000000000000") == undefined){
    request.object.set("valueSeller_0x0000000000000000000000000000000000000000", 0)
  }

  if(request.object.get("valueBuyer_0x0000000000000000000000000000000000000000") == undefined){
    request.object.set("valueBuyer_0x0000000000000000000000000000000000000000", 0)
  }

  if(request.object.get("valueSeller_0x2791bca1f2de4661ed88a30c99a7a9449aa84174") == undefined){
    request.object.set("valueSeller_0x2791bca1f2de4661ed88a30c99a7a9449aa84174", 0)
  }

  if(request.object.get("valueBuyer_0x2791bca1f2de4661ed88a30c99a7a9449aa84174") == undefined){
    request.object.set("valueBuyer_0x2791bca1f2de4661ed88a30c99a7a9449aa84174", 0)
  }

  if(request.object.get("DisputeStarted") == undefined){
    request.object.set("DisputeStarted", 0)
  }

  if(request.object.get("DisputeClosed") == undefined){
    request.object.set("DisputeClosed", 0)
  }

  return request.object
});




//------------------------------------------------------------------------------------------------
// basically we need:  create the event syncs for each new contract deployed - the beforeSave works only for events after the event sync is in place (same goes for afterSave)
// so we should set up the event syncs before running contracts



// to update the file run 
// moralis-admin-cli watch-cloud-folder --moralisApiKey NJb8ptNvFULrAUZ --moralisApiSecret Lk8NN6ShmEEoLx0 --moralisSubdomain gbmvbywfzibe.usemoralis.com --autoSave 1 --moralisCloudfolder D:\Test\Payzura\payzura\JS\cloud_graphs