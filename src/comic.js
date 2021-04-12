class Comic {
  constructor(name, path) {
    this.name = name;
    this.url = 'https://readcomiconline.to/Comic' + path;
  }
}

module.exports = Comic;
