import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import { UpdateContracts_ClaimFunds, UpdateNotifications } from '../../JS/DB-pushFunctions';
import {GetAgreementsTitle} from '../../JS/DB-cloudFunctions';

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
    
    await UpdateContracts_ClaimFunds(objectId, transactionHash)

    const agreementTitle = await GetAgreementsTitle(objectId);
    await UpdateNotifications(SellerWallet, `Funds claimed from ${agreementTitle}`);
    res.status(201).end("Funds claimed");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute





