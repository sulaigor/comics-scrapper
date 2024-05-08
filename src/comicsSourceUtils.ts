import { HTMLElement } from 'node-html-parser';
import { COMICS_URL_PREFIX, ConsoleColours } from 'const';
import { printColoredMessage } from 'consoleUtils';

export interface IComicSource {
  link: string;
  title: string;
}

export const createComicsSource = (comicsSource: IComicSource[]): string => {
  const emptyLine = '';
  const ident = '  ';

  return [
    "import { Comic } from 'comic';",
    emptyLine,
    'const comics: Comic[] = [',
    ...comicsSource.map(({ title, link }) => `${ident}new Comic('${title}', '${link}'),`),
    '];',
    emptyLine,
    'export default comics;',
    emptyLine,
  ].join('\n');
};

const getComicSourceTitle = (text: string): string =>
  text
    .trim()
    .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
    .replace(/\s+/g, '-');

export const getComicsSource = (linksArr: HTMLElement[]): IComicSource[] =>
  Array.from(linksArr)
    .map((a) => ({
      title: getComicSourceTitle(a.text),
      link: a.attrs.href.replace(new URL(COMICS_URL_PREFIX).pathname, ''),
    }))
    .reverse();

export const printComicsSource = (comicsSource: IComicSource[]): void => {
  console.log('\nYour comics source look like:');
  const comicsList: string = comicsSource
    .slice(0, 5)
    .map(({ link, title }, index) => `${index + 1}. title: ${title}, link: ${link}`)
    .join('\n');
  printColoredMessage(ConsoleColours.BLUE, `${comicsList}\n...\n`);
};

export const editComicsSource = (comicsSource: IComicSource[], titlePrefix: string): IComicSource[] =>
  comicsSource.map((source) => ({ ...source, title: `${titlePrefix}-${source.title}` }));
