import puppeteer, { Browser, Page } from 'puppeteer';
import { newInjectedPage } from 'fingerprint-injector';
import { parse as parseHTML, HTMLElement } from 'node-html-parser';

let browser: Browser | null = null;
let browserPage: Page | null = null;

export const closeBrowser = async (): Promise<void> => {
  if (browser) {
    await browser.close();
    browser = null;
    browserPage = null;
  }
};

const getBrowserPage = async (): Promise<Page> => {
  if (!browser) {
    browser = await puppeteer.launch({ headless: false });
  }

  if (!browserPage) {
    browserPage = await newInjectedPage(browser, {
      fingerprintOptions: {
        devices: ['desktop'],
        browsers: [{ name: 'chrome' }, { name: 'firefox' }, { name: 'safari' }, { name: 'edge' }],
        locales: ['en', 'de', 'es', 'fr', 'it', 'pl', 'pt'],
        operatingSystems: ['windows', 'linux', 'macos'],
      },
    });

    await browserPage.setJavaScriptEnabled(true);
  }

  return browserPage;
};

const openBrowserPageUrl = async (
  currentBrowserPage: Page,
  htmlUrl: string,
  waitForSelector: string,
): Promise<void> => {
  await currentBrowserPage.goto(htmlUrl);
  await currentBrowserPage.waitForSelector(waitForSelector, { timeout: 2 * 60000 });
};

export const getHtml = async (htmlUrl: string, waitForSelector: string): Promise<HTMLElement | null> => {
  try {
    const currentBrowserPage = await getBrowserPage();
    await openBrowserPageUrl(currentBrowserPage, htmlUrl, waitForSelector);
    const pageContent = await currentBrowserPage.content();
    return parseHTML(pageContent);
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
    const currentBrowserPage = await getBrowserPage();
    await openBrowserPageUrl(currentBrowserPage, htmlUrl, waitForSelector);
    const variable = await currentBrowserPage.evaluate(varaibleName);
    return variable as T;
  } catch (err) {
    const { message } = err as Error;
    console.log('Download page variable failed:', message);
  }

  return null;
};
