const s3ls = require('s3-ls');

async function getTest() {
  const lister = s3ls({ bucket: 'estudoss3moisestestes' });
  const { files, folders } = await lister.ls('/my-folder/subfolder/folder1');
}

getTest();
