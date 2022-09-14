import middleware from '../../middleware/middleware.js'
import nextConnect from 'next-connect'
const DOMPurify = require('isomorphic-dompurify');
var Moralis = require("moralis/node");
const fs = require("fs");
const AWS = require('aws-sdk');
var crypto = require("crypto");
import {SaveMessageToMoralisDB} from "../../JS/DB-pushFunctions.js"



const DO_SPACES_ID="PMPSVLSBZWCFNIRNYBYM"
const DO_SPACES_SECRET="MRWAGMp+cj3b9ObGuq2EvHH235LjEEY+8+v6dlrjALc"
const DO_SPACES_URL="https://fra1.digitaloceanspaces.com"
const DO_SPACES_BUCKET="easylaunchnftdospace1"
const PUBLIC_URL="https://easylaunchnftdospace1.fra1.digitaloceanspaces.com"

const s3Client = new AWS.S3({
  endpoint: DO_SPACES_URL,
  region: "fra1",
  credentials: {
    accessKeyId: DO_SPACES_ID,
    secretAccessKey: DO_SPACES_SECRET
  }
});


const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {
  console.log(req.body)
  console.log("--------------------------------")
  console.log(req.files)

  const message = DOMPurify.sanitize(req.body.message[0].toString());
  const sender = DOMPurify.sanitize(req.body.sender[0].toString());
  const receiver = DOMPurify.sanitize(req.body.receiver[0].toString());
  console.log(`message: ${message}`)
  console.log(`sender: ${sender}`)
  console.log(`receiver: ${receiver}`)


  var images = [];
  if(req.files.hasOwnProperty('file0')){
    images.push(req.files.file0[0])
  }
  if(req.files.hasOwnProperty('file1')){
    images.push(req.files.file1[0])
  }
  if(req.files.hasOwnProperty('file2')){
    images.push(req.files.file2[0])
  }
  if(req.files.hasOwnProperty('file3')){
    images.push(req.files.file3[0])
  }
  if(req.files.hasOwnProperty('file4')){
    images.push(req.files.file4[0])
  }

  console.log("images:")
  console.log(images) // all images

  var image = [];

  for (let i = 0; i < images.length; i++) {
    //const fileName = images[i].originalFilename.replace(/\s/g, '');   // remove empty space
    const image = await UploadImageToDigitalOcean(images[i].path)

    console.log("link to the file on DO:")
    console.log(image)
    image.push(image)
  }

  await SaveMessageToMoralisDB(message, sender, receiver, image);

  res.status(201).end("message created");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute



async function UploadImageToDigitalOcean(filePath){

  // get random string for key
  const ext = filePath.split(".");
  const fileName = crypto.randomBytes(20).toString('hex') + "." + ext[ext.length - 1];

  try {
    s3Client.putObject({ // await
    Bucket: DO_SPACES_BUCKET + "/Payzura",
    Key: fileName,
    Body: fs.createReadStream(filePath),
    ACL: "public-read"
    }, (err, data) => {
      console.log(err)
      console.log(data)
      //console.log("saved file at server: " + fileName)
      //const image = `https://easylaunchnftdospace1.fra1.digitaloceanspaces.com/Payzura/${fileName}`;
      //return image;
    }) //.promise();

    const image = `https://easylaunchnftdospace1.fra1.digitaloceanspaces.com/Payzura/${fileName}`;
    return image;

  } catch {
    console.log(e);
    res.status(500).send("Error uploading file");
  } 
}

