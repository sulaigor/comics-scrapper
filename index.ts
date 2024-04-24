import rawComics from 'comics';
import { createTempFolder, createOutputFolder, removeTempFolder } from 'folderUtils';
import { createComicPdfs } from 'createComicPdfUtils';
import { exitScript } from 'consoleUtils';

(async () => {
  createOutputFolder();
  createTempFolder();
  await createComicPdfs(rawComics);
  removeTempFolder();
  exitScript();
})();
