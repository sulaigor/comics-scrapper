import puppeteer, { Browser, Page } from 'puppeteer';
import { newInjectedPage } from 'fingerprint-injector';
import { parse as parseHTML, HTMLElement } from 'node-html-parser';

let browser: Browser | null = null;

const getPage = async (htmlUrl: string, waitForSelector: string): Promise<Page> => {
  if (!browser) {
    browser = await puppeteer.launch({ headless: false });
  }

  const page = await newInjectedPage(browser, {
    fingerprintOptions: {
      devices: ['desktop'],
      browsers: [{ name: 'chrome', minVersion: 90 }],
    },
  });

  await page.setJavaScriptEnabled(true);
  await page.goto(htmlUrl);
  await page.waitForSelector(waitForSelector, { timeout: 60000 });
  return page;
};

export const getHtml = async (htmlUrl: string, waitForSelector: string): Promise<HTMLElement | null> => {
  try {
    const page = await getPage(htmlUrl, waitForSelector);
    const content = await page.content();
    return parseHTML(content);
  } catch (err) {
    const { message } = err as Error;
    console.log('Download html document failed:', message);
  }

  return null;
};

export const getPageVariable = async <T>(
  htmlUrl: string,
  waitForSelector: string,
  varaibleName: string,
): Promise<T | null> => {
  try {
    const page = await getPage(htmlUrl, waitForSelector);
    const variable = await page.evaluate(varaibleName);
    return variable as T;
  } catch (err) {
    const { message } = err as Error;
    console.log('Download page variable failed:', message);
  }

  return null;
};
