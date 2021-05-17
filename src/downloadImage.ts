import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { handleWriter } from 'writerUtils';

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
