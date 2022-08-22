import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'

const DOMPurify = require('isomorphic-dompurify');
var Moralis = require("moralis/node");
const _ = require("lodash");

const serverUrl = "https://gbmvbywfzibe.usemoralis.com:2053/server";
const appId = "6KNO1YxYUUp26EgElEHsfQ8ywPTJfs6D1C2H2yMR";
Moralis.start({ serverUrl, appId });


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

async function GetAllAggregateData(){ 
  return Moralis.Cloud.run("getAllAggregateData"); 
}


export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute
