import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import { UpdateContracts_CancelContract, UpdateUserParticipationData } from '../../JS/DB-pushFunctions';

const DOMPurify = require('isomorphic-dompurify');

const apiRoute = nextConnect()
apiRoute.use(middleware)

apiRoute.post(async (req, res) => {
    console.log(req.body)
    console.log(req.files)

    const userWallet = DOMPurify.sanitize(req.body.userWallet[0].toString());
    const objectId = DOMPurify.sanitize(req.body.objectId[0].toString());
    const transactionHash = DOMPurify.sanitize(req.body.transactionHash[0].toString());

    console.log("userWallet: " + userWallet);
    console.log("objectId: " + objectId);
    console.log("transactionHash: " + transactionHash);
    
    await UpdateContracts_CancelContract(objectId, transactionHash);
    await UpdateUserParticipationData(userWallet, "ContractsCanceled");
    
    res.status(201).end("Offer created");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute
