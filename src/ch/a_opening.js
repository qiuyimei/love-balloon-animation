/* PAPER AWAKENING / CAFE / COURAGE — 13 shots, pure absolute time.
0–3.08: sleepy boy notices balloon rise; eyes open, he steps toward it.
3.08–6.71: balloon escapes right; boy accelerates across the illustrated page.
6.71–10.10: boy crouches, jumps onto another paper ledge, lands and looks up.
10.10–12.71: neighbouring page reveals girl; she waves and boy answers.
12.71–18.09: balloon leads over a giant cup; run-up, broad leap, clean landing,
  then girl responds. Cup rim stays below the flight arc, feet stay visible.
18.09–23.37: boy steps forward, blushes, retreats; girl steps toward him.
23.37–28.69: neighbouring paper windows; they run toward their facing edges,
  look across the gap and greet one another, balloon hovering over the gap.
28.69–34.05: paper cover opens on a common counter; both run after balloon.
34.05–39.40: boy anticipates, hops to catch the loose thread, then settles.
39.40–44.68: river. Boy rehearses an offer: approach, shy retreat, resolve.
44.68–50.01: a tiny heart-painted plane leaves his free hand, arcs across,
  arrives at girl's hand; her reaction is delayed until after the arrival.
50.01–55.33: buoyant balloon pulls boy up; girl steps back, laughs; he lands.
55.33–60.69: boy deliberately approaches, girl reaches; thread transfers
  between true arm tips at58–59; they meet hands and enjoy the accepted gift.
Every real cut has a shared opaque cover; no manually doubled transitions.
*/
(() => {
  const C=MV.C,U=35,F=878;
  const A=[0,3.08,6.71,10.1,12.71,18.09,23.37,28.69,34.05,39.4,44.68,50.01,55.33];
  const cv=(t,a,b,x,y)=>lerp(x,y,ease(seg(t,a,b)));
  const loose=(x,y,t,tail=240)=>MV.balloon(x,y,79,t,[x-28+Math.sin(t*2)*12,y+tail]);
  const held=(p,t,hand='R')=>MV.heldBalloon(p,t,{hand,r:79,rise:255,dx:20});
  function jumpActor(who,t,a,b,from,to,u=U,h=150,o={}) {
    if(t>b+.45)return MV.actor(who,to[0],to[1],u,t,{mood:'happy',...o});
    return MV.leap(who,t,a,b,from,to,u,h,{view:'front',mood:'happy',...o});
  }
  function windows(t) {
    MV.paperFrame(155,235,720,610,t,{col:'#E8D6C3',bar:'#D6C3B3'});
    MV.paperFrame(1060,235,705,610,t,{col:'#E7C8C4',bar:'#D9B9B6'});
  }
  function ledge(x,y,w,t,key) {
    boilSeed('a-ledge-'+key);paint(rectPts(x,y,w,29,3),{wash:C.cream,ink:'#AB9684',sw:.3});
  }
  function planeHeart(x,y,t) {
    MV.plane(x,y,62,t,{rot:-.06});MV.heart(x-12,y+7,10,t,'#CD8C9B');
  }
  MV.shot(A[0],(t,l,d)=>{
    MV.begin('desk',t,{cam:[960,550,1.04]});
    const x=cv(l,1.9,2.85,650,850),by=cv(l,.45,2,600,355);
    MV.actor('boy',x,870,38,t,{action:l>1.9?'walk':'idle',keys:[[0,'sleepy'],[1.05,'surprised'],[1.7,'hopeful']],lookX:.65,lookY:-.5});
    loose(1120+30*Math.sin(l),by,t);MV.end();
  },{transition:'iris',name:'a-balloon-awakens'});
  MV.shot(A[1],(t,l,d)=>{
    const k=ease(seg(l,.25,3.1)),x=430+880*k;
    MV.begin('desk',t,{cam:[830+400*k,540,1]});
    MV.actor('boy',x,870,U,t,{action:'run',mood:'hopeful',aR:.7});
    loose(850+840*k,335-45*Math.sin(k*Math.PI),t);MV.trail(x-145,780,t);MV.end();
  },{transition:'paper',name:'a-across-the-page'});
  MV.shot(A[2],(t,l,d)=>{
    const a=A[2];MV.begin('desk',t,{cam:[990,500,1]});
    MV.paperFrame(840,744,740,230,t,{col:'#E8D3C0'});ledge(840,744,740,t,'landing');
    jumpActor('boy',t,a+.7,a+1.85,[470,878],[1100,744],U,160,{keys:[[a,'hopeful'],[a+2.15,'surprised']],aR:.65});
    loose(1470,300+15*Math.sin(l*1.5),t);MV.end();
  },{transition:'paper',name:'a-leap-to-a-window'});
  MV.shot(A[3],(t,l,d)=>{
    const a=A[3];MV.begin('desk',t,{cam:[960,510,1.04]});
    MV.paperFrame(330,390,620,380,t,{col:'#E8D3C0'});MV.paperFrame(1090,290,600,390,t,{col:'#E5C5C1'});
    const bx=cv(l,.45,1.45,570,710),gx=cv(l,.2,1.1,1470,1340);
    MV.actor('boy',bx,744,34,t,{action:l<1.45?'walk':'wave',keys:[[a,'surprised'],[a+1.6,'shy']],aR:.8});
    MV.actor('girl',gx,660,34,t,{action:'wave',mood:'happy',phase:.4});loose(975,300,t,210);MV.end();
  },{transition:'iris',name:'a-neighbour-waves'});
  MV.shot(A[4],(t,l,d)=>{
    const a=A[4];MV.begin('cafe',t,{cups:false,cam:[990,530,1]});MV.coffee(930,850,150,t);
    if(t<15.0)MV.actor('boy',cv(t,a+.25,15,300,550),850,32,t,{action:'run',mood:'hopeful',aR:.55});
    else jumpActor('boy',t,15.15,16.2,[550,850],[1300,850],32,235,{keys:[[a,'hopeful'],[16.65,'relieved']],aR:.55});
    MV.actor('girl',1670,850,32,t,{keys:[[a,'happy'],[15.5,'surprised'],[16.8,'playful']],action:t>16.8?'wave':'idle'});
    loose(1450,345+10*Math.sin(l),t);MV.end();
  },{transition:'paper',name:'a-over-the-coffee'});
  MV.shot(A[5],(t,l,d)=>{
    const a=A[5],bx=kf(l,[[0,490],[.5,490],[1.8,800],[2.7,650],[4.7,690]]),gx=kf(l,[[0,1420],[2.7,1420],[4.4,1240]]);
    MV.begin('cafe',t,{cups:false,cam:[960,555,1.04]});
    MV.actor('boy',bx,850,U,t,{action:'walk',keys:[[a,'hopeful'],[a+1.9,'shy'],[a+4.4,'happy']],aR:.4});
    MV.actor('girl',gx,850,U,t,{action:'walk',keys:[[a,'happy'],[a+2.7,'hopeful'],[a+4.4,'happy']],phase:.4});
    loose(1020+25*Math.sin(l),320,t,235);MV.end();
  },{transition:'balloon',name:'a-shy-approaches'});
  MV.shot(A[6],(t,l,d)=>{
    const a=A[6],k=ease(seg(l,.45,3.2));MV.begin('desk',t,{cam:[960,530,1]});windows(t);
    MV.actor('boy',370+320*k,803,32,t,{action:l<3.2?'run':'wave',mood:'happy',view:l<3.2?'q':'front'});
    MV.actor('girl',1510-250*k,803,32,t,{action:l<3.2?'run':'wave',dir:-1,mood:'playful',phase:.4,view:l<3.2?'q':'front',flip:l<3.2});
    loose(960+35*Math.sin(l),365-80*ease(seg(l,3.2,4.7)),t,200);MV.end();
  },{transition:'paper',name:'a-parallel-paper-windows'});
  MV.shot(A[7],(t,l,d)=>{
    const k=ease(seg(l,.5,4.3)),off=470*k;
    MV.begin('cafe',t,{cups:false,cam:[900+180*k,545,1]});
    MV.actor('boy',360+off,850,U,t,{action:'run',mood:'happy',aR:.55});
    MV.actor('girl',880+off,850,U,t,{action:'run',mood:'playful',phase:.45});
    loose(1210+460*k,340+25*Math.sin(l*1.5),t);MV.trail(220+off,750,t);MV.end();
  },{transition:'paper',name:'a-shared-pursuit'});
  MV.shot(A[8],(t,l,d)=>{
    const a=A[8],x=cv(l,.3,2.1,500,850),j=jump(t,a+2.25,a+3.25,3.8);
    MV.begin('cafe',t,{cups:false,cam:[1030,545,1]});
    const b=MV.actor('boy',x,850,U,t,{action:l<2.1?'run':'idle',keys:[[a,'hopeful'],[a+3.55,'proud']],...j,aR:.65,view:'front'});
    MV.actor('girl',cv(l,.5,2.5,1120,1390),850,U,t,{action:l<2.5?'run':'wave',keys:[[a,'happy'],[a+2.5,'surprised'],[a+3.7,'happy']],phase:.4});
    const k=ease(seg(l,2.25,2.85)),anchor=[lerp(1120,b.R[0],k),lerp(635,b.R[1],k)];
    const target=[b.R[0]+20+12*Math.sin(t*1.5),b.R[1]-255+8*Math.sin(t*1.9)];
    MV.balloon(lerp(1170,target[0],k),lerp(350,target[1],k),79,t,anchor);MV.end();
  },{transition:'iris',name:'a-catch-the-thread'});
  MV.shot(A[9],(t,l,d)=>{
    const a=A[9],x=kf(l,[[0,580],[.6,580],[1.8,790],[2.65,650],[4.55,720]]);
    MV.begin('river',t,{cam:[960,555,1.04]});
    const b=MV.actor('boy',x,F,36,t,{action:'walk',keys:[[a,'hopeful'],[a+1.9,'shy'],[a+3.6,'hopeful']],aR:.2});held(b,t);
    MV.actor('girl',1280,F,U,t,{action:'idle',keys:[[a,'happy'],[a+2.7,'hopeful']],aL:.35});MV.end();
  },{transition:'paper',name:'a-rehearsing-courage'});
  MV.shot(A[10],(t,l,d)=>{
    const a=A[10];MV.begin('river',t,{cam:[960,550,1.05]});
    const b=MV.actor('boy',650+30*ease(seg(l,.4,1.2)),F,36,t,{keys:[[a,'shy'],[a+.65,'hopeful'],[a+3.5,'happy']],aR:.2,aL:.55});held(b,t);
    const g=MV.actor('girl',1280-35*ease(seg(l,2.8,3.7)),F,U,t,{keys:[[a,'hopeful'],[a+3.2,'surprised'],[a+3.8,'happy']],aL:.3,aR:.25});
    const k=ease(seg(l,.8,3)),p=arcPt(b.L,g.L,185,k);planeHeart(p[0],p[1]-10,t);
    MV.hearts(g.x,535,t,l-3.65,2,{r:17,life:2});MV.end();
  },{transition:'paper',name:'a-paper-plane-greeting'});
  MV.shot(A[11],(t,l,d)=>{
    const a=A[11],lift=kf(l,[[0,0],[.55,0],[1.4,125],[2.7,125],[3.7,0],[5,0]]),x=cv(l,.7,3.6,640,835);
    MV.begin('river',t,{cam:[990,535,1.03]});
    const b=MV.actor('boy',x,F,36,t,{action:'float',keys:[[a,'happy'],[a+.9,'surprised'],[a+3.85,'relieved']],dy:-lift/36,aR:.2,aL:.85,rot:.07*Math.sin(l*2),walk:bpOf(t)/2});held(b,t);
    MV.actor('girl',kf(l,[[0,1280],[1.15,1350],[2.8,1310],[4.2,1280]]),F,U,t,{action:'walk',keys:[[a,'happy'],[a+.9,'surprised'],[a+2,'playful'],[a+4.3,'happy']],aL:.6});MV.end();
  },{transition:'balloon',name:'a-balloon-tug'});
  MV.shot(A[12],(t,l,d)=>{
    const a=A[12],bx=cv(l,.4,1.6,500,705),gx=cv(l,1.4,2.6,1390,1210);
    MV.begin('river',t,{cam:[960,555,1.04]});
    const b=MV.actor('boy',bx,F,36,t,{action:l<1.6?'walk':'idle',keys:[[a,'shy'],[a+.5,'hopeful'],[58.9,'happy']],aR:.15,rot:0,dy:0});
    const g=MV.actor('girl',gx,F,U,t,{action:l<2.6?'walk':'idle',keys:[[a,'hopeful'],[58.2,'surprised'],[59,'love']],aL:.15,aR:.2,rot:0,dy:0});
    const transfer=ease(seg(t,58.05,58.95)),anchor=[lerp(b.R[0],g.L[0],transfer),lerp(b.R[1],g.L[1],transfer)];
    MV.balloon(anchor[0]+20+Math.sin(t*1.5)*12,anchor[1]-255+Math.sin(t*1.9)*8,79,t,anchor);
    if(t>58.05)MV.joinHands(b,g,t,{width:11});MV.hearts(1130,520,t,t-59.1,3,{r:19,life:2.5});MV.end();
  },{transition:'paper',name:'a-the-accepted-gift'});
})();
