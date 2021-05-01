const path = require('path');
const fs = require('fs');
const axios = require('axios');

const getPaddedFileName = (fileName) => fileName.padStart(5, '0');
const getImageName = (fileName, fileSuffix) => `${getPaddedFileName(fileName)}.${fileSuffix}`;

const getImageFileSuffix = (imageFileName) =>
  imageFileName.split('filename=')[1].split('"').join('').split('.')[1];

const downloadImage = async (imageUrl, index, savedFolder) => {
  const responseImg = await axios.get(imageUrl, { responseType: 'stream' });
  const fileSuffix = getImageFileSuffix(responseImg.headers['content-disposition']);
  const imageName = getImageName(index.toString(), fileSuffix);
  const imagePath = path.resolve(savedFolder, imageName);
  const imageWriter = fs.createWriteStream(imagePath);
  responseImg.data.pipe(imageWriter);

  return new Promise((resolve) => imageWriter.on('close', () => resolve));
};

module.exports = downloadImage;
