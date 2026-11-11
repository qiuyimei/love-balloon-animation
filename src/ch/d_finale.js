(() => {
  /* Finale shot reads (measured audio cuts):
   * 174.96–179.18: basket takes weight, rises 220 px, city falls away; delighted look down.
   * 179.18–183.78: wind crosses from left, vessel banks and travels right; surprise then laughter.
   * 183.78–188.54: boy tests weightlessness and lands; girl answers with a hop and drawn turn.
   * 188.54–193.55: cream paper window arrives; boat travels into its warm opening.
   * 193.55–197.53: passengers descend into the original desk window and settle.
   * 197.53–201.65: staggered jumps out of the basket; boy brings coffee, girl follows.
   * 201.65–206.14: three illustrated memories slide along arcs into one shared postcard.
   * 206.14–216: step together, nestle beside coffee, enjoy the heart; quiet breathing.
   * Final shot is continuous; the shared wrapper alone closes the ending iris.
   */
  const C=MV.C;
  const A=[174.96,179.18,183.78,188.54,193.55,197.53,201.65,206.14].map(SONG.near);
  function cloud(x,y,w,t,key) {
    boilSeed('d-cloud-'+key);
    paint(ellPts(x,y,w,w*.19,25,4),{wash:'#C3B0BF',ink:null,washOp:175});
    paint(ellPts(x-w*.12,y-w*.08,w*.48,w*.18,22,3),{wash:'#C3B0BF',ink:null,washOp:175});
  }
  function flightSet(t,progress=0) {
    MV.begin('sky',t,{night:true});
    push();translate(-progress*230,270+progress*230);MV.skyline(t,true,{towerX:310});pop();
    cloud(220-100*progress,520,220,t,1);cloud(1670-240*progress,470,260,t,2);
  }
  function basketBack(t,w=970) {
    boilSeed('d-basket-back');
    paint([[-w*.53,-34],[-w*.39,-82],[w*.39,-82],[w*.53,-34],[w*.36,100],[-w*.36,100]],{wash:'#D4BCA7',ink:'#A18D7C',sw:.36});
  }
  function basketFront(t,w=970) {
    boilSeed('d-basket-front');
    paint([[-w*.53,-16],[0,35],[w*.53,-16],[w*.35,126],[-w*.34,126]],{wash:'#EFE1CA',ink:'#A18D7C',sw:.38});
    inkLine([[-w*.53,-16],[0,35],[w*.35,126]],.3,'#B79C86','inkfine');
    inkLine([[w*.53,-16],[0,35],[-w*.34,126]],.3,'#B79C86','inkfine');
  }
  function supports(t) {
    MV.balloon(-400+12*Math.sin(t),-510,63,t,[-450,-32],{col:'#D7AB83'});
    MV.balloon(-95+9*Math.sin(t*1.2),-585,54,t,[-290,-45],{col:'#D7A4B3'});
  }
  function passengers(t,start,opts={}) {
    const common={noShadow:true,keys:[[start,'hopeful'],[start+.9,'surprised'],[start+1.55,'happy']]};
    const b=MV.actor('boy',-235,0,34,t,{...common,...opts.boy});
    const g=MV.actor('girl',235,0,34,t,{...common,phase:.4,aR:.2,...opts.girl});
    MV.heldBalloon(g,t,{r:101,rise:295,dx:20});return [b,g];
  }
  function cupInHand(t) {return (u,sw)=>MV.coffee(22,18,34,t,{col:'#F5E9D2'});}
  function postcard(t,x,y,w,h,kind) {
    MV.paperFrame(x,y,w,h,t,{col:kind===0?'#D7CFBF':kind===1?'#D9BDAD':'#CBD2C9',bar:'#E1D3BC'});
    if(kind===0)MV.coffee(x+w*.5,y+h*.76,w*.17,t);
    else if(kind===1)MV.boat(x+w*.5,y+h*.66,w*.55,t);
    else MV.heart(x+w*.5,y+h*.58,w*.19,t,'#CF8898');
  }
  function littleTable(t) {
    boilSeed('d-coffee-table');
    paint([[867,885],[1053,885],[1038,928],[880,928]],{wash:'#C8AA91',ink:null});
    MV.coffee(958,885,57,t);
  }
  MV.shot(A[0],(t,lt,dur)=>{
    const k=ease(seg(lt,.35,3.3)),x=lerp(770,1000,k),y=lerp(930,745,k);
    flightSet(t,k);
    push();translate(x,y);rotate(.024*Math.sin(lt*2));supports(t);basketBack(t);
    passengers(t,A[0],{boy:{view:'q',lookY:lt<2.3?.7:0,aL:.4,aR:.6},girl:{lookY:lt<2.7?.7:0}});basketFront(t);pop();MV.end();
  },{transition:'balloon',name:'basket-lifts-above-paris'});
  MV.shot(A[1],(t,lt,dur)=>{
    const travel=ease(seg(lt,.5,3.6)),gust=Math.sin(Math.PI*seg(lt,.6,2.9));
    flightSet(t,.7+travel*.7);
    for(let i=0;i<3;i++){boilSeed('d-wind-'+i);const wx=lerp(-400,2000,ease(seg(lt,.45+i*.16,1.6+i*.16)));inkLine([[wx,350+i*95],[wx+200,340+i*95],[wx+310,355+i*95]],.35,'#A696AC','dry');}
    push();translate(lerp(670,1135,travel),770-70*Math.sin(travel*Math.PI));rotate(.105*gust);
    supports(t);basketBack(t);
    passengers(t,A[1],{boy:{...turn(t,A[1]+.65,A[1]+1.1,0,.25),aL:.9,aR:.4,rot:-.14*gust,keys:[[A[1],'happy'],[A[1]+.8,'surprised'],[A[1]+2.4,'laugh']]},girl:{rot:-.11*gust,keys:[[A[1],'happy'],[A[1]+1.1,'surprised'],[A[1]+2.6,'laugh']]}});
    basketFront(t);pop();MV.end();
  },{transition:'paper',name:'wind-carries-paper-vessel'});
  MV.shot(A[2],(t,lt,dur)=>{
    flightSet(t,1.25+lt*.07);push();translate(930+55*Math.sin(lt*.8),825-12*Math.sin(lt*2));rotate(.022*Math.sin(lt*2));
    supports(t);basketBack(t);
    const bk=[[A[2],'playful'],[A[2]+1.9,'happy']],gk=[[A[2],'playful'],[A[2]+3.8,'love']];
    if(lt<1.75)MV.leap('boy',t,A[2]+.6,A[2]+1.65,[-260,0],[-155,0],35,170,{keys:bk,noShadow:true,aL:1,aR:.6});
    else MV.actor('boy',-155,0,35,t,{keys:bk,noShadow:true,lookX:.8,aR:.3});
    let g;
    if(lt<3.7)g=MV.leap('girl',t,A[2]+2.1,A[2]+3.55,[270,0],[320,0],34,130,{keys:gk,noShadow:true,aL:.2,aR:.2,...turn(t,A[2]+2.2,A[2]+3.25,0,1)});
    else g=MV.actor('girl',320,0,34,t,{keys:gk,noShadow:true,aL:.2,aR:.2});
    MV.balloon(g.x+250,g.y+(g.pose.dy||0)*34-520,98,t,g.R);basketFront(t);pop();MV.end();
  },{transition:'balloon',name:'weightless-question-and-answer'});
  MV.shot(A[3],(t,lt,dur)=>{
    const k=ease(seg(lt,.5,4.3));flightSet(t,1.5+lt*.12);
    const px=lerp(1950,1050,ease(seg(lt,.2,2.3)));
    MV.paperFrame(px,170,850,760,t,{col:'#F0E8D5',bar:'#D6DED9'});
    boilSeed('d-portal-sill');inkLine([[px+35,835],[px+810,835]],.3,'#D4BEA4','inkfine');
    push();translate(lerp(610,1190,k),lerp(800,720,k));scale(lerp(1,.83,k));rotate(-.035*Math.sin(k*Math.PI));
    supports(t);basketBack(t);passengers(t,A[3],{boy:{action:'wave',mood:'excited'},girl:{mood:'happy',lookX:.8}});basketFront(t);pop();MV.end();
  },{transition:'paper',name:'flying-home-through-paper'});
  MV.shot(A[4],(t,lt,dur)=>{
    const k=ease(seg(lt,.3,2.65));MV.begin('desk',t);
    push();translate(lerp(700,935,k),lerp(625,817,k));scale(.84);rotate(.025*Math.sin(lt*2)*(1-k));
    supports(t);basketBack(t);passengers(t,A[4],{boy:{aL:.6,aR:.65,keys:[[A[4],'surprised'],[A[4]+2.6,'relieved']]},girl:{keys:[[A[4],'hopeful'],[A[4]+2.8,'happy']]}});basketFront(t);pop();MV.end();
  },{transition:'paper',name:'soft-landing-in-original-window'});
  MV.shot(A[5],(t,lt,dur)=>{
    MV.begin('desk',t);
    const bx=lerp(935,-650,ease(seg(lt,2.9,4.1)));
    push();translate(bx,817);scale(.84);supports(t);basketBack(t);basketFront(t);pop();
    let b,g;
    if(lt<1.8)b=MV.leap('boy',t,A[5]+.45,A[5]+1.55,[738,817],[655,880],35,155,{mood:'excited',armR:cupInHand(t),aR:.15,noShadow:true});
    else b=MV.actor('boy',lerp(655,735,ease(seg(lt,1.8,2.7))),880,35,t,{action:lt<2.7?'walk':'idle',mood:'hopeful',aR:.15,armR:cupInHand(t),lookX:.8});
    if(lt<2.9)g=MV.leap('girl',t,A[5]+1.5,A[5]+2.65,[1132,817],[1280,880],35,150,{mood:'happy',aR:.2,noShadow:true});
    else g=MV.actor('girl',1280,880,35,t,{mood:'love',aR:.2,lookX:-.8});
    MV.heldBalloon(g,t,{r:90,rise:300});MV.end();
  },{transition:'paper',name:'hops-from-basket-with-coffee'});
  MV.shot(A[6],(t,lt,dur)=>{
    MV.begin('desk',t);
    const k=ease(seg(lt,.3,1.8));
    MV.paperFrame(lerp(400,350,k),lerp(380,220,k),1220,700,t,{col:'#F5EBD7',bar:'#DCC6B6'});
    for(let i=0;i<3;i++){
      const p=ease(seg(lt,.45+i*.66,2.0+i*.66));
      const x=lerp([-380,1700,1520][i],475+i*350,p),y=lerp([180,-200,850][i],292,p)-Math.sin(p*Math.PI)*70;
      push();translate(x+140,y+95);rotate((1-p)*[-.18,.2,.14][i]);postcard(t,-140,-95,280,190,i);pop();
    }
    MV.actor('boy',735,880,35,t,{mood:'happy',action:'wave',aR:.15,armR:cupInHand(t),lookY:-.4});
    const g=MV.actor('girl',1280,880,35,t,{mood:'happy',aR:.2,lookY:-.5});MV.heldBalloon(g,t,{r:90,rise:300});
    MV.end();
  },{transition:'paper',name:'memories-fit-one-shared-postcard'});
  MV.shot(A[7],(t,lt,dur)=>{
    const settle=ease(seg(lt,.35,2.5));MV.begin('desk',t,{cam:[960,540,1+.018*ease(seg(lt,0,6))]});
    MV.paperFrame(350,220,1220,700,t,{col:'#F5EBD7',bar:'#DCC6B6'});
    for(let i=0;i<3;i++)postcard(t,475+i*350,292,280,190,i);
    MV.actor('boy',lerp(735,805,settle),880,35,t,{action:lt<2.5?'walk':'idle',rot:.025*settle,aL:-.8,aR:-1.1,armLen:{R:.35},keys:[[A[7],'happy'],[A[7]+2.6,'love'],[A[7]+5.9,'sleepy']],lookX:.45});
    const g=MV.actor('girl',lerp(1280,1145,settle),880,35,t,{action:lt<2.5?'walk':'idle',rot:-.025*settle,aL:-1.1,armLen:{L:.35},aR:.2,keys:[[A[7],'happy'],[A[7]+2.85,'love'],[A[7]+6.3,'sleepy']],lookX:-.45,phase:.35});
    MV.heldBalloon(g,t,{r:92,rise:300});littleTable(t);
    MV.hearts(975,580,t,lt-2.9,2,{r:25,life:3.2});MV.end();
  },{transition:'paper',name:'together-in-one-picture-until-paper-close'});
})();
