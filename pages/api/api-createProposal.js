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
    const ProposalTitle = DOMPurify.sanitize(req.body.ProposalTitle[0].toString());
    const ProposalDescription = DOMPurify.sanitize(req.body.ProposalDescription[0].toString());
    const hashDescription = DOMPurify.sanitize(req.body.hashDescription[0].toString());
    const Price = DOMPurify.sanitize(req.body.Price[0].toString());
    const TimeAllowed = DOMPurify.sanitize(req.body.TimeAllowed[0].toString());
    const transactionHash = DOMPurify.sanitize(req.body.transactionHash[0].toString());
    const index = DOMPurify.sanitize(req.body.index[0].toString());

    console.log("SellerAccount: " + SellerAccount);
    console.log("SellerWallet: " + SellerWallet);
    console.log("ProposalTitle: " + ProposalTitle);
    console.log("ProposalDescription: " + ProposalDescription);
    console.log("hashDescription: " + hashDescription);
    console.log("Price: " + Price);
    console.log("TimeAllowed: " + TimeAllowed);
    console.log("transactionHash: " + transactionHash);
    console.log("index: " + index);
    
    await AddAgreementToCollectionMoralisDB(SellerAccount, SellerWallet, ProposalTitle, ProposalDescription, hashDescription, Price, TimeAllowed, transactionHash, index)

    res.status(201).end("Proposal created");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute



async function AddAgreementToCollectionMoralisDB(SellerAccount, SellerWallet, ProposalTitle, ProposalDescription, hashDescription, Price, TimeAllowed, transactionHash, index) {

  const Agreements = Moralis.Object.extend("Agreements");
  const agreement = new Agreements();
  agreement.set("SellerAccount", SellerAccount);
  agreement.set("SellerWallet", SellerWallet);
  agreement.set("ProposalTitle", ProposalTitle);
  agreement.set("ProposalDescription", ProposalDescription);
  agreement.set("hashDescription", hashDescription);
  agreement.set("Price", Price);
  agreement.set("TimeAllowed", TimeAllowed);
  agreement.set("CreatedTxHash", transactionHash);
  agreement.set("State", "Available");
  agreement.set("index", index);

  await agreement.save()
      .then((agreement) => {
          console.log('New object created with objectId: ' + agreement.id);
      }, (error) => {
          console.log('Failed to create new object, with error code: ' + error.message);
      });

}

