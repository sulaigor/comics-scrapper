import { createTempFolder, createOutputFolder, removeTempFolder } from './src/folderUtils';
import { createComicPdfs } from './src/createComicPdfs';
import comics from './comics';

(async () => {
  createOutputFolder();
  createTempFolder();
  await createComicPdfs(comics);
  removeTempFolder();
  process.exit(0);
})();
