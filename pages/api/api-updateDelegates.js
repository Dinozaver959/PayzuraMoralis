import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import { UpdateContracts_UpdateDelegates } from '../../JS/DB-pushFunctions';

const DOMPurify = require('isomorphic-dompurify');

const apiRoute = nextConnect()
apiRoute.use(middleware)

apiRoute.post(async (req, res) => {
    console.log(req.body)
    console.log(req.files)

    const areForBuyer = DOMPurify.sanitize(req.body.areForBuyer[0].toString());
    const DelegatesToAdd = DOMPurify.sanitize(req.body.DelegatesToAdd[0].toString()).toLowerCase();
    const DelegatesToRemove = DOMPurify.sanitize(req.body.DelegatesToRemove[0].toString()).toLowerCase();
    const objectId = DOMPurify.sanitize(req.body.objectId[0].toString());

    console.log("areForBuyer: " + areForBuyer);
    console.log("DelegatesToAdd: " + DelegatesToAdd);
    console.log("DelegatesToRemove: " + DelegatesToRemove);
    console.log("objectId: " + objectId);
    
    if(areForBuyer == "true"){
        await UpdateContracts_UpdateDelegates(objectId, true, DelegatesToAdd, DelegatesToRemove);
    }
    else {
        await UpdateContracts_UpdateDelegates(objectId, false, DelegatesToAdd, DelegatesToRemove);
    }

    res.status(201).end("Delegates updated");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute

