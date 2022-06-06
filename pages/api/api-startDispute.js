import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'

var Moralis = require("moralis/node");
var fs = require("fs");
var fse = require('fs-extra')
var path = require("path");
const DOMPurify = require('isomorphic-dompurify');

const serverUrl = "https://shwkwtgzxazu.usemoralis.com:2053/server";
const appId = "2usVTlONkHgHkToWJNY6WEaWsklpD2PD5bjkhZ8T";
Moralis.start({ serverUrl, appId });

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {
    console.log(req.body)
    console.log(req.files)

    const BuyerAccount = DOMPurify.sanitize(req.body.BuyerAccount[0].toString());
    const BuyerWallet = DOMPurify.sanitize(req.body.BuyerWallet[0].toString());
    const objectId = DOMPurify.sanitize(req.body.objectId[0].toString());
    const transactionHash = DOMPurify.sanitize(req.body.transactionHash[0].toString());
    

    console.log("BuyerAccount: " + BuyerAccount);
    console.log("BuyerWallet: " + BuyerWallet);
    console.log("objectId: " + objectId);
    console.log("transactionHash: " + transactionHash);
    
    
    await AddAgreementToCollectionMoralisDB(objectId, transactionHash)

    res.status(201).end("Proposal created");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute



async function AddAgreementToCollectionMoralisDB(objectId, transactionHash) {

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

