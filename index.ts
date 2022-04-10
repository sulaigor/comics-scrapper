import rawComics from 'comics';
import { createTempFolder, createOutputFolder, removeTempFolder } from 'folderUtils';
import { createComicPdfs } from 'createComicPdfs';
import { exitScript } from 'consoleUtils';

(async () => {
  createOutputFolder();
  createTempFolder();
  await createComicPdfs(rawComics);
  removeTempFolder();
  exitScript();
})();
