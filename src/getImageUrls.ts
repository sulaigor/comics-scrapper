import axios from 'axios';
import { parse as parseHTML } from 'node-html-parser';
import { stringifyUrl } from 'query-string';
import { URL_REGEX } from 'const';

const getUrls = (scriptContent: string) => scriptContent.match(new RegExp(URL_REGEX));
const getComicUrl = (comicUrl: string) => stringifyUrl({ url: comicUrl, query: { quality: 'hq' } });

const getScriptWithImages = (html: string) => {
  const root = parseHTML(html);
  const scripts = root.querySelectorAll('script');
  return scripts.find((scr) => scr.textContent.includes('lstImages'));
};

export const getImageUrls = async (comicUrl: string): Promise<string[] | null> => {
  try {
    const { data: html } = await axios.get<string>(getComicUrl(comicUrl));
    const scriptWithUrls = getScriptWithImages(html);

    if (scriptWithUrls) return getUrls(scriptWithUrls.textContent);
  } catch (err) {
    console.log('Get html error:', err);
  }

  return null;
};
