import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'

//const Moralis = require('@moralis/sdk');
//const MoralisCode = require('@moralisweb3/core');
const Moralis = require("moralis").default;
//const EvmChain = require('@moralisweb3/evm-utils');
import { EvmChain } from '@moralisweb3/evm-utils'

const DOMPurify = require('isomorphic-dompurify');

const apiRoute = nextConnect()
apiRoute.use(middleware)

apiRoute.post(async (req, res) => {
  console.log(req.body)
  console.log(req.files)

  const transactionHash = DOMPurify.sanitize(req.body.transactionHash[0].toString());
  const test = DOMPurify.sanitize(req.body.test[0].toString());
  const user = DOMPurify.sanitize(req.body.user[0].toString());

  console.log("transactionHash: " + transactionHash);
  console.log("test: " + test);
  console.log("user: " + user);


  const address = user;                 //'0x1234567890123456789012345678901234567890';
  const chain = EvmChain.create(137);   //const chain = EvmChain.ETHEREUM;
  const limit = 3;                      // get only the last 1 transaction

  console.log("starting...")

  
  await Moralis.start({
    apiKey: '8fAzFDO7LOj2U2GZ3PkjaCB1Xwe7iMkEk9LjR8K6V0jiftRnJTZT1RIFZr5hZ8aA',
    // ...and any other configuration
  });

  const response = await Moralis.EvmApi.account.getTransactions({
    address,
    chain,
    limit,
  });
  
  console.log(response.result);
  //console.log(response.result[0]);


  const lastHash = response.result[0]._data.hash;
  console.log(`lastHash: ${lastHash}`);

  for (let i = 0; i < 3 * 24 * 60 * 4; i++) { // keep checking for 3 days max - every 15s
    
    // sleep 15s
    console.log(`sleep 15s`);
    await new Promise(resolve => setTimeout(resolve, 15 * 1000));

    // check last hash
    const newResponse = await Moralis.EvmApi.account.getTransactions({
      address,
      chain,
      limit,
    });

    const newLastHash = newResponse.result[0]._data.hash;
    console.log(`newLastHash: ${newLastHash}`);

    // compare hashes
    if(lastHash == newLastHash){
    } else if(newLastHash == transactionHash){
      console.log("Tx confirmed");
      break;
    } else {
      console.log("Some other Tx came in between, replacement most likely...");
      break;
    }
  }


  console.log("came to the end...")

  res.status(201).end("API data received");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute


