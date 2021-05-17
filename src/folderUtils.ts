import * as fs from 'fs';
import { PDF_FOLDER_PATH, TEMP_FOLDER_PATH } from 'const';

export const createFolder = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

const removeFolder = (folderPath: string) => {
  if (fs.existsSync(folderPath)) {
    fs.rmdirSync(folderPath, { recursive: true });
  }
};

export const createOutputFolder = () => createFolder(PDF_FOLDER_PATH);
export const createTempFolder = () => createFolder(TEMP_FOLDER_PATH);
export const removeTempFolder = () => removeFolder(TEMP_FOLDER_PATH);
