const path = require('path');
const fs = require('fs');
const axios = require('axios');
const HTMLParser = require('node-html-parser');
const queryString = require('query-string');
const ImagesToPDF = require('images-pdf').ImagesToPDF;
const comics = require('./comics');

const urlRegex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
const tempPath = path.resolve(__dirname, 'temp');
const outputPath = path.resolve(__dirname, 'pdf');

const getUrls = (input) => input.match(new RegExp(urlRegex));
const getPaddedFileName = (fileName) => fileName.padStart(5, '0');

const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

const downloadImage = async (imageUrl, index, savedFolder) => {
  const responseImg = await axios.get(imageUrl, {
    responseType: 'stream',
  });

  const fileSuffix = responseImg.headers['content-disposition']
    .split('filename=')[1]
    .split('"')
    .join('')
    .split('.')[1];

  const imageName = `${getPaddedFileName(index.toString())}.${fileSuffix}`;
  const imagePath = path.resolve(savedFolder, imageName);
  responseImg.data.pipe(fs.createWriteStream(imagePath));

  console.log('Image', imageName, 'saved!');
};

const createPdf = async (scriptWithUrls, comicName) => {
  const urls = getUrls(scriptWithUrls.textContent);
  const comicFolderPath = path.resolve(tempPath, comicName);

  createFolder(comicFolderPath);
  try {
    for (const imageIndex in urls) {
      await downloadImage(urls[imageIndex], imageIndex, comicFolderPath);
    }

    new ImagesToPDF().convertFolderToPDF(comicFolderPath, path.resolve(outputPath, `${comicName}.pdf`));
  } catch (err) {
    console.log('Create pdf error:', err);
  }
};

const getHtml = async (comic, createPdfCallback = createPdf) => {
  const { name: comicName, url: comicUrl } = comic;

  try {
    const requestUrl = queryString.stringifyUrl({ url: comicUrl, query: { quality: 'hq' } });
    const { data: html } = await axios.get(requestUrl);
    const root = HTMLParser.parse(html);
    const scripts = root.querySelectorAll('script');
    const scriptWithUrls = scripts.find((scr) => scr.textContent.includes('lstImages'));

    if (scriptWithUrls) {
      await createPdfCallback(scriptWithUrls, comicName);
    }
  } catch (err) {
    console.log('Get html error:', err);
  }
};

(async () => {
  createFolder(outputPath);
  createFolder(tempPath);

  for (const comic of comics) {
    const { name } = comic;
    await getHtml(comic, createPdf);

    console.log('Comic', name, 'succesfully created!');
  }
})();
