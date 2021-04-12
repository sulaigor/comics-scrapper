const axios = require('axios');
const HTMLParser = require('node-html-parser');
const queryString = require('query-string');

const { URL_REGEX } = require('./const');

const getUrls = (scriptContent) => scriptContent.match(new RegExp(URL_REGEX));
const getComicUrl = (comicUrl) => queryString.stringifyUrl({ url: comicUrl, query: { quality: 'hq' } });

const getScriptWithImages = (html) => {
  const root = HTMLParser.parse(html);
  const scripts = root.querySelectorAll('script');
  return scripts.find((scr) => scr.textContent.includes('lstImages'));
};

const getImageUrls = async (comicUrl) => {
  try {
    const { data: html } = await axios.get(getComicUrl(comicUrl));
    const scriptWithUrls = getScriptWithImages(html);

    if (scriptWithUrls) return getUrls(scriptWithUrls.textContent);
  } catch (err) {
    console.log('Get html error:', err);
  }

  return null;
};

module.exports = getImageUrls;
