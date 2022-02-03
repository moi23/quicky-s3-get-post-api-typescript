require('dotenv/config');
import express from 'express';
import aws from 'aws-sdk';
const s3ls = require('s3-ls');
// const uuid = require('uuid/v4');

const AWS = aws;
const multer = require('multer');

const app = express();
const port = 3000;

app.use(express.json());

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '');
  },
});

const upload = multer({ storage }).single('image');

app.post('/upload', upload, (req, res) => {
  let myFile = req.file.originalname.split('.'); //quebra a string em um array de 2

  const fileType = myFile[myFile.length - 1]; // pega sempre o ultimo

  console.log('file:', req.file, 'files:', req.files);
  console.log('filetype', myFile);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${myFile[0]}.${fileType}`,
    Body: req.file.buffer,
  };

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).json({
        message: 'algo deu errado',
        error: error,
      });
    }

    res.status(200).json({
      status: res.status,
      message: 'Arquivo enviado com sucesso',
      payload: data,
    });
  });
});

app.get('/getfolders', (req, res) => {
  const response = s3
    .listObjectsV2({
      Bucket: process.env.AWS_BUCKET_NAME,
    })
    .promise()
    .then((payload) => {
      // console.log(payload);

      return res.status(200).json({
        status: res.status,
        message: 'sucess, your getted all items',
        payload: payload.Contents,
      });
    })
    .catch((error) => {
      console.log('error');
    });
  // console.log(response);
  return response;
});

app.get('/getfolderstwo', async (req, res) => {
  // const lister = s3ls({ bucket: process.env.AWS_BUCKET_NAME });
  // const { files, folders } = await lister.ls('/my-folder/subfolder/');

  // console.log(files); // ['my-folder/subfolder/file1','my-folder/subfolder/file2']
  // console.log(folders); // ['my-folder/subfolder/subsub1/','my-folder/subfolder/subsub2/']

  const response = s3
    .listObjectsV2({
      Bucket: process.env.AWS_BUCKET_NAME,
    })
    .promise()
    .then((payload) => {
      // console.log(payload);

      return res.status(200).json({
        status: res.status,
        message: 'sucess, your getted all items',
        payload: payload.Contents,
      });
    })
    .catch((error) => {
      console.log('error');
    });
  // console.log(response);
  return response;
});

// async function teste() {
//   const generator = s3tree({ bucket: process.env.AWS_BUCKET_NAME });

//   const tree = await generator.generate('/my-folder/subfolder/');
//   console.log(JSON.stringify(tree, null, 2));
// }

// teste();

app.listen(port, () => {
  console.log(`Server Running in port ${port}`);
});
