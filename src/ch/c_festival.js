(() => {
  /* Shot reads, notice/anticipate → travel → response (local movement timings below).
   * 108.66–113.90 boat at paper dock → staggered disembark hops → safe arrival.
   * 113.90–119.20 adjacent windows → leap their gap → invite partner.
   * 119.20–124.50 heart squares mark route → skip paper squares → happy chase.
   * 124.50–129.86 page edge slides → run across moving page → roof drawing opens.
   * 129.86–135.10 paper steps → boy climbs, girl follows → look toward terrace.
   * 135.10–140.50 roof gap → two delayed arcs → matching proud landing.
   * 140.50–145.90 girl invites → boy catches her on run → drawn-view twirl.
   * 145.90–151.29 approach under bulbs → hands meet → shared side steps.
   * 151.29–156.50 wider stage reveals → duet skips outward → bounce together.
   * 156.50–161.90 glance across stage → swap along opposite arcs → happy response.
   * 161.90–166.90 balloons rise → run-and-skip through city → confetti.
   * 166.90–171.00 paper windows celebrate → synchronized gap jumps → hearts rise.
   * 171.00–174.96 boat slides in → pair approach → balloon flight ready.
   * Actual registrations snap to measured accents; no registration at exit seam.
   */
  const C=MV.C, A=[108.66,113.9,119.2,124.5,129.86,135.1,140.5,145.9,151.29,156.5,161.9,166.9,171].map(SONG.near);
  const prog=(l,a,b)=>ease(seg(l,a,b));
  const moods=(a,initial='hopeful',end='happy',hit=2.7)=>[[a,initial,{emote:null}],[a+hit,end,{emote:null}]];
  function balloon(g,t,o={}) {const hand=(VIEWS[g.pose.view]||VIEWS.front).arms.some(a=>a[2]==='R')?'R':'L';MV.heldBalloon(g,t,{hand,r:77,rise:245,dx:-35,...o});}
  function hop(w,t,a,l,from,to,o={}) {
    const u=o.u||32,h=o.h||130,delay=o.delay||0,d=o.d||1.45;
    if(l<delay+d+.08)return MV.leap(w,t,a+delay,a+delay+d,from,to,u,h,{mood:'excited',...o,aR:w==='girl'?.2:(o.aR??.35)});
    return MV.actor(w,to[0],to[1],u,t,{mood:'happy',...o,action:'wave',aR:w==='girl'?.2:(o.aR??.8)});
  }
  function platform(x,y,w,t,col='#E8CEB8') {
    boilSeed('c-platform-'+x);paint(rectPts(x,y,w,65,3),{wash:col,ink:'#AA8F85',sw:.3});
    inkLine([[x+10,y+12],[x+w-10,y+12]],.2,'#F1DECB','dry');
  }
  function paperWindows(t,offset=0) {
    MV.paperFrame(170+offset,370,760,495,t,{col:'#D8DBCA',bar:'#E7C3B4'});
    MV.paperFrame(1060+offset,310,730,490,t,{col:'#E3CBBF',bar:'#C8D5D5'});
    MV.heart(450+offset,515,47,t,'#D09DA3');MV.heart(1380+offset,465,49,t,'#D09DA3');
  }
  function confetti(t,age,n=13) {
    const k=prog(age,0,.6);if(k<.001)return;
    for(let i=0;i<n;i++){boilSeed('c-confetti-'+i);const x=200+hash(i+812)*1480+Math.sin(age*1.5+i)*28,y=100+((hash(i+298)*510+age*77)%700),r=(6+hash(i+411)*6)*k;
      paint([[x-r,y-r*.6],[x+r,y-r],[x+r*.6,y+r],[x-r*.7,y+r*.6]],{wash:['#DFC18C','#DC9AA9','#B5C8C1'][i%3],ink:null});}
  }
  function extraBalloons(t,age,n=4,anchor=null) {
    const k=prog(age,0,.7);if(k<.001)return;
    for(let i=0;i<n;i++){const x=220+i*410+Math.sin(t*1.2+i)*22,y=620-age*(44+i*3)-i%2*160;MV.balloon(x,y,(34+i%2*7)*k,t,anchor,{col:i%2?'#CE9AA9':'#DFB783'});}
  }
  function dusk(t,o={}){MV.begin('roofs',t,{night:true,...o});}

  MV.shot(A[0],(t,l)=>{
    MV.begin('desk',t,{cam:[960+12*Math.sin(l*.4),550,1]});
    MV.paperFrame(230,260,1420,635,t,{col:'#F0DDC7',bar:'#D4CBC0'});
    boilSeed('c-arrival-river');paint(rectPts(250,770,1380,106),{wash:'#BBCBCB',ink:null});
    platform(1000,865,550,t);MV.boat(605,850,660,t);
    hop('boy',t,A[0],l,[350,820],[1060,865],{delay:.6,d:1.55,u:31,h:155});
    const g=hop('girl',t,A[0],l,[800,820],[1510,865],{delay:.7,d:1.55,u:31,h:165});balloon(g,t,{rise:220,r:72});
    MV.hearts(1280,520,t,l-3.4,3,{r:17,life:3});MV.end();
  },{transition:'paper',name:'c-paper-dock-arrival'});
  MV.shot(A[1],(t,l)=>{
    MV.begin('desk',t,{cam:[960+18*Math.sin(l*.5),555,1]});paperWindows(t);
    hop('boy',t,A[1],l,[330,865],[1130,800],{delay:.65,d:1.65,u:31,h:160});
    const g=hop('girl',t,A[1],l,[760,865],[1580,800],{delay:.75,d:1.65,u:30,h:165});balloon(g,t,{rise:215,r:74});
    if(l>3.5)MV.hearts(1340,490,t,l-3.5,2,{r:17,life:3});MV.end();
  },{transition:'paper',name:'c-window-gap'});
  MV.shot(A[2],(t,l)=>{
    MV.begin('desk',t,{cam:[960+20*Math.sin(l*.5),550,1]});
    for(let i=0;i<3;i++){const x=220+i*505,y=840-i%2*65;MV.paperFrame(x,370-i%2*65,445,470,t,{col:['#E3D6B8','#DEC9C6','#CBD8CF'][i],bar:'#DECBB6'});MV.heart(x+225,y-170,47,t,'#CF9DA2');}
    const x=lerp(390,1100,prog(l,.55,3.7)),y=840-65*Math.sin(prog(l,.55,3.7)*Math.PI);
    MV.actor('boy',x,y,31,t,{action:l<4?'run':'dance',keys:moods(A[2],'playful','laugh',4),dy:-3*Math.abs(Math.sin(prog(l,.55,3.7)*Math.PI*2))});
    const gx=lerp(910,1590,prog(l,.8,4.05));const g=MV.actor('girl',gx,y+10,31,t,{action:l<4?'run':'dance',mood:'playful',aR:.2,dy:-2.8*Math.abs(Math.sin(prog(l,.8,4.05)*Math.PI*2))});balloon(g,t,{rise:220,r:73});MV.end();
  },{transition:'paper',name:'c-calendar-heart-skip'});
  MV.shot(A[3],(t,l)=>{
    MV.begin('desk',t,{cam:[960+50*prog(l,1,4),550,1]});
    const slide=lerp(250,-500,prog(l,.6,3.8));MV.paperFrame(slide,310,1550,550,t,{col:'#DDC9C3',bar:'#B8C6CD'});
    for(let i=0;i<3;i++){boilSeed('c-roof-drawing-'+i);const xx=slide+230+i*470;paint([[xx-150,700],[xx,580],[xx+150,700],[xx+150,850],[xx-150,850]],{wash:'#C1B9B9',ink:'#B3A4A3',sw:.25});}
    const x=lerp(450,1050,prog(l,.4,3.8));MV.actor('boy',x,860,33,t,{action:'run',mood:'excited'});
    const g=MV.actor('girl',x+470,860,32,t,{action:'run',mood:'happy',aR:.2,phase:.5});balloon(g,t,{rise:240,r:77});MV.trail(x-190,720,t);MV.end();
  },{transition:'paper',name:'c-page-conveyor'});
  MV.shot(A[4],(t,l)=>{
    MV.begin('roofs',t,{sky:'#D8BAC3',lights:false,cam:[960,555,1]});
    platform(140,960,760,t,'#CDBAB4');platform(650,870,780,t,'#C4AFAD');platform(1120,780,720,t,'#B7A6AE');
    if(l<2.3)hop('boy',t,A[4],l,[330,960],[830,870],{delay:.45,d:1.4,u:32,h:115});else hop('boy',t,A[4],l,[830,870],[1240,780],{delay:2.3,d:1.35,u:32,h:110});
    let g;if(l<2.4)g=hop('girl',t,A[4],l,[760,960],[1260,870],{delay:.55,d:1.4,u:31,h:115});else g=hop('girl',t,A[4],l,[1260,870],[1660,780],{delay:2.4,d:1.35,u:31,h:110});balloon(g,t,{rise:210,r:72,dx:-75});MV.end();
  },{transition:'paper',name:'c-staircase-chase'});
  MV.shot(A[5],(t,l)=>{
    dusk(t,{cam:[960,550,1]});boilSeed('c-rooftop-gap');paint(rectPts(900,785,105,400),{wash:'#55546B',ink:null});platform(155,850,745,t,'#C3A8A6');platform(1005,825,730,t,'#BFA6A7');
    hop('boy',t,A[5],l,[350,850],[1120,825],{delay:.65,d:1.65,u:33,h:170});
    const g=hop('girl',t,A[5],l,[780,850],[1575,825],{delay:.75,d:1.65,u:31,h:175});balloon(g,t,{rise:220,r:74});MV.hearts(1380,510,t,l-4,2,{r:18,life:3});MV.end();
  },{transition:'paper',name:'c-rooftop-leap'});
  MV.shot(A[6],(t,l)=>{
    dusk(t,{cam:[960,570,1.02]});const x=lerp(400,940,prog(l,.55,2.75));
    MV.actor('boy',x,870,35,t,{action:l<2.9?'run':'spin',keys:moods(A[6],'hopeful','excited',2.9),...(l>2.9?turn(t,A[6]+3,A[6]+4.6,0,1):{})});
    const gx=lerp(980,1430,prog(l,1,2.9));const g=MV.actor('girl',gx,870,34,t,{action:l<3?'run':'spin',mood:'playful',aR:.2,...(l<.7?turn(t,A[6]+.1,A[6]+.65,.25,-.25):l>3?turn(t,A[6]+3.15,A[6]+4.75,0,1):{})});balloon(g,t,{rise:240,r:80});MV.hearts(1200,510,t,l-4.25,3,{r:18,life:3});MV.end();
  },{transition:'balloon',name:'c-turn-and-twirl'});
  MV.shot(A[7],(t,l)=>{
    dusk(t,{cam:[970,575,1.17+prog(l,0,5)*.05]});const settle=prog(l,.45,2),sway=l>2?70*Math.sin((l-2)*Math.PI/BEAT/2):0;
    const bx=lerp(460,700,settle)+sway,gx=lerp(1460,1208,settle)+sway;
    const a=MV.actor('boy',bx,870,36,t,{action:l<2?'walk':'dance',keys:moods(A[7],'shy','love',2.1),aR:.15,rot:0});
    const b=MV.actor('girl',gx,870,36,t,{action:l<2?'walk':'dance',mood:'love',aL:.15,aR:.2,phase:0,rot:0});
    if(l>1.5)MV.joinHands(a,b,t);balloon(b,t,{rise:260,r:82,dx:-100});MV.hearts(960+sway,470,t,l-2.15,3,{r:18,life:4});MV.end();
  },{transition:'paper',name:'c-lantern-hand-dance'});
  MV.shot(A[8],(t,l)=>{
    MV.begin('stage',t,{cam:[960,540,1]});const open=Math.sin(prog(l,.5,4.6)*Math.PI),x=650-open*210,gx=1230+open*210;
    MV.actor('boy',x,870,36,t,{action:'dance',mood:'excited',dy:-Math.abs(Math.sin(bpOf(t)*Math.PI))*2.2});
    const g=MV.actor('girl',gx,870,35,t,{action:'dance',mood:'happy',aR:.2,phase:.25,dy:-Math.abs(Math.sin(bpOf(t)*Math.PI+.3))*2.2});balloon(g,t,{r:83,rise:260});extraBalloons(t,l-.8,3);confetti(t,l-1.4,10);MV.end();
  },{transition:'balloon',name:'c-festival-opens'});
  MV.shot(A[9],(t,l)=>{
    MV.begin('stage',t,{cam:[960,565,1.02]});const p=prog(l,.65,3.95),arc=Math.sin(p*Math.PI);
    // Separate upper/lower arcs keep the exchange readable while centres cross.
    MV.actor('boy',lerp(620,1300,p),870-205*arc,34,t,{action:p>.02&&p<.98?'spin':'dance',mood:'playful'});
    const b=MV.actor('girl',lerp(1300,620,p),870+80*arc,34,t,{action:p>.02&&p<.98?'run':'dance',mood:'excited',dir:-1,aR:.2});balloon(b,t,{rise:235,r:78});MV.hearts(960,450,t,l-4.1,3,{r:21,life:3});confetti(t,l-1,9);MV.end();
  },{transition:'balloon',name:'c-duet-place-swap'});
  MV.shot(A[10],(t,l)=>{
    dusk(t,{cam:[960+100*prog(l,.5,4),550,1]});for(let i=0;i<4;i++){const x=80+i*500;MV.paperFrame(x,660,350,210,t,{col:['#9A8D9A','#B89DA3','#AAACAA','#C0A9AB'][i],bar:'#B7A5AC'});}
    const p=prog(l,.45,3.9),x=lerp(380,1040,p),gx=lerp(900,1570,p);MV.actor('boy',x,870,34,t,{action:'run',mood:'excited',dy:-3.4*Math.abs(Math.sin(p*Math.PI*2))});
    const g=MV.actor('girl',gx,870,33,t,{action:'run',mood:'happy',aR:.2,dy:-3*Math.abs(Math.sin(p*Math.PI*2+.25))});balloon(g,t,{rise:235,r:79});extraBalloons(t,l+1,4);confetti(t,l,14);MV.end();
  },{transition:'paper',name:'c-city-skip'});
  MV.shot(A[11],(t,l)=>{
    dusk(t,{cam:[960,535,1]});MV.paperFrame(140,350,800,540,t,{col:'#CBB4B0',bar:'#B7ADB9'});MV.paperFrame(1080,350,730,485,t,{col:'#B6BBC0',bar:'#D3B6B4'});
    hop('boy',t,A[11],l,[330,890],[1130,835],{delay:.45,d:1.6,u:31,h:165});
    const b=hop('girl',t,A[11],l,[760,890],[1580,835],{delay:.55,d:1.6,u:31,h:165});balloon(b,t,{rise:220,r:76});confetti(t,l,12);MV.hearts(1380,480,t,l-2.9,3,{r:21,life:3});MV.end();
  },{transition:'paper',name:'c-festival-window-hop'});
  MV.shot(A[12],(t,l)=>{
    dusk(t,{cam:[960,555,1]});const boatX=lerp(1920,1170,prog(l,.1,1.4));MV.boat(boatX,880,900,t);
    const approach=prog(l,.7,2.8);MV.actor('boy',lerp(410,865,approach),855,33,t,{action:l<2.9?'run':'wave',keys:moods(A[12],'surprised','hopeful',2.8),aR:.25});
    const b=MV.actor('girl',lerp(850,1340,approach),855,33,t,{action:l<2.9?'run':'idle',keys:moods(A[12],'happy','excited',2.9),aR:.2});balloon(b,t,{rise:275,r:88});
    // Additional balloons tie to the boat rim. The primary stays in her hand.
    const k=prog(l,1.6,3.3);if(k>.001){MV.balloon(900,lerp(760,320,k),58*k,t,[835,880],{col:'#D7A0AC'});MV.balloon(1110,lerp(750,265,k),65*k,t,[1120,880],{col:'#DEAF8D'});}MV.end();
  },{transition:'balloon',name:'c-paper-vessel-ready'});
})();

