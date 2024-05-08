import { Comic } from 'comic';

export const printDownloadComics = (comics: Comic[]) => {
  console.log(
    '\nI have',
    comics.length,
    'commics for download:',
    comics.reduce((acc, { name }) => acc + name + '\n', '\n'),
  );
};
