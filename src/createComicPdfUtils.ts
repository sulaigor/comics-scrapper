import * as fs from 'fs';
import * as path from 'path';
import { SingleBar } from 'cli-progress';
import { lookup as mimeLookup } from 'mime-types';
import * as PDFKit from 'pdfkit';
import sizeOf from 'image-size';
import { IComic, Comic } from 'comic';
import { ConsoleColours, PDF_FOLDER_PATH, TEMP_FOLDER_PATH } from 'const';
import { createFolder } from 'folderUtils';
import { downloadImage, getComicsImageUrls } from 'downloadImageUtils';
import { printColoredMessage } from 'consoleUtils';
import { sleepBetweenMs } from 'commonUtils';
import { handleWriter } from 'writerUtils';

const getComicFolderPath = (comicName: string) => path.resolve(TEMP_FOLDER_PATH, comicName);
const getComicPdfPath = (comicName: string) => path.resolve(PDF_FOLDER_PATH, `${comicName}.pdf`);

const getImagesProgressBar = (imageUrls: string[][]) => {
  const progressBar = new SingleBar({
    format: 'Download images [{bar}] {percentage}% | {value}/{total}',
  });

  const imagesCount = imageUrls.reduce((acc, innerImageUrls) => acc + innerImageUrls.length, 0);
  progressBar.start(imagesCount, 0);
  return progressBar;
};

const createComicPdf = async (imageUrls: string[][], comicName: string) => {
  const progressBar = getImagesProgressBar(imageUrls);
  const imagesFolderPath = getComicFolderPath(comicName);
  createFolder(imagesFolderPath);

  try {
    for (const imageIndex in imageUrls) {
      for (const innerImageIndex in imageUrls[imageIndex]) {
        const imageUrl = imageUrls[imageIndex][innerImageIndex];
        await downloadImage(imageUrl, [imageIndex, innerImageIndex], imagesFolderPath);
        await sleepBetweenMs(1000, 1500);
        progressBar.increment();
      }
    }

    await createImagesPdf(imagesFolderPath, getComicPdfPath(comicName));
    progressBar.stop();
  } catch (err) {
    console.log('Create pdf error:', err);
  }
};

const isImageFile = async (filePath: string): Promise<boolean> => {
  try {
    const mime = mimeLookup(filePath);
    return mime ? mime.includes('image') : false;
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

export const createComicPdfs = async (rawComics: Comic[]) => {
  const comics: Comic[] = rawComics.map((comic) => (!(comic instanceof Comic) ? new Comic(comic) : comic));

  // Download all comics image urls
  const comicsImageUrls = await getComicsImageUrls(comics);

  // Create comic pdfs
  for (const [comicName, comicImageUrls] of Object.entries(comicsImageUrls)) {
    printColoredMessage(ConsoleColours.RESET, `Start creating comic ${comicName}`);
    await createComicPdf(comicImageUrls, comicName);
    printColoredMessage(ConsoleColours.GREEN, `Comic ${comicName} succesfully created!`);
  }
};
