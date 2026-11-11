// Deterministic native canvas compositor for the same authored character rig and story.
let _rand=1;
function randomSeed(n){_rand=(n>>>0)||1;}
function random(a=1,b){_rand=(_rand*1664525+1013904223)>>>0;const x=_rand/4294967296;return b===undefined?x*a:a+x*(b-a);}
function noiseSeed(){}
function push(){outX.save();}function pop(){outX.restore();}
function translate(x,y){outX.translate(x,y);}function rotate(a){outX.rotate(a);}function scale(x,y=x){outX.scale(x,y);}
function _path(pts,closed=true,smooth=0){
 outX.beginPath();if(!pts.length)return;outX.moveTo(pts[0][0],pts[0][1]);
 if(smooth&&pts.length>2){for(let i=1;i<pts.length-1;i++){const q=pts[i],r=pts[i+1];outX.quadraticCurveTo(q[0],q[1],(q[0]+r[0])/2,(q[1]+r[1])/2);}const q=pts.at(-1);outX.lineTo(q[0],q[1]);}
 else for(let i=1;i<pts.length;i++)outX.lineTo(pts[i][0],pts[i][1]);if(closed)outX.closePath();
}
function paint(pts,o={}){
 if(!pts.length)return;
 if(PROJECT.washShading&&o.fill&&!o.hatch)o={...o,wash:o.wash?mixCol(o.wash,o.fill,Math.min(.4,(o.fillOp??170)/510)):o.fill,washOp:o.wash?(o.washOp??255):(o.fillOp??170),fill:null};
 outX.save();outX.lineCap='round';outX.lineJoin='round';_path(pts,true,o.curv);
 if(o.wash||o.fill){outX.globalAlpha=(o.washOp??o.fillOp??255)/255;outX.fillStyle=o.wash||o.fill;outX.fill();}
 if(o.ink!==null){outX.globalAlpha=.96;outX.strokeStyle=o.ink||PAL.ink;outX.lineWidth=(o.sw??1)*4.7;outX.stroke();}
 outX.restore();
}
function inkLine(pts,sw=1,col=PAL.ink,br='ink',curv=.5){
 if(pts.length<2)return;outX.save();outX.lineCap='round';outX.lineJoin='round';outX.strokeStyle=col;outX.globalAlpha=br==='dry'?.52:.94;outX.lineWidth=sw*(br==='inkfine'?2.6:br==='dry'?6:4.7);_path(pts,false,curv);outX.stroke();outX.restore();
}
function flushBrush(){}function flushLetters(){}
function glow(x,y,r,col='#FFC766',a=1){outX.save();outX.globalCompositeOperation='lighter';outX.globalAlpha=a*.7;const g=outX.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,col+'00');outX.fillStyle=g;outX.fillRect(x-r,y-r,r*2,r*2);outX.restore();}
function createGraphics(w,h){const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;return {canvas,drawingContext:canvas.getContext('2d'),pixelDensity(){}};}
function draw(){outX.setTransform(1,0,0,1,0,0);outX.globalAlpha=1;outX.globalCompositeOperation='source-over';outX.clearRect(0,0,W,H);outX.drawImage(paperG.canvas,0,0);BOILN=Math.floor(T*BOIL);CLAWD_N=0;CAM=LAST_CAM=null;boilSeed('frame');drawWorld(T);}
async function redraw(){draw();}
function composite(){outX.save();outX.setTransform(1,0,0,1,0,0);outX.globalCompositeOperation='multiply';outX.drawImage(grainC,0,0);outX.restore();}
function fastInit(){outC=document.getElementById('out');outX=outC.getContext('2d');paperG=makePaper();grainC=makeGrain();window.ready=true;}
window.gpuInfo=()=>({renderer:'Native Canvas2D, deterministic painted rig'});
window.renderAt=async(t,type='image/png',q=.92)=>{T=t;await redraw();composite();return outC.toDataURL(type,q);};
window.renderSheet=async(times,cols=3,w=640,crop=null,at=null)=>{
 if(at)at=at.map(v=>typeof v==='string'?(0,eval)(v):v);
 const [,,cw,ch]=at||crop||[0,0,W,H],h=Math.round(w*ch/cw),rows=Math.ceil(times.length/cols),canvas=document.createElement('canvas');canvas.width=cols*w;canvas.height=rows*h;const ctx=canvas.getContext('2d'),ms=[];
 for(let i=0;i<times.length;i++){const begun=performance.now();T=times[i];await redraw();composite();ms.push(Math.round(performance.now()-begun));const x=i%cols*w,y=Math.floor(i/cols)*h;const [cx,cy]=at?toScreen(at[0],at[1],LAST_CAM).map((v,j)=>v-(j?ch:cw)/2):crop||[0,0];ctx.drawImage(outC,cx,cy,cw,ch,x,y,w,h);ctx.fillStyle='#48333c';ctx.fillRect(x,y,85,24);ctx.fillStyle='#fff0d6';ctx.font='15px sans-serif';ctx.fillText(times[i].toFixed(2)+'s',x+6,y+17);}
 return {url:canvas.toDataURL('image/jpeg',.92),ms};
};
