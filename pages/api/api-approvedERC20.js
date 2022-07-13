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
    const objectId = DOMPurify.sanitize(req.body.objectId[0].toString());
    const transactionHash = DOMPurify.sanitize(req.body.transactionHash[0].toString());
    
    console.log("BuyerAccount: " + BuyerAccount);
    console.log("BuyerWallet: " + BuyerWallet);
    console.log("objectId: " + objectId);
    console.log("transactionHash: " + transactionHash);
    
    await UpdateApprovalListMoralisDB(BuyerWallet, objectId);


    res.status(201).end("Offer created");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute



async function UpdateApprovalListMoralisDB(BuyerWallet, objectId) {

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
            agreement.set("ApprovedBy", BuyerWallet);
        }
        else {

            const unique = (value, index, self) => {
                return self.indexOf(value) === index
            }        

            const newApprovedBy = ApprovedBy.concat(",", BuyerWallet);
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