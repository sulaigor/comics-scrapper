const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const FileType = require('file-type');
const PDFKit = require('pdfkit');

const isImageFile = async (filePath) => {
  const { mime } = await FileType.fromFile(filePath);
  return mime.includes('image');
};

const createImagesPdf = async (imagesFolderPath, outputPdfPath) => {
  const imagesFiles = fs.readdirSync(imagesFolderPath);
  const pdfWriter = fs.createWriteStream(path.resolve(outputPdfPath));

  const doc = new PDFKit({ autoFirstPage: false });
  doc.pipe(pdfWriter);

  for (const imageFile of imagesFiles) {
    const filePath = path.resolve(imagesFolderPath, imageFile);
    const isImage = await isImageFile(filePath);
    if (!isImage) continue;

    try {
      const { width, height } = await sizeOf(filePath);

      doc.addPage({ size: [width, height] });
      doc.image(filePath, 0, 0, { width, height });
    } catch (err) {
      console.log('Create pdf error:', imageFile, err);
    }
  }

  doc.end();
  return new Promise((resolve) => pdfWriter.on('close', resolve));
};

module.exports = createImagesPdf;
