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

    const SellerAccount = DOMPurify.sanitize(req.body.SellerAccount[0].toString());
    const SellerWallet = DOMPurify.sanitize(req.body.SellerWallet[0].toString());
    const OfferTitle = DOMPurify.sanitize(req.body.OfferTitle[0].toString());
    const OfferDescription = DOMPurify.sanitize(req.body.OfferDescription[0].toString());
    const hashDescription = DOMPurify.sanitize(req.body.hashDescription[0].toString());
    const Price = DOMPurify.sanitize(req.body.Price[0].toString());
    const TimeToDeliver = DOMPurify.sanitize(req.body.TimeToDeliver[0].toString());
    const transactionHash = DOMPurify.sanitize(req.body.transactionHash[0].toString());
    const index = DOMPurify.sanitize(req.body.index[0].toString());
    const OfferValidUntil = DOMPurify.sanitize(req.body.OfferValidUntil[0].toString());
    const PersonalizedOffer = DOMPurify.sanitize(req.body.PersonalizedOffer[0].toString());
    const Arbiters = DOMPurify.sanitize(req.body.Arbiters[0].toString());
    const CurrencyTicker = DOMPurify.sanitize(req.body.CurrencyTicker[0].toString());
    const ChainID = DOMPurify.sanitize(req.body.ChainID[0].toString());

    console.log("SellerAccount: " + SellerAccount);
    console.log("SellerWallet: " + SellerWallet);
    console.log("OfferTitle: " + OfferTitle);
    console.log("OfferDescription: " + OfferDescription);
    console.log("hashDescription: " + hashDescription);
    console.log("Price: " + Price);
    console.log("CurrencyTicker: " + CurrencyTicker);
    console.log("ChainID: " + ChainID);    
    console.log("TimeToDeliver: " + TimeToDeliver);
    console.log("transactionHash: " + transactionHash);
    console.log("index: " + index);
    console.log("OfferValidUntil: " + OfferValidUntil);
    console.log("PersonalizedOffer: " + PersonalizedOffer);
    console.log("Arbiters: " + Arbiters);


    await AddAgreementToCollectionMoralisDB(SellerAccount, SellerWallet, OfferTitle, OfferDescription, hashDescription, Price, CurrencyTicker, ChainID, TimeToDeliver, transactionHash, index, OfferValidUntil, PersonalizedOffer, Arbiters)

    res.status(201).end("Offer created");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute



async function AddAgreementToCollectionMoralisDB(SellerAccount, SellerWallet, OfferTitle, OfferDescription, hashDescription, Price, CurrencyTicker, ChainID, TimeToDeliver, transactionHash, index, OfferValidUntil, PersonalizedOffer, Arbiters) {

  const Agreements = Moralis.Object.extend("Agreements");
  const agreement = new Agreements();
  agreement.set("SellerAccount", SellerAccount);
  agreement.set("SellerWallet", SellerWallet.toLowerCase());
  agreement.set("OfferTitle", OfferTitle);
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

