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

    const ArbiterAccount = DOMPurify.sanitize(req.body.ArbiterAccount[0].toString());
    const ArbiterWallet = DOMPurify.sanitize(req.body.ArbiterWallet[0].toString());
    const objectId = DOMPurify.sanitize(req.body.objectId[0].toString());
    //const transactionHash = DOMPurify.sanitize(req.body.transactionHash[0].toString());
    const votedForBuyer = DOMPurify.sanitize(req.body.votedForBuyer[0].toString());
    const ArbitersVoteConcluded = DOMPurify.sanitize(req.body.ArbitersVoteConcluded[0].toString());


    console.log("ArbiterAccount: " + ArbiterAccount);
    console.log("ArbiterWallet: " + ArbiterWallet);
    console.log("objectId: " + objectId);
    //console.log("transactionHash: " + transactionHash);
    console.log("votedForBuyer: " + votedForBuyer);
    console.log("ArbitersVoteConcluded: " + ArbitersVoteConcluded);
    
    
    await UpdateDisputeMeter_DisputeManaged(ArbiterWallet, votedForBuyer)

    // change state the 'complete'
    if(ArbitersVoteConcluded == "true"){
        UpdateAgrerementToComplete(objectId);       
    }

    res.status(201).end("Offer created");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute


async function UpdateDisputeMeter_DisputeManaged(wallet, votedForBuyer){

    const DisputeMeter = Moralis.Object.extend("DisputeMeter");

    const query1 = new Moralis.Query(DisputeMeter);
    query1.equalTo("userAddress", wallet.toLowerCase());
    const results1 = await query1.find();

    if (results1.length > 0) {

        const agreement = results1[0];
        agreement.increment("DisputesManaged");

        if(votedForBuyer == "true"){
            agreement.increment("DisputesInFavorOfBuyer");
        }

        await agreement.save()
        .then((agreement) => {
            console.log('Number of agreements updated, with objectId: ' + agreement.id);
        }, (error) => {
            console.log('Failed to update number of agreements, with error code: ' + error.message);
        });
    } else {

        const agreement = new DisputeMeter();
        agreement.set("userAddress", wallet.toLowerCase());
        agreement.set("DisputesManaged", 1);

        if(votedForBuyer == "true"){
            agreement.set("DisputesInFavorOfBuyer", 1);
        }

        await agreement.save()
            .then((agreement) => {
                console.log('Number of agreements updated, with objectId: ' + agreement.id);
            }, (error) => {
                console.log('Failed to update number of agreements, with error code: ' + error.message);
            });
    }
}


async function UpdateAgrerementToComplete(objectId){  

    console.log("objectId: " + objectId)

    const Agreements = Moralis.Object.extend("Agreements");
    const query = new Moralis.Query(Agreements);
    query.equalTo("objectId", objectId);
    const results_ = await query.find();

    if (results_.length > 0) {
        const agreement = results_[0];
        agreement.set("State", "complete");

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

