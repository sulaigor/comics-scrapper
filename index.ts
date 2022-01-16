import comics from 'comics';
import { createTempFolder, createOutputFolder, removeTempFolder } from 'folderUtils';
import { createComicPdfs } from 'createComicPdfs';

(async () => {
  createOutputFolder();
  createTempFolder();
  await createComicPdfs(comics);
  removeTempFolder();

  console.log('I am done. \nHave a nice reading!\n');
  process.exit(0);
})();
