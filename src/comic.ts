export interface IComic {
  name: string;
  url: string;
}

export class Comic implements IComic {
  name: string;
  url: string;

  constructor(name: string, path: string) {
    this.name = name;
    this.url = 'https://readcomiconline.to/Comic' + path;
  }
}
