import puppeteer from 'puppeteer-core';
import {createWriteStream,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';
const opt=Object.fromEntries(process.argv.slice(2).map(a=>a.replace(/^--/,'').split('=')));
const start=+(opt.start||0),seconds=+(opt.seconds||216),fps=24,n=Math.round(seconds*fps),base=opt.out||'out/direct-full';
const file=createWriteStream(base+'.h264');let chunks=0,bytes=0;
const browser=await puppeteer.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,protocolTimeout:0,args:['--allow-file-access-from-files','--ignore-gpu-blocklist','--use-angle=d3d11','--enable-gpu-rasterization','--disable-renderer-backgrounding','--disable-background-timer-throttling']});
try{
 const page=await browser.newPage();page.on('pageerror',e=>console.error('PAGE_ERROR',e.message));
 await page.exposeFunction('encodedChunk',async b64=>{const data=Buffer.from(b64,'base64');chunks++;bytes+=data.length;if(!file.write(data))await new Promise(r=>file.once('drain',r));});
 await page.exposeFunction('encodingProgress',data=>console.log(JSON.stringify(data)));
 await page.goto(pathToFileURL(resolve(opt.page||'studio.html')).href+'?render',{waitUntil:'networkidle0'});await page.waitForFunction('window.ready===true');
 const report=await page.evaluate(async({start,n,fps})=>{
  let failure=null,outputCount=0,pending=[];
  const encoder=new VideoEncoder({output(chunk){
   const data=new Uint8Array(chunk.byteLength);chunk.copyTo(data);let s='';
   for(let j=0;j<data.length;j+=16384)s+=String.fromCharCode(...data.subarray(j,j+16384));
   outputCount++;pending.push(window.encodedChunk(btoa(s)));
  },error(e){failure=e.message;}});
  const config={codec:'avc1.420028',width:1920,height:1080,bitrate:4500000,framerate:fps,hardwareAcceleration:'prefer-software',latencyMode:'realtime',avc:{format:'annexb'}};
  encoder.configure(config);const begun=performance.now();
  for(let i=0;i<n;i++){
   if(failure)throw new Error(failure);
   T=start+i/fps;await redraw();composite(T);
   const frame=new VideoFrame(outC,{timestamp:Math.round(i*1e6/fps),duration:Math.round(1e6/fps)});
   encoder.encode(frame,{keyFrame:i%(fps*2)===0});frame.close();
   while(encoder.encodeQueueSize>6){if(failure)throw new Error(failure);await new Promise(r=>setTimeout(r,1));}
   if(pending.length>48){await Promise.all(pending);pending=[];}
   if((i+1)%120===0||i===n-1){const elapsed=(performance.now()-begun)/1000;await window.encodingProgress({frame:i+1,total:n,ms_per_frame:Math.round(elapsed*1000/(i+1)),eta_seconds:Math.round((n-i-1)*elapsed/(i+1))});}
  }
  await encoder.flush();await Promise.all(pending);encoder.close();
  if(failure)throw new Error(failure);
  if(outputCount!==n)throw new Error(`Encoder output ${outputCount} frames instead of${n}`);
  return {frames:outputCount,duration:n/fps,seconds_spent:(performance.now()-begun)/1000};
 },{start,n,fps});
 await new Promise(r=>file.end(r));
 writeFileSync(base+'.json',JSON.stringify({...report,chunks,bytes},null,2));console.log('DIRECT_RENDER_COMPLETE',JSON.stringify({...report,chunks,bytes}));
}finally{await browser.close();}
