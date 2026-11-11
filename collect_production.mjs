import puppeteer from 'puppeteer-core';
import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const browser=await puppeteer.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,protocolTimeout:0,args:['--allow-file-access-from-files','--ignore-gpu-blocklist','--use-angle=d3d11','--disable-renderer-backgrounding','--disable-background-timer-throttling']});
try{
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(resolve('studio.html')).href+'?render',{waitUntil:'networkidle0'});
  await page.waitForFunction('window.ready===true',{timeout:60000});
  const data=await page.evaluate(()=>({duration:DUR,bpm:BPM,offset:OFF,cuts:MV.cuts,chapters:SONG.bounds}));
  if(errors.length)throw new Error(errors.join('\n'));
  if(data.cuts.length!==44)throw new Error(`Expected44shots, got${data.cuts.length}`);
  if(data.cuts[0].t!==0||data.cuts.at(-1).t>=210)throw new Error('Incorrect opening or ending');
  for(let i=1;i<data.cuts.length;i++)if(data.cuts[i].t<=data.cuts[i-1].t)throw new Error('Duplicate or unsorted cuts');
  writeFileSync('out/production.json',JSON.stringify(data,null,2));
  writeFileSync('assets/full-song.cues.json',JSON.stringify(data.cuts.filter(c=>c.t>0&&c.transition!=='none').map(c=>c.t)));
  console.log(JSON.stringify({duration:data.duration,shots:data.cuts.length,cuts:data.cuts.map(c=>c.t)},null,2));
}finally{await browser.close();}
