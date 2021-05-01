const path = require('path');

const { createFolder } = require('./folderUtils');
const { PDF_FOLDER_PATH, TEMP_FOLDER_PATH } = require('./const');
const downloadImage = require('./downloadImage');
const createImagesPdf = require('./createImagesPdf');

const getComicFolderPath = (comicName) => path.resolve(TEMP_FOLDER_PATH, comicName);
const getComicPdfPath = (comicName) => path.resolve(PDF_FOLDER_PATH, `${comicName}.pdf`);

const createComicPdf = async (imageUrls, comicName) => {
  const imagesFolderPath = getComicFolderPath(comicName);
  createFolder(imagesFolderPath);

  try {
    for (const imageIndex in imageUrls) {
      await downloadImage(imageUrls[imageIndex], imageIndex, imagesFolderPath);
    }

    await createImagesPdf(imagesFolderPath, getComicPdfPath(comicName));
  } catch (err) {
    console.log('Create pdf error:', err);
  }
};

module.exports = createComicPdf;
