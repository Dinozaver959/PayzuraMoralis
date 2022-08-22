import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'

var Moralis = require("moralis/node");

const serverUrl = "https://gbmvbywfzibe.usemoralis.com:2053/server";
const appId = "6KNO1YxYUUp26EgElEHsfQ8ywPTJfs6D1C2H2yMR";
Moralis.start({ serverUrl, appId });

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
    console.log(req.body)

    const offers = await Moralis.Cloud.run("aggregateData");

    //var packagedOffers = []
    //console.log("offers.length: " + offers.length);

    //for(let i = 0; i < offers.length; i++){
    //    packagedOffers.push({id: i+1, name : offers[i]})
        //console.log("offers[i]: " + offers[i]);
    //}

    res.end(JSON.stringify(offers, null, 3));
})

export const config = {
    api: {
      bodyParser: false
    }
} 
export default apiRoute

