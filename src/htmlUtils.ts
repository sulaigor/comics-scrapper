import puppeteer from 'puppeteer-extra';
import { FingerprintInjector } from 'fingerprint-injector';
import { parse as parseHTML, HTMLElement } from 'node-html-parser';

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const FingerprintGenerator = require('fingerprint-generator');

const DEFAULT_WAIT_SELECTOR = '#containerRoot';

export const getHtml = async (
  htmlUrl: string,
  waitForSelector: string = DEFAULT_WAIT_SELECTOR,
): Promise<HTMLElement | null> => {
  const fingerprintInjector = new FingerprintInjector();

  const fingerprintGenerator = new FingerprintGenerator({
    devices: ['desktop'],
    browsers: [{ name: 'chrome', minVersion: 90 }],
  });

  const { fingerprint, headers } = fingerprintGenerator.getFingerprint();

  try {
    const browser = await puppeteer.use(StealthPlugin()).launch({ headless: false });
    const page = await browser.newPage();

    await fingerprintInjector.attachFingerprintToPuppeteer(page, fingerprint);
    await page.setJavaScriptEnabled(true);
    await page.setExtraHTTPHeaders(headers);
    await page.goto(htmlUrl);
    await page.waitForSelector(waitForSelector, { timeout: 60000 });
    const content = await page.content();
    await browser.close();
    return parseHTML(content);
  } catch (err) {
    const { message } = err as Error;
    console.log('Download html document failed:', message);
  }

  return null;
};
