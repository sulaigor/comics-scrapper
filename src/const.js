const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '..');
const TEMP_FOLDER_PATH = path.resolve(ROOT_PATH, 'temp');
const PDF_FOLDER_PATH = path.resolve(ROOT_PATH, 'pdf');

const URL_REGEX = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;

module.exports = { TEMP_FOLDER_PATH, PDF_FOLDER_PATH, URL_REGEX };
