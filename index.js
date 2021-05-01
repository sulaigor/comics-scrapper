const { createTempFolder, createOutputFolder, removeTempFolder } = require('./src/folderUtils');
const getImageUrls = require('./src/getImageUrls');
const createComicPdf = require('./src/createComicPdf');
const comics = require('./comics');

(async () => {
  createOutputFolder();
  createTempFolder();

  for (const comic of comics) {
    const { name, url } = comic;
    const imageUrls = await getImageUrls(url);

    if (imageUrls) {
      await createComicPdf(imageUrls, name);
    } else {
      console.log('Images not found for', name, 'comic...');
    }

    console.log('Comic', name, 'succesfully created!');
  }

  removeTempFolder();
})();
