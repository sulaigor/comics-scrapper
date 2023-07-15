import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { FingerprintInjector } from 'fingerprint-injector';
import { parse as parseHTML, HTMLElement } from 'node-html-parser';

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const FingerprintGenerator = require('fingerprint-generator');

let browser: Browser | null = null;

const getPage = async (htmlUrl: string, waitForSelector: string): Promise<Page> => {
  const fingerprintInjector = new FingerprintInjector();

  const fingerprintGenerator = new FingerprintGenerator({
    devices: ['desktop'],
    browsers: [{ name: 'chrome', minVersion: 90 }],
  });

  const { fingerprint, headers } = fingerprintGenerator.getFingerprint();

  if (!browser) {
    browser = await puppeteer.use(StealthPlugin()).launch({ headless: false });
  }

  const page = await browser.newPage();
  await fingerprintInjector.attachFingerprintToPuppeteer(page, fingerprint);
  await page.setJavaScriptEnabled(true);
  await page.setExtraHTTPHeaders(headers);
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
    return variable;
  } catch (err) {
    const { message } = err as Error;
    console.log('Download page variable failed:', message);
  }

  return null;
};
