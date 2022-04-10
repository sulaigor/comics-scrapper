import { Comic, IComic } from 'comic';
import { ConsoleColours } from 'const';
import { printColoredMessage } from 'consoleUtils';
import { getImageUrls } from 'getImageUrls';
import { createComicPdf } from 'createComicPdf';

export const createComicPdfs = async (rawComics: IComic[]) => {
  const comics: Comic[] = rawComics.map((comic) => (!(comic instanceof Comic) ? new Comic(comic) : comic));

  for (const { name, url } of comics) {
    const imageUrls = await getImageUrls(url);

    console.log('\nStart creating comic', name);

    if (imageUrls) {
      await createComicPdf(imageUrls, name);
      printColoredMessage(ConsoleColours.GREEN, `Comic ${name} succesfully created!`);
    } else {
      printColoredMessage(ConsoleColours.RED, `Images not found for ${name} comic...`);
    }
  }
};
