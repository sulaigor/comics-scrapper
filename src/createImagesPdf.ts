import * as fs from 'fs';
import * as path from 'path';
import sizeOf from 'image-size';
import { fromFile } from 'file-type';
import * as PDFKit from 'pdfkit';
import { handleWriter } from 'writerUtils';

const isImageFile = async (filePath: string): Promise<boolean> => {
  try {
    const result = await fromFile(filePath);

    if (result) {
      const { mime } = result;
      return mime.includes('image');
    }

    return false;
  } catch (err) {
    console.log('Is image file error:', err);
    return false;
  }
};

export const createImagesPdf = async (imagesFolderPath: string, outputPdfPath: string): Promise<void> => {
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

      doc.addPage({ size: [Number(width), Number(height)] });
      doc.image(filePath, 0, 0, { width, height });
    } catch (err) {
      console.log('Create pdf error:', imageFile, err);
    }
  }

  doc.end();
  return handleWriter(pdfWriter);
};
