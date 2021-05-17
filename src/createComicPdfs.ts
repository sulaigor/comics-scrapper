import { getImageUrls } from 'getImageUrls';
import { createComicPdf } from 'createComicPdf';
import { IComic } from 'comic';

const CONSOLE_COLOURS = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
};

export const createComicPdfs = async (comics: IComic[]) => {
  for (const { name, url } of comics) {
    const imageUrls = await getImageUrls(url);

    console.log('\nStart creating comic', name);

    if (imageUrls) {
      await createComicPdf(imageUrls, name);
    } else {
      console.log(CONSOLE_COLOURS.RED);
      console.log('Images not found for', name, 'comic...');
    }

    console.log(CONSOLE_COLOURS.GREEN);
    console.log('Comic', name, 'succesfully created!', CONSOLE_COLOURS.RESET);
  }
};
