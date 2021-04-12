const ImagesToPDF = require('images-pdf').ImagesToPDF;

const createImagesPdf = (imagesFolderPath, comicPdfPath) =>
  new ImagesToPDF().convertFolderToPDF(imagesFolderPath, comicPdfPath);

module.exports = createImagesPdf;
