import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import { UpdateContracts_UpdatePersonalized } from '../../JS/DB-pushFunctions';

const DOMPurify = require('isomorphic-dompurify');

const apiRoute = nextConnect()
apiRoute.use(middleware)

apiRoute.post(async (req, res) => {
    console.log(req.body)
    console.log(req.files)

    const isBuyer = DOMPurify.sanitize(req.body.isBuyer[0].toString());
    const PersonalizedToAdd = DOMPurify.sanitize(req.body.PersonalizedToAdd[0].toString()).toLowerCase();
    const PersonalizedToRemove = DOMPurify.sanitize(req.body.PersonalizedToRemove[0].toString()).toLowerCase();
    const objectId = DOMPurify.sanitize(req.body.objectId[0].toString());

    console.log("isBuyer: " + isBuyer);
    console.log("PersonalizedToAdd: " + PersonalizedToAdd);
    console.log("PersonalizedToRemove: " + PersonalizedToRemove);
    console.log("objectId: " + objectId);
    
    if(isBuyer == "true"){
        await UpdateContracts_UpdatePersonalized(objectId, true, PersonalizedToAdd, PersonalizedToRemove);
    }
    else {
        await UpdateContracts_UpdatePersonalized(objectId, false, PersonalizedToAdd, PersonalizedToRemove);
    }

    res.status(201).end("Personalized updated");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute

