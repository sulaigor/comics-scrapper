const { createTempFolder, createOutputFolder, removeTempFolder } = require('./src/folderUtils');
const createComicPdfs = require('./src/createComicPdfs');
const comics = require('./comics');

(async () => {
  createOutputFolder();
  createTempFolder();
  await createComicPdfs(comics);
  removeTempFolder();
})();
