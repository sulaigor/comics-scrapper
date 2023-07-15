import { IMAGES_LIST_VARIABLE_NAME } from 'const';
import { getPageVariable } from 'htmlUtils';

const DEFAULT_WAIT_SELECTOR = '#containerRoot';

export const getImageUrls = async (comicUrl: string): Promise<string[] | null> =>
  getPageVariable<string[]>(comicUrl, DEFAULT_WAIT_SELECTOR, IMAGES_LIST_VARIABLE_NAME);
