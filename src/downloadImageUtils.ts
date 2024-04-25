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
const getImageName = (fileName: string, fileSuffix: string): string =>
  `${getPaddedFileName(fileName)}.${fileSuffix}`;

const getImageFileSuffix = (imageFileName: string): string =>
  imageFileName.split('filename=')[1].split('"').join('').split('.')[1];

export const downloadImage = async (imageUrl: string, index: string, savedFolder: string): Promise<void> => {
  const responseImg = await axios.get(imageUrl, { responseType: 'stream' });
  const fileSuffix = getImageFileSuffix(responseImg.headers['content-disposition']);
  const imageName = getImageName(index.toString(), fileSuffix);
  const imagePath = path.resolve(savedFolder, imageName);
  const imageWriter = fs.createWriteStream(imagePath);
  responseImg.data.pipe(imageWriter);

  return handleWriter(imageWriter);
};

const DEFAULT_WAIT_SELECTOR = '#containerRoot';

// Download all comics image urls
export const getComicsImageUrls = async (comics: Comic[]): Promise<Record<string, string[]>> => {
  const comicsImageUrls: Record<string, string[]> = {};

  for (const { name, url } of comics) {
    const imageUrls = await getPageVariable<string[]>(url, DEFAULT_WAIT_SELECTOR, IMAGES_LIST_VARIABLE_NAME);

    printColoredMessage(ConsoleColours.RESET, `Download comic image urls for ${name}`);
    if (imageUrls) {
      comicsImageUrls[name] = imageUrls;
    } else {
      printColoredMessage(ConsoleColours.RED, `Images not found for ${name} comic...`);
    }

    await sleepBetweenMs(1000, 4000);
  }

  await closeBrowser();
  return comicsImageUrls;
};
