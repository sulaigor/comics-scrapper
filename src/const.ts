import * as path from 'path';

const ROOT_PATH = path.resolve(__dirname, '..');
export const TEMP_FOLDER_PATH = path.resolve(ROOT_PATH, 'temp');
export const PDF_FOLDER_PATH = path.resolve(ROOT_PATH, 'pdf');

export const URL_REGEX =
  /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;

export const COMICS_URL_PREFIX = 'https://readcomiconline.to/Comic';
