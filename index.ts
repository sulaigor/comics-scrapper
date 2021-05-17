import comics from 'comics';
import { createTempFolder, createOutputFolder, removeTempFolder } from 'folderUtils';
import { createComicPdfs } from 'createComicPdfs';

(async () => {
  createOutputFolder();
  createTempFolder();
  await createComicPdfs(comics);
  removeTempFolder();
  process.exit(0);
})();
