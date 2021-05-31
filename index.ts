import comics from 'comics';
import { createTempFolder, createOutputFolder, removeTempFolder } from 'folderUtils';
import { createComicPdfs } from 'createComicPdfs';

(async () => {
  console.log(
    '\nI have',
    comics.length,
    'commics for download:',
    comics.reduce((acc, { name }) => acc + name + '\n', '\n'),
  );

  createOutputFolder();
  createTempFolder();
  await createComicPdfs(comics);
  removeTempFolder();

  console.log('I am done. \nHave a nice reading!\n');
  process.exit(0);
})();
