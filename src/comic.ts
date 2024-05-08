import { COMICS_URL_PREFIX } from 'const';

interface IBaseComic {
  name: string;
}

export interface IComic extends IBaseComic {
  url: string;
}

export interface IUrlsComic extends IBaseComic {
  urls: string[];
}

type ComicConstructorClassParams = [IComic] | [IUrlsComic] | [string, string | string[]];

const getComicUrl = (urlOrPath: string): string =>
  `${!urlOrPath.includes(COMICS_URL_PREFIX) ? COMICS_URL_PREFIX : ''}${urlOrPath}`;

const getComicUrls = (urlOrUrls: string | string[]): string[] => {
  const comics = Array.isArray(urlOrUrls) ? urlOrUrls : [urlOrUrls];
  return comics.map(getComicUrl);
};

export class Comic {
  public readonly name: string;
  public readonly urls: string[] = [];

  constructor(comicDto: IComic);
  constructor(urlsComicDto: IUrlsComic);
  constructor(name: string, urlOrPath: string | string[]);
  constructor(...params: ComicConstructorClassParams) {
    if (params.length === 2) {
      const [name, urlsOrPaths] = params;
      this.name = name;
      this.urls = getComicUrls(urlsOrPaths);
      return;
    }

    if (params.length === 1 && typeof params[0] === 'object') {
      const { name } = params[0];
      this.name = name;

      if ('url' in params[0]) {
        const { url } = params[0];
        this.urls = getComicUrls(url);
      }

      if ('urls' in params[0]) {
        const { urls } = params[0];
        this.urls = getComicUrls(urls);
      }
      return;
    }

    throw new Error('Comic has invalid params!');
  }
}
