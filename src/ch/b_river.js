/* RIVER / PAPER BOAT — ten readable moving shots, each with cause and response.
60.69–65.23 invitation: girl skips right, boy follows, both settle happily.
65.23–70.42 promenade: travel 540px, brake, turn front, meet inner hands.
70.42–75.33 dance: boy winds up and turns through drawn views; girl answers.
75.33–80.32 bridge: boy jumps first, then girl leaps to the next paper step.
80.32–85.29 chase: a paper heart skims right; boy runs after and catches it.
85.29–90.05 triumph: he presents the heart, she responds, they hop together.
90.05–94.62 folding: they inspect a page, it folds into a boat, they delight.
94.62–99.40 boarding: boy jumps aboard, girl answers, then the boat drifts.
99.40–104.42 downstream: hull travels 650px; a wave causes balancing arms.
104.42–108.66 destination: sail through a cream postcard frame and wave.
Each action gets anticipation, action, and at least a short reaction hold.
All seams use the shared cover. Girl always holds the primary red balloon.
*/
(() => {
  const C=MV.C, floor=878, U=35;
  const cuts=[60.69,65.23,70.42,75.33,80.32,85.29,90.05,94.62,99.4,104.42].map(SONG.near);
  const curve=(t,a,b,x,y)=>lerp(x,y,ease(seg(t,a,b)));
  const balloon=(a,t)=>MV.heldBalloon(a,t,{hand:'R',r:77,rise:248,dx:16});
  function hop(who,t,a,b,from,to,opts={}) {
    if(t>b+.42)return MV.actor(who,to[0],to[1],U,t,{mood:'happy',...opts});
    return MV.leap(who,t,a,b,from,to,U,125,{mood:'happy',view:'front',...opts});
  }
  function paper(x,y,w,h,t,key='sheet') {
    boilSeed('b-'+key);paint(rectPts(x-w/2,y-h/2,w,h,3),{wash:C.cream,ink:'#A7978D',sw:.35});
    inkLine([[x-w*.38,y+h*.28],[x+w*.35,y+h*.28]],.2,'#D8C2AC','dry');
  }
  function rim(x,y,w,t) {
    boilSeed('b-front-rim');paint([[x-w*.55,y],[x,y+25],[x+w*.55,y],[x+w*.33,y+w*.2],[x-w*.32,y+w*.2]],{wash:'#E6CFB4',ink:'#9D8878',sw:.42});
    inkLine([[x,y+25],[x,y+w*.19]],.24,'#AF9580','inkfine');
  }
  function wake(x,y,t) {
    boilSeed('b-wake');for(let i=0;i<3;i++)inkLine([[x-600-i*55,y+55+i*24],[x-410-i*50,y+58+i*24]],.25,'#E9DDD0','dry');
  }
  MV.shot(cuts[0],(t,l,d)=>{
    const a=cuts[0]; MV.begin('river',t,{cam:[960+50*ease(l/d),550,1.02]});
    hop('boy',t,a+1.7,a+2.65,[560,floor],[785,floor],{keys:[[a,'happy'],[a+1.2,'excited'],[a+3,'happy']],aR:.2});
    const g=hop('girl',t,a+.65,a+1.6,[1110,floor],[1335,floor],{keys:[[a,'happy'],[a+.4,'playful'],[a+2.7,'love']],aR:.2});balloon(g,t);
    MV.hearts(1060,560,t,l-3,2,{r:18,life:2});MV.end();
  },{transition:'paper',name:'b-invitation-skip'});
  MV.shot(cuts[1],(t,l,d)=>{
    const k=ease(seg(l,.35,3.3)),off=540*k;
    MV.begin('river',t,{cam:[800+off*.8,555,1.03]});
    const moving=l<3.35,settle=ease(seg(l,3.2,3.7));
    const b=MV.actor('boy',450+off,floor,U,t,{action:moving?'run':'dance',view:moving?'q':'front',mood:'happy',aR:.15,rot:.025*Math.sin(t*3),dy:moving?-.65*Math.abs(Math.sin(bpOf(t)*Math.PI)):0});
    const g=MV.actor('girl',950+off,floor,U,t,{action:moving?'run':'dance',view:moving?'q':'front',mood:'happy',phase:.3,aL:.15,aR:.2,rot:.025*Math.sin(t*3),dy:moving?-.65*Math.abs(Math.sin(bpOf(t)*Math.PI)):0});
    if(settle>.5)MV.joinHands(b,g,t);balloon(g,t);if(moving)MV.trail(b.x-160,780,t);MV.end();
  },{transition:'paper',name:'b-riverside-run'});
  MV.shot(cuts[2],(t,l,d)=>{
    const a=cuts[2],sx=curve(l,3.1,4.3,0,210);
    MV.begin('river',t,{cam:[960+sx*.55,545,1.06]});
    MV.actor('boy',610+sx,floor,U,t,{action:'dance',mood:'playful',...turn(t,a+.65,a+2.15,0,1),aR:.55});
    const g=MV.actor('girl',1130+sx,floor,U,t,{action:'dance',mood:'happy',...turn(t,a+1.35,a+2.85,0,1),aR:.2,phase:.35});balloon(g,t);
    MV.hearts(920+sx,500,t,l-3.3,2,{r:18,life:2});MV.end();
  },{transition:'balloon',name:'b-answering-spins'});
  MV.shot(cuts[3],(t,l,d)=>{
    const a=cuts[3];MV.begin('river',t,{cam:[1000,535,1.01]});
    paper(430,895,420,60,t,'bridge-left');paper(870,895,320,60,t,'bridge-middle');paper(1240,895,250,60,t,'bridge-third');paper(1600,895,320,60,t,'bridge-right');
    hop('boy',t,a+.8,a+1.8,[430,floor],[870,floor],{keys:[[a,'hopeful'],[a+2,'happy']],aR:.4});
    const g=hop('girl',t,a+2.35,a+3.4,[1240,floor],[1600,floor],{keys:[[a,'hopeful'],[a+3.6,'happy']],aR:.2});balloon(g,t);MV.end();
  },{transition:'paper',name:'b-paper-bridge'});
  MV.shot(cuts[4],(t,l,d)=>{
    const a=cuts[4],k=ease(seg(l,.7,3.35)),off=600*k;
    MV.begin('river',t,{cam:[800+off*.62,555,1]});
    const b=MV.actor('boy',580+off,floor,U,t,{action:l<3.4?'run':'wave',view:'front',keys:[[a,'surprised'],[a+.6,'hopeful'],[a+3.5,'proud']],aR:.8});
    const g=MV.actor('girl',1200+off*.8,floor,U,t,{action:l<3.6?'run':'dance',view:'front',mood:'playful',aR:.2,phase:.45});balloon(g,t);
    const catchK=ease(seg(l,2.9,3.4)),hx=lerp(920+off*.6,b.R[0],catchK),hy=lerp(535-35*Math.sin(l*2),b.R[1]-16,catchK);
    MV.heart(hx,hy,27,t,'#C98697');if(l<3.3)MV.trail(b.x-130,780,t);MV.end();
  },{transition:'iris',name:'b-catch-a-heart'});
  MV.shot(cuts[5],(t,l,d)=>{
    const a=cuts[5],k=ease(seg(l,.45,1.4));MV.begin('river',t,{cam:[960,560,1.05]});
    paper(1540,875,280,35,t,'waiting-boat');
    const jb=jump(t,a+2.2,a+3,3.2),jg=jump(t,a+2.34,a+3.14,3.2);
    const b=MV.actor('boy',610+90*k,floor,U,t,{mood:'proud',action:'dance',...jb,aR:.55,view:'front'});
    const g=MV.actor('girl',1200-40*k,floor,U,t,{keys:[[a,'love'],[a+3.65,'hopeful']],action:'dance',...jg,aR:.2,aL:.35,view:'front'});balloon(g,t);
    MV.heart(b.R[0],b.R[1]-15,27,t,'#C98697');MV.hearts(940,530,t,l-1.2,2,{r:17,life:2});MV.end();
  },{transition:'balloon',name:'b-shared-hop'});
  MV.shot(cuts[6],(t,l,d)=>{
    const a=cuts[6],fold=ease(seg(l,1.25,3.15)),y=902,x=1030,w=940;
    MV.begin('river',t,{boatOnly:true,cam:[1000,555,1]});
    paper(500,880,410,38,t,'fold-left-dock');paper(1400,880,410,38,t,'fold-right-dock');
    boilSeed('b-folding-page');
    paint([[x-w*.55,y],[x+w*.55,y],[x+w*(.55-.22*fold),y+18+145*fold],[x-w*(.55-.23*fold),y+18+145*fold]],{wash:'#EEDCC5',ink:'#9D8878',sw:.45});
    paint([[x-w*.34,y],[x,y-180*fold],[x+w*.34,y]],{wash:C.cream,ink:'#A18E7E',sw:.35});
    inkLine([[x,y-180*fold],[x,y]],.25,'#A18E7E','inkfine');
    const shift=curve(l,.35,1.2,0,120);
    MV.actor('boy',420+shift,860,U,t,{action:l<1.2?'walk':'idle',keys:[[a,'hopeful'],[a+2.8,'surprised'],[a+3.5,'happy']],aR:.55});
    const g=MV.actor('girl',1450-shift,860,U,t,{action:l<1.2?'walk':'idle',keys:[[a,'hopeful'],[a+2.9,'surprised'],[a+3.6,'happy']],aR:.2});balloon(g,t);MV.end();
  },{transition:'paper',name:'b-page-becomes-boat'});
  MV.shot(cuts[7],(t,l,d)=>{
    const a=cuts[7],drift=curve(l,3.4,4.7,0,130),by=845+5*Math.sin(t*2);
    MV.begin('river',t,{boatOnly:true,cam:[990+drift*.5,540,1]});
    paper(330,895,330,40,t,'board-left-dock');paper(1610,895,330,40,t,'board-right-dock');
    wake(1000+drift,by,t);MV.boat(1000+drift,by,1000,t);
    hop('boy',t,a+.6,a+1.6,[390,878],[755+drift,by],{keys:[[a,'hopeful'],[a+1.9,'happy']],aR:.45});
    const g=hop('girl',t,a+2,a+3,[1530,878],[1250+drift,by],{keys:[[a,'hopeful'],[a+3.35,'happy']],aR:.2});balloon(g,t);rim(1000+drift,by,1000,t);MV.end();
  },{transition:'paper',name:'b-jump-aboard'});
  MV.shot(cuts[8],(t,l,d)=>{
    const off=curve(l,.2,4.6,0,650),x=660+off,by=850+19*Math.sin(l*1.5),lean=.1*Math.sin(l*1.5);
    MV.begin('river',t,{boatOnly:true,cam:[780+off*.75,545,1.02]});wake(x,by,t);MV.boat(x,by,1000,t);
    MV.actor('boy',x-245,by,U,t,{action:'float',keys:[[cuts[8],'happy'],[cuts[8]+1.4,'surprised'],[cuts[8]+2.8,'happy']],rot:lean,aR:.9,dy:0});
    const g=MV.actor('girl',x+250,by,U,t,{action:'float',mood:'happy',rot:lean,aR:.2,dy:0});balloon(g,t);rim(x,by,1000,t);MV.end();
  },{transition:'balloon',name:'b-downstream-balance'});
  MV.shot(cuts[9],(t,l,d)=>{
    const x=curve(l,.25,3.5,580,1100),by=850+7*Math.sin(l*2);
    MV.begin('river',t,{boatOnly:true,cam:[960,540,1]});
    boilSeed('b-postcard');paint(rectPts(155,112,1610,55,3),{wash:C.cream,ink:'#B9A28D',sw:.35});
    paint(rectPts(155,112,52,850,3),{wash:C.cream,ink:'#B9A28D',sw:.35});
    wake(x,by,t);MV.boat(x,by,1000,t);
    MV.actor('boy',x-245,by,U,t,{action:l>2.8?'wave':'float',mood:'happy',dy:0});
    const g=MV.actor('girl',x+250,by,U,t,{action:'float',keys:[[cuts[9],'happy'],[cuts[9]+2.8,'love']],aR:.2,dy:0});balloon(g,t);rim(x,by,1000,t);
    boilSeed('b-postcard-front');paint(rectPts(1713,112,52,850,3),{wash:C.cream,ink:'#B9A28D',sw:.35});
    paint(rectPts(155,960,1610,65,3),{wash:C.cream,ink:'#B9A28D',sw:.35});MV.end();
  },{transition:'paper',name:'b-enter-postcard'});
})();
