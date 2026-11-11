import puppeteer from 'puppeteer-core';
import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true, protocolTimeout: 0,
  args: ['--allow-file-access-from-files', '--ignore-gpu-blocklist', '--use-angle=d3d11', '--enable-gpu-rasterization', '--disable-renderer-backgrounding', '--disable-background-timer-throttling']
});
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(resolve('studio.html')).href + '?render', {waitUntil: 'networkidle0'});
  await page.waitForFunction('window.ready === true', {timeout: 60000});
  for (const i of [96, 226]) {
    const url = await page.evaluate(t => window.renderAt(t, 'image/jpeg', .94), i/24);
    const buffer = Buffer.from(url.slice(url.indexOf(',')+1), 'base64');
    const name = `f${String(i).padStart(5, '0')}.jpg`;
    const unchanged = buffer.equals(readFileSync(`out/frames/${name}`));
    writeFileSync(`out/check/extended-cache-${name}`, buffer);
    console.log(`${name}: identical to previous render = ${unchanged}`);
    if (!unchanged) process.exitCode = 2;
  }
} finally {
  await browser.close();
}
