import puppeteer from 'puppeteer-core';
import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';
const browser=await puppeteer.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,protocolTimeout:0,args:['--allow-file-access-from-files','--ignore-gpu-blocklist','--use-angle=d3d11','--enable-gpu-rasterization','--disable-renderer-backgrounding','--disable-background-timer-throttling']});
try{
 const page=await browser.newPage();await page.goto(pathToFileURL(resolve('studio.html')).href+'?render',{waitUntil:'networkidle0'});await page.waitForFunction('window.ready===true');
 console.log(await page.evaluate(async()=>{
  const support=[];
  for(const hardwareAcceleration of ['prefer-hardware','prefer-software']){
   const config={codec:'avc1.420028',width:1920,height:1080,bitrate:3500000,framerate:24,hardwareAcceleration,latencyMode:'realtime',avc:{format:'annexb'}};
   try{support.push({hardwareAcceleration,...await VideoEncoder.isConfigSupported(config)});}catch(e){support.push({hardwareAcceleration,error:e.message});}
  }
  return {videoEncoder:typeof VideoEncoder,videoFrame:typeof VideoFrame,secure:isSecureContext,support};
 }));
}finally{await browser.close();}
