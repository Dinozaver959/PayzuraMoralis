// const fs = require("fs");
// const AWS = require('aws-sdk');
// const formidable = require('formidable');

// const DO_SPACES_ID="PMPSVLSBZWCFNIRNYBYM"
// const DO_SPACES_SECRET="MRWAGMp+cj3b9ObGuq2EvHH235LjEEY+8+v6dlrjALc"
// const DO_SPACES_URL="https://fra1.digitaloceanspaces.com"
// const DO_SPACES_BUCKET="easylaunchnftdospace1"

// const s3Client = new AWS.S3({
//   endpoint: DO_SPACES_URL,
//   region: "fra1",
//   credentials: {
//     accessKeyId: DO_SPACES_ID,
//     secretAccessKey: DO_SPACES_SECRET
//   }
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

// export default async function handler(req, res) {
//   const form = formidable();
//   form.parse(req, async(err, fields, files) => {
//     if(!files.image) {
//       return res.status(400).send("No image file uploaded");
//     }
//     try {
//       return s3Client.putObject({
//         Bucket: DO_SPACES_BUCKET,
//         Key: files.image.originalFilename,
//         Body: fs.createReadStream(files.image.filepath),
//       }, async() => res.status(201).send("Image uploaded successfully"));
//     } catch (e) {
//       console.log(e);
//       return res.status(500).send("Error uploading image");
//     }
//   });
// }