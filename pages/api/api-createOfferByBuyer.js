import {Moralis} from '../../JS/DB-cloudFunctions'
import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import { UpdateContracts_ContractCreatedByBuyer, UpdateUserParticipationData, UpdateNotifications } from '../../JS/DB-pushFunctions';

const DOMPurify = require('isomorphic-dompurify');

const apiRoute = nextConnect()
apiRoute.use(middleware)

apiRoute.post(async (req, res) => {
    console.log(req.body)
    console.log(req.files)

    const BuyerWallet = DOMPurify.sanitize(req.body.BuyerWallet[0].toString());
    const ContractTitle = DOMPurify.sanitize(req.body.ContractTitle[0].toString());
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

    console.log("BuyerWallet: " + BuyerWallet);
    console.log("ContractTitle: " + ContractTitle);
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


    await UpdateContracts_ContractCreatedByBuyer(BuyerWallet, ContractTitle, OfferDescription, hashDescription, Price, CurrencyTicker, ChainID, TimeToDeliver, transactionHash, index, OfferValidUntil, PersonalizedOffer, Arbiters)


    // if artbiters are not empty, split it by commma and increment for each
    if(Arbiters){
        console.log("Arbiters is not empty");
        const arbiterArray = Arbiters.split(",");

        for(let i = 0; i < arbiterArray.length; i++) {
            console.log("arbiterArray[i]: " + arbiterArray[i]);
            await UpdateUserParticipationData(arbiterArray[i], "ReceivedArbiterRole");
        }
    }

    // same for PersonalizedOffer
    if(PersonalizedOffer){
        console.log("PersonalizedOffer is not empty");
        const PersonalizedOfferArray = PersonalizedOffer.split(",");

        for(let i = 0; i < PersonalizedOfferArray.length; i++) {
            console.log("PersonalizedOfferArray[i] = " + PersonalizedOfferArray[i]);
            await UpdateUserParticipationData(PersonalizedOfferArray[i], "ReceivedPersonalizedOffer");
        }
    }


    console.log("Intermediate part");

    // if PersonalizedOffer  is empty...
    if(IsPersonalized(!PersonalizedOffer)){
        console.log("not personalized, general contract created");
        await UpdateUserParticipationData(BuyerWallet, "ContractsCreatedAsBuyer");
    } else {
        console.log("personalized contract created");
        await UpdateUserParticipationData(BuyerWallet, "PersonalizedContractsCreatedAsBuyer");
    }

    await UpdateNotifications(BuyerWallet, `New offer created as a buyer: "${ContractTitle}"`);
    res.status(201).end("Offer created");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute

function IsPersonalized(PersonalizedOffer){
    return (!PersonalizedOffer) ? false : true;
}




