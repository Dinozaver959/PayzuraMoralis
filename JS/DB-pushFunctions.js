var Moralis = require("moralis/node");


// ETH Server
//const serverUrl = "https://rbfqybjb4vga.usemoralis.com:2053/server";
//const appId = "FltzNNp8ebZsRkVnPTd6RKWTF2XoTLmVDMHSicVd";

// Matic Server 
const serverUrl = "https://gbmvbywfzibe.usemoralis.com:2053/server";
const appId = "6KNO1YxYUUp26EgElEHsfQ8ywPTJfs6D1C2H2yMR";
Moralis.start({ serverUrl, appId });



// ERC20 Approval
export async function UpdateContracts_ERC20ApprovalList(wallet, objectId) {

    const Agreements = Moralis.Object.extend("Agreements");
    const query = new Moralis.Query(Agreements);
    query.equalTo("objectId", objectId);
    const results_ = await query.find();

    if (results_.length > 0) {
        const agreement = results_[0];

        // check if 'ApprovedBy' is already set -> then just update/append
        // otherwise set 'ApprovedBy'

        var ApprovedBy = agreement.get("ApprovedBy");
        console.log("ApprovedBy:", ApprovedBy);

        if(!ApprovedBy){
            agreement.set("ApprovedBy", wallet);
        }
        else {

            const unique = (value, index, self) => {
                return self.indexOf(value) === index
            }        

            const newApprovedBy = ApprovedBy.concat(",", wallet);
            agreement.set("ApprovedBy", newApprovedBy);
        }

        await agreement.save()
        .then((agreement) => {
            console.log('New object created with objectId: ' + agreement.id);
        }, (error) => {
            console.log('Failed to create new object, with error code: ' + error.message);
        });
    }
}


// Update Delegates
export async function UpdateContracts_UpdateDelegates(objectId, areForBuyer, DelegatesToAdd, DelegatesToRemove) {

    const Agreements = Moralis.Object.extend("Agreements");
    const query = new Moralis.Query(Agreements);
    query.equalTo("objectId", objectId);
    const results_ = await query.find();

    if (results_.length > 0) {
        const agreement = results_[0];

        if(areForBuyer){

            var buyerDelegates = agreement.get("BuyerDelegates").split(",");

            // for every element in DelegatesToRemove - remove if in BuyerDelegates
            for (let i = 0; i < DelegatesToRemove; i++){

                // splice if more efficient, but it just removes 1 element directly and does not create a new array
                for( var j = 0; j < buyerDelegates.length; j++){               
                    if ( buyerDelegates[j] === DelegatesToRemove[i]) { 
                        buyerDelegates.splice(j, 1); 
                        j--; 
                    }
                }

                // interesting, but seems the splice is more efficient
                /* 
                    var filtered = buyerDelegates.filter(function(value, index, arr){ 
                        return value != DelegatesToRemove[i];
                    });
                */
            }

            // for every element in DelegatesToAdd - add and filter unique in BuyerDelegates
            var newBuyerDelegates = buyerDelegates.concat(DelegatesToAdd);

            const unique = (value, index, self) => {
                return self.indexOf(value) === index
            }

            const uniqueBuyerDelegates = newBuyerDelegates.filter(unique);                          // appears faulty, filtering on a string? cmon...
            agreement.set("BuyerDelegates", uniqueBuyerDelegates.join());

        } else {

            var sellerDelegates = agreement.get("SellerDelegates").split(",");

            // for every element in DelegatesToRemove - remove if in SellerDelegates
            for (let i = 0; i < DelegatesToRemove; i++){

                // splice if more efficient, but it just removes 1 element directly and does not create a new array
                for( var j = 0; j < sellerDelegates.length; j++){               
                    if ( sellerDelegates[j] === DelegatesToRemove[i]) { 
                        sellerDelegates.splice(j, 1); 
                        j--; 
                    }
                }
            }

            // for every element in DelegatesToAdd - add and filter unique in SellerDelegates
            var newSellerDelegates = sellerDelegates.concat(DelegatesToAdd);

            const unique = (value, index, self) => {
                return self.indexOf(value) === index
            }

            const uniqueSellerDelegates = newSellerDelegates.filter(unique);
            agreement.set("SellerDelegates", uniqueSellerDelegates.join());
        }
    
        await agreement.save()
        .then((agreement) => {
            console.log('New object created with objectId: ' + agreement.id);
        }, (error) => {
            console.log('Failed to create new object, with error code: ' + error.message);
        });
    }
}

// Update Personalized
export async function UpdateContracts_UpdatePersonalized(objectId, areForBuyer, PersonalizedToAdd, PersonalizedToRemove) {

    const Agreements = Moralis.Object.extend("Agreements");
    const query = new Moralis.Query(Agreements);
    query.equalTo("objectId", objectId);
    const results_ = await query.find();

    if (results_.length > 0) {
        const agreement = results_[0];

        var personalizedOffer = agreement.get("PersonalizedOffer").split(",");

        // for every element in PersonalizedToRemove - remove if in personalizedOffer
        for (let i = 0; i < PersonalizedToRemove; i++){

            // splice if more efficient, but it just removes 1 element directly and does not create a new array
            for( var j = 0; j < personalizedOffer.length; j++){               
                if (personalizedOffer[j] === PersonalizedToRemove[i]) { 
                    personalizedOffer.splice(j, 1); 
                    j--; 
                }
            }
        }

        // for every element in PersonalizedToAdd - add and filter unique in personalizedOffer
        var newPersonalizedOffer = personalizedOffer.concat(PersonalizedToAdd);
        if(personalizedOffer[0] == ''){
            newPersonalizedOffer.shift();
        } 
        
        const unique = (value, index, self) => {
            return self.indexOf(value) === index
        }

        const uniquePersonalizedOffer = newPersonalizedOffer.filter(unique);                          // appears faulty, filtering on a string? cmon...
        agreement.set("PersonalizedOffer", uniquePersonalizedOffer.join());

        if(areForBuyer){
            // set the state to 'await_seller_accepts'
            agreement.set("State", "await_seller_accepts");
        }

        await agreement.save()
        .then((agreement) => {
            console.log('New object created with objectId: ' + agreement.id);
        }, (error) => {
            console.log('Failed to create new object, with error code: ' + error.message);
        });
    }
}


// Contract Flow
export async function UpdateContracts_ContractCreatedBySeller( SellerWallet, ContractTitle, OfferDescription, hashDescription, Price, CurrencyTicker, ChainID, TimeToDeliver, transactionHash, index, OfferValidUntil, PersonalizedOffer, Arbiters) {

    const Agreements = Moralis.Object.extend("Agreements");
    const agreement = new Agreements();
    agreement.set("ContractStartedBy", "Seller");
    agreement.set("SellerWallet", SellerWallet.toLowerCase());
    agreement.set("ContractTitle", ContractTitle);
    agreement.set("OfferDescription", OfferDescription);
    agreement.set("hashDescription", hashDescription);
    agreement.set("Price", Price);
    agreement.set("CurrencyTicker", CurrencyTicker);
    agreement.set("ChainID", ChainID);
    agreement.set("TimeToDeliver", TimeToDeliver);
    agreement.set("OfferValidUntil", OfferValidUntil);
    agreement.set("PersonalizedOffer", PersonalizedOffer.toLowerCase());  
    agreement.set("Arbiters", Arbiters.toLowerCase());  
    agreement.set("CreatedTxHash", transactionHash);
    agreement.set("State", "Available");
    agreement.set("index", index);
    agreement.set("ApprovedBy", "");
  
    await agreement.save()
    .then((agreement) => {
        console.log('New object created with objectId: ' + agreement.id);
    }, (error) => {
        console.log('Failed to create new object, with error code: ' + error.message);
    });
}

export async function UpdateContracts_ContractCreatedByBuyer(BuyerWallet, ContractTitle, OfferDescription, hashDescription, Price, CurrencyTicker, ChainID, TimeToDeliver, transactionHash, index, OfferValidUntil, PersonalizedOffer, Arbiters) {

    const Agreements = Moralis.Object.extend("Agreements");
    const agreement = new Agreements();
    agreement.set("ContractStartedBy", "Buyer");
    agreement.set("BuyerWallet", BuyerWallet.toLowerCase());
    agreement.set("ContractTitle", ContractTitle);
    agreement.set("OfferDescription", OfferDescription);
    agreement.set("hashDescription", hashDescription);
    agreement.set("Price", Price);
    agreement.set("CurrencyTicker", CurrencyTicker);
    agreement.set("ChainID", ChainID);
    agreement.set("TimeToDeliver", TimeToDeliver);
    agreement.set("OfferValidUntil", OfferValidUntil);
    agreement.set("PersonalizedOffer", PersonalizedOffer.toLowerCase());  
    agreement.set("Arbiters", Arbiters.toLowerCase());  
    agreement.set("CreatedTxHash", transactionHash);
    agreement.set("State", "buyer_initialized_and_paid");
    agreement.set("index", index);
    agreement.set("ApprovedBy", "");
  
    await agreement.save()
    .then((agreement) => {
        console.log('New object created with objectId: ' + agreement.id);
    }, (error) => {
        console.log('Failed to create new object, with error code: ' + error.message);
    });
}



// Can Delete
/*
export async function UpdateContracts_ContractFunded(objectId) {

    const Agreements = Moralis.Object.extend("Agreements");
    const query = new Moralis.Query(Agreements);
    query.equalTo("objectId", objectId);
    const results_ = await query.find();

    if (results_.length > 0) {
        const agreement = results_[0];
        agreement.set("State", "buyer_initialized_and_paid");

        await agreement.save()
        .then((agreement) => {
            console.log('New object created with objectId: ' + agreement.id);
        }, (error) => {
            console.log('Failed to create new object, with error code: ' + error.message);
        });
    }
}
*/


export async function UpdateContracts_ContractAcceptedByBuyer(BuyerWallet, objectId, transactionHash) {

    const Agreements = Moralis.Object.extend("Agreements");
    const query = new Moralis.Query(Agreements);
    query.equalTo("objectId", objectId);
    const results_ = await query.find();

    if (results_.length > 0) {
        const agreement = results_[0];
        agreement.set("State", "paid");
        agreement.set("BuyerWallet", BuyerWallet.toLowerCase());
        agreement.set("AcceptedTxHash", transactionHash);

        await agreement.save()
        .then((agreement) => {
            console.log('New object created with objectId: ' + agreement.id);
        }, (error) => {
            console.log('Failed to create new object, with error code: ' + error.message);
        });
    }
}

export async function UpdateContracts_ContractAcceptedBySeller(SellerWallet, objectId, transactionHash) {

    const Agreements = Moralis.Object.extend("Agreements");
    const query = new Moralis.Query(Agreements);
    query.equalTo("objectId", objectId);
    const results_ = await query.find();

    if (results_.length > 0) {
        const agreement = results_[0];
        agreement.set("State", "paid");
        agreement.set("SellerWallet", SellerWallet.toLowerCase());
        agreement.set("AcceptedTxHash", transactionHash);

        await agreement.save()
        .then((agreement) => {
            console.log('New object created with objectId: ' + agreement.id);
        }, (error) => {
            console.log('Failed to create new object, with error code: ' + error.message);
        });
    }
}

export async function UpdateContracts_ConfirmDelivery(objectId, transactionHash) {

    const Agreements = Moralis.Object.extend("Agreements");
    const query = new Moralis.Query(Agreements);
    query.equalTo("objectId", objectId);
    const results_ = await query.find();

    if (results_.length > 0) {
        const agreement = results_[0];
        agreement.set("State", "complete");
        agreement.set("CompletedTxHash", transactionHash);

        await agreement.save()
        .then((agreement) => {
            console.log('New object created with objectId: ' + agreement.id);
        }, (error) => {
            console.log('Failed to create new object, with error code: ' + error.message);
        });
    }
}

export async function UpdateContracts_ClaimFunds(objectId, transactionHash) {

    const Agreements = Moralis.Object.extend("Agreements");
    const query = new Moralis.Query(Agreements);
    query.equalTo("objectId", objectId);
    const results_ = await query.find();

    if (results_.length > 0) {
        const agreement = results_[0];
        agreement.set("State", "complete");
        agreement.set("CompletedTxHash", transactionHash);

        await agreement.save()
        .then((agreement) => {
            console.log('New object created with objectId: ' + agreement.id);
        }, (error) => {
            console.log('Failed to create new object, with error code: ' + error.message);
        });
    }
}

export async function UpdateContracts_ReturnPayment(objectId, transactionHash) {

    const Agreements = Moralis.Object.extend("Agreements");
    const query = new Moralis.Query(Agreements);
    query.equalTo("objectId", objectId);
    const results_ = await query.find();

    if (results_.length > 0) {
        const agreement = results_[0];
        agreement.set("State", "complete");
        agreement.set("CompletedTxHash", transactionHash);

        await agreement.save()
        .then((agreement) => {
            console.log('New object created with objectId: ' + agreement.id);
        }, (error) => {
            console.log('Failed to create new object, with error code: ' + error.message);
        });
    }
}


// Cancel Contract
export async function UpdateContracts_CancelContract(objectId, transactionHash) {

  const Agreements = Moralis.Object.extend("Agreements");
  const query = new Moralis.Query(Agreements);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();

  if (results_.length > 0) {
      const agreement = results_[0];
      agreement.set("State", "canceled");
      agreement.set("canceledTxHash", transactionHash);

      await agreement.save()
      .then((agreement) => {
          console.log('New object created with objectId: ' + agreement.id);
      }, (error) => {
          console.log('Failed to create new object, with error code: ' + error.message);
      });
  }
}

// Disputes
export async function UpdateContracts_StartDispute(objectId, transactionHash) {

    const Agreements = Moralis.Object.extend("Agreements");
    const query = new Moralis.Query(Agreements);
    query.equalTo("objectId", objectId);
    const results_ = await query.find();

    if (results_.length > 0) {
        const agreement = results_[0];
        agreement.set("State", "dispute");
        agreement.set("DisputeTxHash", transactionHash);

        await agreement.save()
        .then((agreement) => {
            console.log('New object created with objectId: ' + agreement.id);
        }, (error) => {
            console.log('Failed to create new object, with error code: ' + error.message);
        });
    }
}

export async function UpdateContracts_EndDispute(objectId){  

    console.log("objectId: " + objectId)

    const Agreements = Moralis.Object.extend("Agreements");
    const query = new Moralis.Query(Agreements);
    query.equalTo("objectId", objectId);
    const results_ = await query.find();

    if (results_.length > 0) {
        const agreement = results_[0];
        agreement.set("State", "disputeSolved");

        await agreement.save()
        .then((agreement) => {
            console.log('New object created with objectId: ' + agreement.id);
        }, (error) => {
            console.log('Failed to create new object, with error code: ' + error.message);
        });
    }
    else {
        console.log("no match was found for this query.")
    }
}



// UserParticipationData Table
export async function UpdateUserParticipationData(BuyerWallet, Property){

    const UserParticipationData = Moralis.Object.extend("UserParticipationData");
    const query1 = new Moralis.Query(UserParticipationData);
    query1.equalTo("userAddress", BuyerWallet.toLowerCase());
    const results1 = await query1.find();

    if (results1.length > 0) {
        const agreement = results1[0];
        agreement.increment(Property);

        await agreement.save()
        .then((agreement) => {
            console.log(`Number of ${Property} updated, with objectId: ${agreement.id}`);
        }, (error) => {
            console.log(`Failed to update ${Property}, with error code: ${error.message}`);
        });
    
    } else {
        const agreement = new UserParticipationData();
        agreement.set("userAddress", BuyerWallet.toLowerCase());
        agreement.increment(Property);

        await agreement.save()
        .then((agreement) => {
            console.log(`Number of ${Property} updated, with objectId: ${agreement.id}`);
        }, (error) => {
            console.log(`Failed to update ${Property}, with error code: ${agreement.message}`);
        });
    } 
}

//------------------------------------------------------------------------------------------------
//                                    Notifications
//------------------------------------------------------------------------------------------------

export async function UpdateNotifications(Wallet, Description) {
    const Notifications = Moralis.Object.extend("Notifications");
    const notification = new Notifications();
    notification.set("Wallet", Wallet.toLowerCase());
    notification.set("Description", Description);

    await notification.save()
    .then((notification) => {
        console.log('New object created with objectId: ' + notification.id);
    }, (error) => {
        console.log('Failed to create new object, with error code: ' + error.message);
    });
}

export async function SetNotificationsAsRead(Wallet) {
    const query = new Moralis.Query("Notifications"); 
    query.equalTo("Wallet", Wallet);
    query.equalTo("Read", 0);
    var result = await query.find();

    for (const notification of result) {
        notification.set("Read", 1);
        await notification.save()
    }
    console.log('Success');
}