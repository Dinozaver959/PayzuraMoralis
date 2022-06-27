import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'

var Moralis = require("moralis/node");
var fs = require("fs");
var fse = require('fs-extra')
var path = require("path");
const DOMPurify = require('isomorphic-dompurify');

const serverUrl = "https://fordrbswdskl.usemoralis.com:2053/server";
const appId = "8AGWP86FEWcfCRwNLa0LGffGPs5kpcHxqRpEp4PF";
Moralis.start({ serverUrl, appId });

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {
    console.log(req.body)
    console.log(req.files)

    const areForBuyer = DOMPurify.sanitize(req.body.areForBuyer[0].toString());
    const DelegatesToAdd = DOMPurify.sanitize(req.body.DelegatesToAdd[0].toString()).toLowerCase();
    const DelegatesToRemove = DOMPurify.sanitize(req.body.DelegatesToRemove[0].toString()).toLowerCase();
    const objectId = DOMPurify.sanitize(req.body.objectId[0].toString());

    console.log("areForBuyer: " + areForBuyer);
    console.log("DelegatesToAdd: " + DelegatesToAdd);
    console.log("DelegatesToRemove: " + DelegatesToRemove);
    console.log("objectId: " + objectId);
    
    if(areForBuyer == "true"){
        await UpdateDelegatesMoralisDB(objectId, true, DelegatesToAdd, DelegatesToRemove);
    }
    else {
        await UpdateDelegatesMoralisDB(objectId, false, DelegatesToAdd, DelegatesToRemove);
    }
    

    res.status(201).end("Delegates updated");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute



async function UpdateDelegatesMoralisDB(objectId, areForBuyer, DelegatesToAdd, DelegatesToRemove) {

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

            const uniqueBuyerDelegates = newBuyerDelegates.filter(unique);
            agreement.set("BuyerDelegates") = uniqueBuyerDelegates.join();

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
            agreement.set("SellerDelegates") = uniqueSellerDelegates.join();
        }
    
        await agreement.save()
        .then((agreement) => {
            console.log('New object created with objectId: ' + agreement.id);
        }, (error) => {
            console.log('Failed to create new object, with error code: ' + error.message);
        });
    }
}

