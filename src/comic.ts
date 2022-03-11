import { COMICS_URL_PREFIX } from 'const';

export interface IComic {
  name: string;
  url: string;
}

export class Comic implements IComic {
  url: string;

  constructor(public name: string, path: string) {
    this.url = COMICS_URL_PREFIX + path;
  }
}
