const BAR = BEAT * 4;
const barT = k => OFF + BAR * k;
const beatT = (k,b=0) => barT(k) + b*BEAT;
const SONG = {
  bounds: CHAPTER_BOUNDS,
  names: ['paper-awakens','coffee-windows','courage','first-dance','paper-boat','postcards','rooftop-steps','city-festival','balloon-flight','homecoming'],
  firstSound:.379, lastSound:209.514, duration:216,
  near(t) {
    if(Math.abs(t-55.25)<.001)return 55.25;
    if(Math.abs(t-156.65)<.001)return 156.65;
    const hit=AUDIO_ONSETS.reduce((a,b)=>Math.abs(b-t)<Math.abs(a-t)?b:a,AUDIO_ONSETS[0]);
    // Keep these two picture cuts between adjacent attacks that survive AAC encoding differently.
    if(Math.abs(hit-55.33)<.001)return 55.25;
    if(Math.abs(hit-156.58)<.001)return 156.65;
    return hit;
  }
};
