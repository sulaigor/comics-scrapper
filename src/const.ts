import * as path from 'path';

// Contants
const ROOT_PATH = path.resolve(__dirname, '..');
export const TEMP_FOLDER_PATH = path.resolve(ROOT_PATH, 'temp');
export const PDF_FOLDER_PATH = path.resolve(ROOT_PATH, 'pdf');

export const COMICS_URL_PREFIX = 'https://readcomiconline.to/Comic';

export const NEW_COMIC_SOURCE_FILE = 'newComicSource.ts';

export const IMAGES_LIST_VARIABLE_NAME = 'lstImages';

// Enums
export enum ConsoleColours {
  RESET = '\x1b[0m',
  RED = '\x1b[31m',
  GREEN = '\x1b[32m',
  YELLOW = '\x1b[33m',
  BLUE = '\x1b[34m',
}
