import axios from 'axios';
import { parse as parseHTML, HTMLElement } from 'node-html-parser';

export const getHtml = async (htmlUrl: string): Promise<HTMLElement | null> => {
  try {
    const { data: html } = await axios.get<string>(htmlUrl);
    return parseHTML(html);
  } catch (err) {
    const { message } = err as Error;
    console.log('Get html error:', message);
  }

  return null;
};
