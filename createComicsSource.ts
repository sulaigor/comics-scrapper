import * as fs from 'fs';
import * as path from 'path';
import * as rl from 'readline';
import { NEW_COMIC_SOURCE_FILE } from 'const';
import { exitScript, tryValue } from 'consoleUtils';
import { getHtml } from 'htmlUtils';
import {
  IComicSource,
  getComicsSource,
  printComicsSource,
  editComicsSource,
  createComicsSource,
} from 'comicsSourceUtils';

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const LINKS_HOLDER_SELECTOR = 'table.listing';

// Try this url: https://readcomiconline.li/Comic/Star-Wars-Darth-Vader
readline.question('Enter comics list url:\n', async (htmlUrl) => {
  tryValue(htmlUrl, 'You must enter html url for comics list!');
  const html = await getHtml(htmlUrl, LINKS_HOLDER_SELECTOR);

  tryValue(html, 'Entered url is not correct!');
  const linksHolder = html!.querySelector(LINKS_HOLDER_SELECTOR);

  tryValue(linksHolder, 'Links holder does not exist!');
  const linksArr = linksHolder!.querySelectorAll('a');
  let comicsSource: IComicSource[] = getComicsSource(linksArr);

  printComicsSource(comicsSource);
  readline.question('Do you want edit comics title? Enter prefix or continue:\n', (titlePrefix) => {
    if (titlePrefix) {
      comicsSource = editComicsSource(comicsSource, titlePrefix);
      printComicsSource(comicsSource);
    }

    const sourceTemplate = createComicsSource(comicsSource);
    fs.writeFileSync(path.resolve(__dirname, NEW_COMIC_SOURCE_FILE), sourceTemplate);
    console.log('Your comics source is in', NEW_COMIC_SOURCE_FILE, 'file!');

    readline.close();
  });
});

readline.on('close', exitScript);
