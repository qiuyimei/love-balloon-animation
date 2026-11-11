LOOPS.motion = t => {
  MV.begin('desk',t);
  MV.actor('boy',475,850,34,t,{action:'run',mood:'hopeful'});
  const a=MV.actor('girl',1120,850,34,t,{action:'dance',mood:'happy'});
  MV.heldBalloon(a,t,{r:82});MV.end();
};LOOPS.motion.len=4*BEAT;
LOOPS.models=t=>{
  MV.begin('river',t);const a=MV.actor('boy',670,870,40,t,{mood:'happy'}),b=MV.actor('girl',1240,870,39,t,{mood:'love'});MV.joinHands(a,b,t);MV.heldBalloon(b,t,{hand:'L',r:100,rise:300});MV.end();
};LOOPS.models.len=4*BEAT;
LOOPS.portal=t=>{MV.begin('cafe',t);MV.actor('boy',lerp(500,1400,ease(seg(t,0,2.6))),870,35,t,{action:'run',mood:'excited'});MV.end();if(t>1.1&&t<1.5)MV.cover(seg(t,1.1,1.5),'paper');};LOOPS.portal.len=2.6643;
