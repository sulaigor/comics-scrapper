import { COMICS_URL_PREFIX } from 'const';

export interface IComic {
  name: string;
  url: string;
}

type ComicClassParams = [IComic] | [string, string];

const getComicUrl = (urlOrPath: string): string =>
  !urlOrPath.includes(COMICS_URL_PREFIX) ? COMICS_URL_PREFIX + urlOrPath : urlOrPath;

export class Comic implements IComic {
  public readonly name: string;
  public readonly url: string;

  constructor(comicDto: IComic);
  constructor(name: string, urlOrPath: string);
  constructor(...params: ComicClassParams) {
    if (params.length === 2) {
      const [name, urlOrPath] = params;
      this.name = name;
      this.url = getComicUrl(urlOrPath);
      return;
    }

    if (params.length === 1 && typeof params[0] === 'object') {
      const { name, url } = params[0];
      this.name = name;
      this.url = getComicUrl(url);
      return;
    }

    throw new Error('Comic has invalid params!');
  }
}
