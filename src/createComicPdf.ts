import * as path from 'path';
import { SingleBar } from 'cli-progress';
import { createFolder } from './folderUtils';
import { PDF_FOLDER_PATH, TEMP_FOLDER_PATH } from './const';
import { downloadImage } from './downloadImage';
import { createImagesPdf } from './createImagesPdf';

const getComicFolderPath = (comicName: string) => path.resolve(TEMP_FOLDER_PATH, comicName);
const getComicPdfPath = (comicName: string) => path.resolve(PDF_FOLDER_PATH, `${comicName}.pdf`);

const getImagesProgressBar = (imagesCount: number) => {
  const progressBar = new SingleBar({
    format: 'Creating [{bar}] {percentage}% | {value}/{total}',
  });

  progressBar.start(imagesCount, 0);
  return progressBar;
};

export const createComicPdf = async (imageUrls: string[], comicName: string) => {
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
