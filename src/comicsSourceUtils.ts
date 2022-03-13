import { HTMLElement } from 'node-html-parser';
import { ConsoleColours } from 'const';
import { printColoredMessage } from 'consoleUtils';

export interface IComicSource {
  link: string;
  title: string;
}

export const createComicsSource = (comicsSource: IComicSource[]): string => {
  const emptyLine = '';
  const ident = '  ';

  return [
    "import { Comic, IComic } from 'comic'",
    emptyLine,
    'const comics: IComic[] = [',
    ...comicsSource.map(({ title, link }) => `${ident}new Comic('${title}', '${link}'),`),
    '];',
    emptyLine,
    'export default comics;',
    emptyLine,
  ].join('\n');
};

export const getComicsSource = (linksArr: HTMLElement[]): IComicSource[] =>
  Array.from(linksArr)
    .map((a) => ({
      title: a.text.trim().replace('#', '').split(' ').join('-'),
      link: a.attrs.href,
    }))
    .reverse();

export const printComicsSource = (comicsSource: IComicSource[]): void => {
  console.log('\nYour comics source look like:');
  const comicsList: string = comicsSource
    .slice(0, 5)
    .map(({ link, title }, index) => `${index + 1}. title: ${title}, link: ${link}`)
    .join('\n');
  printColoredMessage(ConsoleColours.BLUE, `${comicsList}...`);
};

export const editComicsSource = (comicsSource: IComicSource[], titlePrefix: string): IComicSource[] =>
  comicsSource.map((source) => ({ ...source, title: `${titlePrefix}-${source.title}` }));
