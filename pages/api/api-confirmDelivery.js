import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import { UpdateContracts_ConfirmDelivery, UpdateUserParticipationData, UpdateNotifications } from '../../JS/DB-pushFunctions';
import {GetAgreementsTitle} from '../../JS/DB-cloudFunctions';

const DOMPurify = require('isomorphic-dompurify');

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {
    console.log(req.body)
    console.log(req.files)

    const BuyerWallet = DOMPurify.sanitize(req.body.BuyerWallet[0].toString());
    const objectId = DOMPurify.sanitize(req.body.objectId[0].toString());
    const transactionHash = DOMPurify.sanitize(req.body.transactionHash[0].toString());
    
    console.log("BuyerWallet: " + BuyerWallet);
    console.log("objectId: " + objectId);
    console.log("transactionHash: " + transactionHash);
    
    await UpdateContracts_ConfirmDelivery(objectId, transactionHash)
    await UpdateUserParticipationData(BuyerWallet, "ConfirmedDeliveryAsBuyer");

    const agreementTitle = await GetAgreementsTitle(objectId);
    await UpdateNotifications(BuyerWallet, `Delivery confirmed on "${agreementTitle}" contract`);

    res.status(201).end("Delivery confirmed");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute

