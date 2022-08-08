import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import { UpdateContracts_ERC20ApprovalList } from '../../JS/DB-pushFunctions';

const DOMPurify = require('isomorphic-dompurify');

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {
    console.log(req.body)
    console.log(req.files)

    const userAccount = DOMPurify.sanitize(req.body.userAccount[0].toString());
    const wallet = DOMPurify.sanitize(req.body.wallet[0].toString());
    const objectId = DOMPurify.sanitize(req.body.objectId[0].toString());
    const transactionHash = DOMPurify.sanitize(req.body.transactionHash[0].toString());
    
    console.log("userAccount: " + userAccount);
    console.log("wallet: " + wallet);
    console.log("objectId: " + objectId);
    console.log("transactionHash: " + transactionHash);
    
    await UpdateContracts_ERC20ApprovalList(wallet, objectId);

    res.status(201).end("Offer created");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute
