(() => {
  const C=MV.C;
  function tower(x,y,h,t,col='#C2A48D') {
    boilSeed('paris-tower');
    paint([[x-h*.23,y],[x-h*.14,y-h*.3],[x-h*.04,y-h*.91],[x,y-h],[x+h*.04,y-h*.91],[x+h*.14,y-h*.3],[x+h*.23,y],[x+h*.13,y],[x,y-h*.22],[x-h*.13,y]],{wash:col,ink:null});
    for(const k of [.28,.57,.74])inkLine([[x-h*(1-k)*.2,y-h*k],[x+h*(1-k)*.2,y-h*k]],.25,col,'inkfine');
  }
  function skyline(t,night=false,o={}) {
    boilSeed('skyline');
    const color=night?'#575970':'#C8BDAE';
    paint([[-500,726],[-500,640],[-80,640],[-80,570],[40,530],[150,570],[150,650],[550,650],[550,580],[670,540],[790,580],[790,660],[1100,660],[1100,585],[1210,550],[1320,585],[1320,650],[1650,650],[1650,570],[1780,570],[1780,650],[2500,650],[2500,726]],{wash:color,ink:null});
    tower(o.towerX??430,710,390,t,night?'#777284':'#C2A48D');
  }
  function sky(t,o={}) {
    boilSeed('sky');paint(rectPts(-700,-500,3400,2100),{wash:o.night?C.night:(o.sky||'#F1DDC9'),ink:null});
    boilSeed('sunset');paint(ellPts(1210,250,420,210,25,9),{wash:o.night?'#6E617B':C.peach,washOp:o.night?65:90,ink:null});
    if(o.night){for(let i=0;i<8;i++){boilSeed('star-'+i);const x=150+hash(i+9)*1650,y=80+hash(i+59)*370,r=4+3*(.5+.5*Math.sin(t*1.3+i));paint(starPts(x,y,r),{wash:'#EFD5AE',ink:null});}}
  }
  function river(t,o={}) {
    sky(t,o);skyline(t,o.night,o);
    boilSeed('river');paint(rectPts(-700,714,3400,420),{wash:o.night?'#697891':C.river,ink:null});
    for(let i=0;i<5;i++){boilSeed('river-line-'+i);let x=100+i*390+Math.sin(t*.9+i)*20,y=746+i%2*63;inkLine([[x,y],[x+120,y+2],[x+205,y]],.2,o.night?'#B5B0AF':'#8DA6B1','inkfine');}
    if(!o.boatOnly){
      boilSeed('promenade');paint(rectPts(-700,850,3400,450),{wash:o.night?'#A69A9B':'#E4CEB6',ink:null});
      inkLine([[-700,776],[2700,776]],.4,'#AD927C','inkfine');
      for(let i=0;i<9;i++){const x=-100+i*270;inkLine([[x,776],[x,846]],.22,'#AD927C','inkfine');}
    }
  }
  function cafe(t,o={}) {
    sky(t,o);
    boilSeed('cafe-wall');paint(rectPts(-500,215,2900,820),{wash:'#D8C9B6',ink:null});
    MV.paperFrame(170,280,660,500,t,{col:'#CCD5D2',bar:'#DFBDA9'});
    MV.paperFrame(1080,280,650,500,t,{col:'#D1DBD4',bar:'#DFBDA9'});
    boilSeed('awning');paint(rectPts(-400,150,2800,115),{wash:'#EAC2BD',ink:null});
    for(let i=0;i<8;i++)paint(rectPts(-300+i*335,150,152,115),{wash:'#E9DFCE',ink:null});
    boilSeed('cafe-counter');paint(rectPts(-500,850,2900,430),{wash:'#C7A98E',ink:null});
    inkLine([[-500,852],[2400,852]],.6,'#A08472','inkfine');
    if(o.cups!==false){MV.coffee(435,853,110,t);MV.coffee(1510,853,100,t,{col:'#EACCC3'});}
  }
  function desk(t,o={}) {
    boilSeed('desktop');paint(rectPts(-700,-500,3400,2100),{wash:o.night?'#4D526B':'#C6D3D8',ink:null});
    MV.paperFrame(105,95,1710,895,t,{col:'#F0E8D5',bar:'#D6DED9'});
    for(let i=0;i<4;i++){boilSeed('paper-fiber-'+i);inkLine([[230,310+i*135],[1680,310+i*135]],.12,'#DBD0B9','inkfine');}
    if(o.pages){MV.paperFrame(132,130,520,310,t,{col:'#E8D2C4'});MV.paperFrame(1250,190,470,350,t,{col:'#BFCFD0'});MV.heart(1490,360,60,t,'#C98795');}
  }
  function roofs(t,o={}) {
    sky(t,o);skyline(t,o.night,{towerX:300});
    boilSeed('roof-terrace');paint([[-500,870],[2400,870],[2400,1300],[-500,1300]],{wash:o.night?'#8D8590':'#CAB7A3',ink:null});
    inkLine([[-500,782],[2400,782]],.42,'#9F8791','inkfine');
    for(let i=0;i<4;i++){const x=120+i*550;inkLine([[x,782],[x,870]],.25,'#9F8791','inkfine');}
    if(o.lights!==false){
      boilSeed('festoon');inkLine([[-100,130],[450,235],[960,270],[1460,235],[2020,110]],.24,'#A19B8E','inkfine');
      for(let i=0;i<7;i++){const x=120+i*280,y=165+105*Math.sin(i/6*Math.PI);paint(ellPts(x,y,9,12,12),{wash:'#EED29F',ink:null});}
    }
  }
  function garden(t,o={}) {
    sky(t,o);skyline(t,o.night);
    boilSeed('garden-ground');paint(rectPts(-600,820,3200,500),{wash:o.night?'#8B8F8A':'#B9C4A2',ink:null});
    for(let i=0;i<3;i++){boilSeed('flower-'+i);const x=170+i*780,y=930,r=28+9*(i%2),sway=Math.sin(t*2+i)*9;
      inkLine([[x,y+80],[x+sway,y-50]],.35,'#7A9572','inkfine');
      for(let j=0;j<4;j++)paint(ellPts(x+sway+Math.cos(j*Math.PI/2)*r*.5,y-60+Math.sin(j*Math.PI/2)*r*.5,r*.5,r*.5,12),{wash:i%2?'#DAA2B2':'#E4C7A6',ink:null});
      paint(ellPts(x+sway,y-60,9,9,10),{wash:'#C5A46D',ink:null});
    }
  }
  function stage(t,o={}) {
    roofs(t,{...o,night:true});
    boilSeed('small-stage');paint(rectPts(235,870,1450,180),{wash:'#A17C7E',ink:null});
    paint(rectPts(280,260,38,610),{wash:'#A97D81',ink:null});paint(rectPts(1605,260,38,610),{wash:'#A97D81',ink:null});
    inkLine([[300,275],[960,340],[1620,275]],.3,'#C5B2A6','inkfine');
    for(let i=0;i<5;i++){const x=410+i*280,y=288+45*Math.sin(i/4*Math.PI);paint([[x-25,y],[x+25,y],[x,y+60]],{wash:['#D89DA5','#DEC18D','#B5C3B0'][i%3],ink:null});}
  }
  function backdrop(kind,t,o={}) {
    ({river,cafe,desk,roofs,garden,stage,sky}[kind]||river)(t,o);
  }
  MV.begin=(kind,t,o={})=>{const ca=o.cam||[960,540,1];camBegin(ca[0],ca[1],ca[2],ca[3]||0);backdrop(kind,t,o);};
  MV.end=()=>camEnd();MV.backdrop=backdrop;MV.tower=tower;MV.skyline=skyline;
})();
