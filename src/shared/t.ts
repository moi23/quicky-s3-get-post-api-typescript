const s3tree = require('s3-tree');
import aws from 'aws-sdk';

const AWS = aws;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const generator = s3tree({
  s3,
  bucket: 'estudoss3moisestestes',
});

const tree = generator
  .generate('/my-folder/subfolder/folder/1')
  .then(function (event) {
    console.log('sucess', event);
  })
  .catch(function (error) {
    console.log('error:', error);
  });
console.log(JSON.stringify(tree, null, 2));
