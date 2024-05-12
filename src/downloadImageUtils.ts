import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { handleWriter } from 'writerUtils';
import { Comic } from 'comic';
import { sleepBetweenMs } from 'commonUtils';
import { printColoredMessage } from 'consoleUtils';
import { IMAGES_LIST_VARIABLE_NAME, ConsoleColours } from 'const';
import { getPageVariable, closeBrowser } from 'htmlUtils';

const getPaddedFileName = (fileName: string): string => fileName.padStart(5, '0');
const generateImageName = (imageIndexes: [string, string]): string =>
  imageIndexes.map(getPaddedFileName).join('-');
const getImageName = (fileName: string, fileSuffix: string): string =>
  `${getPaddedFileName(fileName)}.${fileSuffix}`;

const getImageFileSuffix = (imageFileName: string): string =>
  imageFileName.split('filename=')[1].split('"').join('').split('.')[1];

export const downloadImage = async (
  imageUrl: string,
  imageIndexes: [string, string],
  savedFolder: string,
): Promise<void> => {
  const responseImg = await axios.get(imageUrl, { responseType: 'stream' });
  const fileSuffix = getImageFileSuffix(responseImg.headers['content-disposition']);
  const imageName = getImageName(generateImageName(imageIndexes), fileSuffix);
  const imagePath = path.resolve(savedFolder, imageName);
  const imageWriter = fs.createWriteStream(imagePath);
  responseImg.data.pipe(imageWriter);

  return handleWriter(imageWriter);
};

const IMAGE_URLS_WAIT_SELECTOR = '#divImage';

// Download all comics image urls
export const getComicsImageUrls = async (comics: Comic[]): Promise<Record<string, string[][]>> => {
  const comicsImageUrls: Record<string, string[][]> = {};

  let isFirstComic = true;
  for (const { name, urls } of comics) {
    if (isFirstComic) {
      isFirstComic = false;
    } else {
      await sleepBetweenMs(5000, 10000);
    }

    printColoredMessage(ConsoleColours.RESET, `Download comic image urls for ${name}`);
    const imageUrls: string[][] = [];
    for (const comicUrl of urls) {
      const innerImageUrls: string[] | null = await getPageVariable<string[]>(
        comicUrl,
        IMAGE_URLS_WAIT_SELECTOR,
        IMAGES_LIST_VARIABLE_NAME,
      );

      if (innerImageUrls) {
        imageUrls.push(innerImageUrls);
      } else {
        printColoredMessage(ConsoleColours.RED, `Images not found for ${name} comic...`);
        delete comicsImageUrls[name];
        continue;
      }

      comicsImageUrls[name] = imageUrls;
    }
  }

  await closeBrowser();
  return comicsImageUrls;
};
