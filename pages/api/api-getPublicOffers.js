import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import {GetPublicOffers} from '../../JS/DB-cloudFunctions'
import {ParsePathGiveUserWallet} from "../../JS/BackendFunctions";

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
    console.log(req.body)
 
    const UserWallet = ParsePathGiveUserWallet(req.url);
    res.end(UserWallet);
    if(UserWallet == -1){res.end()}

    const offers = await GetPublicOffers(); // UserWallet.toLowerCase()

    var packagedOffers = []
    //console.log("offers.length: " + offers.length);
    
    for(let i = 0; i < offers.length; i++){
        // JSON.parse(JSON.stringify(offers[0], null, 3)).SellerWallet
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

