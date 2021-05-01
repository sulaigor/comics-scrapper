const getImageUrls = require('./getImageUrls');
const createComicPdf = require('./createComicPdf');

const CONSOLE_COLOURS = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
};

const createComicPdfs = async (comics) => {
  for (const { name, url } of comics) {
    const imageUrls = await getImageUrls(url);

    console.log(CONSOLE_COLOURS.BLUE);
    console.log('Start creating comic', name, CONSOLE_COLOURS.RESET, '\n');

    if (imageUrls) {
      await createComicPdf(imageUrls, name);
    } else {
      console.log(CONSOLE_COLOURS.RED);
      console.log('Images not found for', name, 'comic...');
    }

    console.log(CONSOLE_COLOURS.GREEN);
    console.log('Comic', name, 'succesfully created!', CONSOLE_COLOURS.RESET);
  }
};

module.exports = createComicPdfs;
