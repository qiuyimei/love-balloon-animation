import puppeteer from 'puppeteer-core';
import { readFileSync, writeFileSync } from 'node:fs';

const chrome = process.argv[2];
if (!chrome) throw new Error('Usage: node prepare_audio.mjs <chromium executable>');
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--use-angle=d3d11'] });
try {
  const page = await browser.newPage();
  await page.setContent('<!doctype html><html><body>Local offline audio synthesis</body></html>');
  await page.addScriptTag({ content: readFileSync('src/music.js', 'utf8') });
  const result = await page.evaluate(async () => {
    const ac = new OfflineAudioContext(2, 16 * 48000, 48000);
    window.SCORE(ac);
    const buffer = await ac.startRendering();
    const channels = buffer.numberOfChannels, frames = buffer.length;
    const raw = new ArrayBuffer(44 + frames * channels * 2), v = new DataView(raw);
    const text = (offset, s) => [...s].forEach((c, i) => v.setUint8(offset + i, c.charCodeAt(0)));
    text(0, 'RIFF'); v.setUint32(4, raw.byteLength - 8, true); text(8, 'WAVE'); text(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, channels, true);
    v.setUint32(24, 48000, true); v.setUint32(28, 48000 * channels * 2, true); v.setUint16(32, channels * 2, true); v.setUint16(34, 16, true);
    text(36, 'data'); v.setUint32(40, frames * channels * 2, true);
    const data = Array.from({ length: channels }, (_, c) => buffer.getChannelData(c));
    let peak = 0, sum = 0;
    for (let i = 0; i < frames; i++) for (let c = 0; c < channels; c++) {
      const sample = data[c][i]; peak = Math.max(peak, Math.abs(sample)); sum += sample * sample;
      v.setInt16(44 + (i * channels + c) * 2, Math.round(Math.max(-1, Math.min(1, sample)) * 32767), true);
    }
    const bytes = new Uint8Array(raw); let binary = '';
    for (let i = 0; i < bytes.length; i += 16384) binary += String.fromCharCode(...bytes.subarray(i, i + 16384));
    return { base64: btoa(binary), peak, rms: Math.sqrt(sum / (frames * channels)), duration: buffer.duration, cues: window.CUES };
  });
  writeFileSync('assets/butterfly-score.wav', Buffer.from(result.base64, 'base64'));
  writeFileSync('assets/butterfly.cues.json', JSON.stringify(result.cues));
  const { base64, ...metrics } = result;
  writeFileSync('out/audio-metrics.json', JSON.stringify(metrics, null, 2));
  console.log(JSON.stringify(metrics));
} finally {
  await browser.close();
}
