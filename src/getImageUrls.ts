import { HTMLElement } from 'node-html-parser';
import { stringifyUrl } from 'query-string';
import { beau } from 'rguard';
import { IMAGES_REGEX } from 'const';
import { getHtml } from 'htmlUtils';

const getUrls = (scriptContent: string): string[] | null => {
  const images =
    scriptContent.match(new RegExp(IMAGES_REGEX))?.map((img) => img.replace(IMAGES_REGEX, '$1')) || null;
  if (images) beau(images);
  return images;
};

const getComicUrl = (comicUrl: string) => stringifyUrl({ url: comicUrl, query: { quality: 'hq' } });

const getScriptWithImages = (html: HTMLElement): HTMLElement | undefined => {
  const scripts = html.querySelectorAll('script');
  return scripts.find((scr) => scr.textContent.includes('lstImages'));
};

export const getImageUrls = async (comicUrl: string): Promise<string[] | null> => {
  const html = await getHtml(getComicUrl(comicUrl));

  if (html) {
    const scriptWithUrls = getScriptWithImages(html);
    if (scriptWithUrls) return getUrls(scriptWithUrls.textContent);
  }

  return null;
};
