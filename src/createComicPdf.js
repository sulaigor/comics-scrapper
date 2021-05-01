const path = require('path');
const cliProgress = require('cli-progress');

const { createFolder } = require('./folderUtils');
const { PDF_FOLDER_PATH, TEMP_FOLDER_PATH } = require('./const');
const downloadImage = require('./downloadImage');
const createImagesPdf = require('./createImagesPdf');

const getComicFolderPath = (comicName) => path.resolve(TEMP_FOLDER_PATH, comicName);
const getComicPdfPath = (comicName) => path.resolve(PDF_FOLDER_PATH, `${comicName}.pdf`);

const getImagesProgressBar = (imagesCount) => {
  const progressBar = new cliProgress.SingleBar({
    format: 'Creating [{bar}] {percentage}% | {value}/{total}',
  });

  progressBar.start(imagesCount, 0);
  return progressBar;
};

const createComicPdf = async (imageUrls, comicName) => {
  const progressBar = getImagesProgressBar(imageUrls.length);
  const imagesFolderPath = getComicFolderPath(comicName);
  createFolder(imagesFolderPath);

  try {
    for (const imageIndex in imageUrls) {
      await downloadImage(imageUrls[imageIndex], imageIndex, imagesFolderPath);
      progressBar.increment();
    }

    await createImagesPdf(imagesFolderPath, getComicPdfPath(comicName));
    progressBar.stop();
  } catch (err) {
    console.log('Create pdf error:', err);
  }
};

module.exports = createComicPdf;
