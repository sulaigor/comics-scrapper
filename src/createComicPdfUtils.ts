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

const getImagesProgressBar = (imagesCount: number) => {
  const progressBar = new SingleBar({
    format: 'Creating [{bar}] {percentage}% | {value}/{total}',
  });

  progressBar.start(imagesCount, 0);
  return progressBar;
};

const createComicPdf = async (imageUrls: string[], comicName: string) => {
  const progressBar = getImagesProgressBar(imageUrls.length);
  const imagesFolderPath = getComicFolderPath(comicName);
  createFolder(imagesFolderPath);

  try {
    for (const imageIndex in imageUrls) {
      await downloadImage(imageUrls[imageIndex], imageIndex, imagesFolderPath);
      await sleepBetweenMs(500, 1500);
      progressBar.increment();
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

export const createComicPdfs = async (rawComics: IComic[]) => {
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
