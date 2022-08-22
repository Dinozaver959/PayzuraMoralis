import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import {GetAllAggregateData} from "../../JS/DB-cloudFunctions.js"

const DOMPurify = require('isomorphic-dompurify');
const _ = require("lodash");

//var Moralis_s2 = require("moralis/node");
//const serverUrl = "https://gbmvbywfzibe.usemoralis.com:2053/server";
//const appId = "6KNO1YxYUUp26EgElEHsfQ8ywPTJfs6D1C2H2yMR";
//Moralis_s2.start({ serverUrl, appId });


const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {
  console.log(req.body)
  console.log(req.files)

  console.log("getting data from the cloud server...");

  const data = await GetAllAggregateData();
  console.log(data);
  res.end(JSON.stringify(data, null, 3));
})

//async function GetAllAggregateData(){ 
//  return Moralis_s2.Cloud.run("getAllAggregateData"); 
//}


export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute
