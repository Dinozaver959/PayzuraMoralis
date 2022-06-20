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

    const BuyerAccount = DOMPurify.sanitize(req.body.BuyerAccount[0].toString());
    const BuyerWallet = DOMPurify.sanitize(req.body.BuyerWallet[0].toString());
    const SellerWallet = DOMPurify.sanitize(req.body.SellerWallet[0].toString());
    const objectId = DOMPurify.sanitize(req.body.objectId[0].toString());
    const transactionHash = DOMPurify.sanitize(req.body.transactionHash[0].toString());
    
    console.log("BuyerAccount: " + BuyerAccount);
    console.log("BuyerWallet: " + BuyerWallet);
    console.log("SellerWallet: " + SellerWallet);
    console.log("objectId: " + objectId);
    console.log("transactionHash: " + transactionHash);
    
    await AddAgreementToCollectionMoralisDB(BuyerAccount, BuyerWallet, objectId, transactionHash);
    await UpdateDisputeMeter_AgreementsMade(BuyerWallet);
    await UpdateDisputeMeter_AgreementsMade(SellerWallet);

    res.status(201).end("Offer created");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute



async function AddAgreementToCollectionMoralisDB(BuyerAccount, BuyerWallet, objectId, transactionHash) {

    const Agreements = Moralis.Object.extend("Agreements");
    const query = new Moralis.Query(Agreements);
    query.equalTo("objectId", objectId);
    const results_ = await query.find();

    if (results_.length > 0) {
        const agreement = results_[0];
        agreement.set("State", "paid");
        agreement.set("BuyerAccount", BuyerAccount);
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

async function UpdateDisputeMeter_AgreementsMade(wallet){

    const DisputeMeter = Moralis.Object.extend("DisputeMeter");

    const query1 = new Moralis.Query(DisputeMeter);
    query1.equalTo("userAddress", wallet);
    const results1 = await query1.find();

    if (results1.length > 0) {

        const agreement = results1[0];
        agreement.increment("AgreementsMade");

        await agreement.save()
        .then((agreement) => {
            console.log('Number of agreements updated, with objectId: ' + agreement.id);
        }, (error) => {
            console.log('Failed to update number of agreements, with error code: ' + error.message);
        });
    } else {

        const agreement = new DisputeMeter();
        agreement.set("userAddress", wallet.toLowerCase());
        agreement.set("AgreementsMade", 1);

        await agreement.save()
            .then((agreement) => {
                console.log('Number of agreements updated, with objectId: ' + agreement.id);
            }, (error) => {
                console.log('Failed to update number of agreements, with error code: ' + error.message);
            });
    }
}