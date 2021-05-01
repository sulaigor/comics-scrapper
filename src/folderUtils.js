const fs = require('fs');
const { PDF_FOLDER_PATH, TEMP_FOLDER_PATH } = require('./const');

const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

const removeFolder = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    fs.rmdirSync(folderPath, { recursive: true });
  }
};

const createOutputFolder = () => createFolder(PDF_FOLDER_PATH);
const createTempFolder = () => createFolder(TEMP_FOLDER_PATH);
const removeTempFolder = () => removeFolder(TEMP_FOLDER_PATH);

module.exports = { createFolder, createOutputFolder, createTempFolder, removeTempFolder };
