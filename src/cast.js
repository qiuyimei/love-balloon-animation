const MV = (() => {
  PAL.ink = '#48333C';
  const C = {paper:'#F3EBDC', ink:'#48333C', peach:'#EDC1AD', rose:'#D95C71', pink:'#DB9FA9', clay:'#D97757', river:'#A9BCC3', sage:'#9CA887', blue:'#A3B6C5', gold:'#DFAE67', night:'#353951', cream:'#FFF0D6'};
  const cast = {
    boy:{col:'#D97757',dk:'#AC5C48',lt:'#F2AE80'},
    girl:{col:'#DB9FA9',dk:'#AF7584',lt:'#F1C3C6',hat:'bow'}
  };
  const cuts=[];
  const motion = (action,t,o={}) => {
    const b=bpOf(t)+(o.phase||0), s=Math.sin(b*TAU), ab=Math.abs(Math.sin(b*Math.PI)), amp=o.amp??1;
    switch(action) {
      case 'run': return {view:'q',flip:(o.dir||1)<0,walk:b/1.5,dy:-1.15*ab*amp,rot:.07*(o.dir||1),aL:.65*s,aR:-.65*s,sq:.05*Math.cos(b*TAU)};
      case 'walk': return {view:'front',walk:b/2,dy:-.45*ab*amp,rot:.035*s,aL:.4*s,aR:-.4*s};
      case 'dance': return {view:'front',walk:b/2,dy:-.8*ab*amp,rot:.09*s,dx:.18*s,aL:.45+.65*s,aR:.45-.65*s,legLift:[Math.max(0,s)*.65,Math.max(0,-s)*.65,Math.max(0,s)*.65,Math.max(0,-s)*.65],legSplay:.16};
      case 'spin': return {...spinView(b/6),walk:b/2,dy:-.5*ab,rot:.04*s,aL:.55,aR:.55};
      case 'float': return {view:'front',dy:-.25*Math.sin(t*2),rot:.1*Math.sin(t*1.7),aL:.85,aR:.85,walk:b/5};
      case 'wave': return {view:'front',dy:-.35*ab,rot:.035*s,aL:-.4,aR:1+.2*Math.sin(t*8)};
      default: return {dy:-.18*ab,rot:.018*Math.sin(t*2)};
    }
  };
  function hand(x,y,u,p,which='R') {
    const v=VIEWS[p.view]||VIEWS.front;
    const a=v.arms.find(a=>a[2]===which)||v.arms[0];
    const [px,dir,actual]=a, angle=(actual==='R'?p.aR:p.aL)??.2;
    const len=typeof p.armLen==='number'?p.armLen:(p.armLen?.[actual]??1);
    let xx,yy;
    if(dir===0) { xx=px+2.1*len*Math.cos(.7-angle); yy=-4.2+2.1*len*Math.sin(.7-angle); }
    else { xx=px+dir*.55*clamp((Math.abs(angle)-.7)/.9)+dir*2.2*len*Math.cos(angle); yy=-4.5-2.2*len*Math.sin(angle); }
    const sq=(p.sq||0)+(p.take||0), sm=clamp(p.smear||0), rot=p.rot||0;
    xx*=u*(p.flip?-1:1)*(p.sx??1)*(1+sq*.6)*(1+sm*.35); yy*=u*(p.sy??1)*(1-sq);
    return [x+(p.dx||0)*u+xx*Math.cos(rot)-yy*Math.sin(rot),y+(p.dy||0)*u+xx*Math.sin(rot)+yy*Math.cos(rot)];
  }
  function actor(who,x,y,u,t,o={}) {
    const design=cast[who]||cast.boy;
    let mood=o.keys?emotions(t,o.keys,{base:design,take:.28}):feel(o.mood||'happy',t,{emote:null});
    const p={...design,...mood,...motion(o.action||'idle',t,o),...o,emote:o.emote??null,boilKey:who,swMul:.72};
    p.col=o.col||mood.col||design.col;p.dk=o.dk||mood.dk||design.dk;p.lt=o.lt||mood.lt||design.lt;
    if(o.sing) p.mouth=['smile','sing','O','sing'][Math.floor(bpOf(t)*4)%4<0?0:Math.floor(bpOf(t)*4)%4];
    clawd(x,y,u,p);
    return {who,x,y,u,pose:p,L:hand(x,y,u,p,'L'),R:hand(x,y,u,p,'R')};
  }
  function leap(who,t,a,b,from,to,u=32,h=150,o={}) {
    const k=ease(seg(t,a,b)), jp=jump(t,a,b,h/u);
    return actor(who,lerp(from[0],to[0],k),lerp(from[1],to[1],k),u,t,{action:'run',...o,...jp,walk:k*1.5,rot:(o.rot||0)+.1*Math.sin(k*Math.PI)});
  }
  function heart(x,y,r,t=0,col=C.rose) {
    if(r<.2)return;
    boilSeed('heart-'+Math.round(x/50)+'-'+Math.round(y/50));
    paint(heartPts(x,y,r,28),{wash:col,ink:r>50?'#93505B':null,sw:.45});
    if(r>45) inkLine([[x-r*.44,y-r*.3],[x-r*.53,y-r*.59],[x-r*.36,y-r*.72]],.45,'#F2A6AA','dry',.5);
  }
  function balloon(x,y,r,t,anchor=null,o={}) {
    if(anchor) {
      boilSeed('balloon-thread');
      inkLine([[x,y+r*.99],[x+Math.sin(t*2)*13,y+r*1.7],[(x+anchor[0])/2-18,anchor[1]-70],anchor],.25,'#956B75','inkfine',.55);
    }
    push();translate(x,y);rotate(.04*Math.sin(t*1.9));heart(0,0,r,t,o.col||C.rose);
    boilSeed('balloon-knot');paint([[-5,r*.94],[6,r*.94],[3,r*1.08],[-4,r*1.08]],{wash:o.col||C.rose,ink:null});pop();
  }
  function heldBalloon(a,t,o={}) {
    const anchor=a[o.hand||'R'], r=o.r||82;
    const bx=anchor[0]+(o.dx??30)+Math.sin(t*1.5)*12,by=anchor[1]-(o.rise??270)+Math.sin(t*1.9)*8;
    balloon(bx,by,r,t,anchor,o);return [bx,by];
  }
  function joinHands(a,b,t,o={}) {
    const p=a[o.a||'R'],q=b[o.b||'L'];
    if(Math.hypot(p[0]-q[0],p[1]-q[1])>100)return;
    boilSeed('joined-hands');paint(ribbon([p,[(p[0]+q[0])/2,(p[1]+q[1])/2+4],q],o.width||12, o.width||12),{wash:'#DF9A87',ink:'#754E52',sw:.22});
  }
  function hearts(x,y,t,age,n=3,o={}) {
    for(let i=0;i<n;i++) {
      const a=age-i*.3,k=ease(seg(a,0,.4));if(k<=.001)continue;
      const life=o.life||4,fade=1-ease(seg(a,life-.6,life));if(fade<=.001)continue;
      heart(x+(i-(n-1)/2)*57+Math.sin(a*2+i)*12,y-a*65-i*18,(o.r||17)*k*fade,t,o.col||'#D98C95');
    }
  }
  function trail(x,y,t,dir=1) {
    boilSeed('moving-trail');for(let i=0;i<3;i++)inkLine([[x-dir*(60+i*18),y+i*18],[x-dir*(105+i*32),y+i*18+3]],.28,C.gold,'inkfine');
  }
  function paperFrame(x,y,w,h,t,o={}) {
    boilSeed('paper-window-'+Math.round(x));
    paint(rectPts(x+9,y+12,w,h,3),{wash:'#B6ADAA',washOp:65,ink:null});
    paint(rrPts(x,y,w,h,15,2),{wash:o.col||C.cream,ink:o.ink||'#A7978D',sw:.38});
    paint(rectPts(x+1,y+1,w-2,31,1),{wash:o.bar||'#D6DDE0',ink:null});
    for(let i=0;i<3;i++)paint(ellPts(x+18+i*18,y+16,4,4,9),{wash:['#D88E91','#DAB87A','#9AAE8D'][i],ink:null});
  }
  function coffee(x,y,r,t,o={}) {
    boilSeed('coffee-cup');
    paint(ellPts(x,y+12,r*1.2,r*.25,22),{wash:'#C4AA94',washOp:100,ink:null});
    paint([[x-r*.8,y-r*.9],[x+r*.8,y-r*.9],[x+r*.59,y],[x-r*.57,y]],{wash:o.col||'#F4E8CE',ink:C.ink,sw:.42});
    inkLine([[x+r*.76,y-r*.7],[x+r*1.18,y-r*.66],[x+r*1.2,y-r*.27],[x+r*.65,y-r*.2]],.6,'#A78977','inkfine');
    paint(ellPts(x,y-r*.9,r*.81,r*.18,22),{wash:'#9B7864',ink:'#7F6252',sw:.25});
    for(let i=0;i<2;i++){boilSeed('coffee-steam-'+i);const sx=x+(i-.5)*r*.45;inkLine([[sx,y-r*1.2],[sx+Math.sin(t*2+i)*15,y-r*1.6],[sx-8,y-r*2]],.27,'#B2AAA4','dry');}
  }
  function boat(x,y,w,t,o={}) {
    boilSeed('paper-boat');
    paint([[x-w*.55,y],[x+w*.55,y],[x+w*.33,y+w*.2],[x-w*.32,y+w*.2]],{wash:o.col||'#EEDCC5',ink:'#9D8878',sw:.45});
    paint([[x-w*.34,y],[x,y-w*.23],[x+w*.34,y]],{wash:'#F3EBDD',ink:'#A18E7E',sw:.35});
    inkLine([[x,y-w*.23],[x,y]],.25,'#A18E7E','inkfine');
  }
  function plane(x,y,r,t,o={}) {
    boilSeed('paper-plane');push();translate(x,y);rotate(o.rot||0);
    paint([[-r,r*.22],[r,-r*.2],[-r*.3,r*.55],[-r*.1,r*.07]],{wash:o.col||C.cream,ink:'#A68B7D',sw:.35});
    inkLine([[-r*.1,r*.07],[r,-r*.2]],.24,'#A68B7D','inkfine');pop();
  }
  function cover(p,type='paper',seed=0) {
    if(p<=0||p>=1)return;
    const k=p<.5?ease(p*2):1-ease((p-.5)*2);
    if(type==='balloon') {
      heart(960,540,3500*k,0,'#E4AFB1');
      if(k>.985){boilSeed('balloon-seam-cover');paint(rectPts(-40,-40,2000,1160),{wash:'#E4AFB1',ink:null});}
      return;
    }
    if(type==='iris') {iris(960,540,2300*(1-k),C.paper);return;}
    const x=p<.5?lerp(2300,-40,ease(p*2)):lerp(-40,-2400,ease((p-.5)*2));
    boilSeed('page-wipe');paint(rectPts(x,-100,2400,1300,7),{wash:C.paper,ink:null});
    inkLine([[x+18,-100],[x+18,1200]],.7,'#D7B8A2','dry');
  }
  function shot(at,fn,o={}) {
    const start=at<=0?0:SONG.near(at), item={t:start,transition:o.transition||'paper',name:o.name||''};
    cuts.push(item);cuts.sort((a,b)=>a.t-b.t);
    shots([[start,(t,lt,dur)=>{
      fn(t,lt,dur);
      const span=.17;
      if(start>0&&lt<span&&item.transition!=='none') cover(.5+.5*lt/span,item.transition);
      const next=cuts.find(c=>Math.abs(c.t-(start+dur))<.003);
      if(next&&t>next.t-span&&next.transition!=='none')cover(.5*seg(t,next.t-span,next.t),next.transition);
      if(start===0&&t<.48)iris(960,540,2300*easeOut(t/.48),C.paper);
      if(t>215.1)iris(960,540,2300*(1-ease(seg(t,215.1,215.95))),C.paper);
    }]]);
  }
  return {C,cast,cuts,FLOOR:878,actor,motion,leap,hand,heart,hearts,balloon,heldBalloon,joinHands,trail,paperFrame,coffee,boat,plane,cover,shot,at:(bar,beat=0)=>SONG.near(beatT(bar,beat))};
})();
