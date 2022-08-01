import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import {GetPublicOffers_CreatedByBuyer_await_seller_accepts_ALL} from '../../JS/DB-cloudFunctions'

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
    console.log(req.body)
 
    const offers = await GetPublicOffers_CreatedByBuyer_await_seller_accepts_ALL();

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

