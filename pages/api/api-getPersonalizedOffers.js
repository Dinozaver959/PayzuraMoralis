import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import {GetPersonalizedOffers} from '../../JS/DB-cloudFunctions'
import {ParsePathGiveUserWallet} from "../../JS/BackendFunctions";

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
    console.log(req.body)
 
    const UserWallet = ParsePathGiveUserWallet(req.url);
    if(UserWallet == -1){res.end()}

    console.log("UserWallet: " + UserWallet);

    const offers = await GetPersonalizedOffers(UserWallet.toLowerCase());

    var packagedOffers = []
    //console.log("offers.length: " + offers.length);

    for(let i = 0; i < offers.length; i++){
        packagedOffers.push({id: i+1, name : offers[i]})
        //console.log("offers[i]: " + offers[i]);
    }

    res.end(JSON.stringify(packagedOffers, null, 3));
})

export const config = {
    api: {
      bodyParser: false
    }
} 
export default apiRoute

