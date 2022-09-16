import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import { UpdateContracts_ReturnPayment, UpdateUserParticipationData, UpdateNotifications } from '../../JS/DB-pushFunctions';

const DOMPurify = require('isomorphic-dompurify');

const apiRoute = nextConnect()
apiRoute.use(middleware)

apiRoute.post(async (req, res) => {
    console.log(req.body)
    console.log(req.files)

    const SellerWallet = DOMPurify.sanitize(req.body.SellerWallet[0].toString());
    const objectId = DOMPurify.sanitize(req.body.objectId[0].toString());
    const transactionHash = DOMPurify.sanitize(req.body.transactionHash[0].toString());

    console.log("SellerWallet: " + SellerWallet);
    console.log("objectId: " + objectId);
    console.log("transactionHash: " + transactionHash);
    
    await UpdateContracts_ReturnPayment(objectId, transactionHash);
    await UpdateUserParticipationData(SellerWallet, "ReturnPaymentAsSeller");

    await UpdateNotifications(BuyerWallet, "Payment returned");
    res.status(201).end("Payment returned");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute


