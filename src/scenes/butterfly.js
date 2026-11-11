(() => {
  // Every shape and position is a function of time; renders can seek in any order.
  PAL.ink = '#3C3440';
  const GROUND = 838;
  const HERO_UNIT = 39;
  const colors = {
    hill: '#BDCAA5', grass: '#78956E', darkGrass: '#647E60',
    wing: '#789DB4', wingLight: '#B4CFD8', gold: '#DEB267',
    flower: '#F0D9AC', flowerCenter: '#C79C5F', light: '#F4D6B5',
  };

  function petalFlower(x, y, s, t, key) {
    boilSeed('flower-' + key);
    const sway = Math.sin(t * 1.1 + key) * 10 * s;
    const hx = x + sway, hy = y - 95 * s;
    inkLine([[x, y], [x - 3 * s, y - 42 * s], [hx, hy]], .24 * s, colors.grass, 'inkfine');
    paint(ribbon([[x - 1 * s, y - 26 * s], [x - 34 * s, y - 42 * s], [x - 46 * s, y - 28 * s]], 10 * s, 1), { wash: colors.grass, ink: null });
    const pts = [];
    for (let i = 0; i < 60; i++) {
      const a = i / 60 * TAU;
      const r = (21 + 8 * Math.cos(a * 5)) * s;
      pts.push([hx + Math.cos(a) * r, hy + Math.sin(a) * r]);
    }
    paint(pts, { wash: colors.flower, ink: colors.flowerCenter, sw: .15 * s, curv: .7 });
    paint(ellPts(hx, hy, 8 * s, 7 * s, 12, .3), { wash: colors.flowerCenter, ink: null });
  }

  function meadow(t) {
    const warm = ease(seg(t, 8, 15));
    boilSeed('sky');
    paint(rectPts(-900, -500, 4100, 2200), { wash: mixCol('#F0E5D2', '#F2DFC7', warm * .7), ink: null });
    // A few broad watercolour washes keep the paper visible and the render light.
    boilSeed('sun-wash');
    paint(ellPts(1350, 220, 260, 205, 34, 8), { fill: colors.light, fillOp: 110, bleed: .25, tex: .7, border: .5, ink: null });
    boilSeed('far-hill');
    paint(ellPts(1050, 1320, 2070, 697, 42, 9), { fill: colors.hill, fillOp: 138, bleed: .12, tex: .55, border: .35, ink: null });
    boilSeed('near-hill');
    paint(ellPts(1700, 1580, 2600, 750, 40, 10), { fill: '#9FB58C', fillOp: 95, bleed: .12, tex: .6, border: .4, ink: null });
    // Sparse painted grass: the two flowers are the only bright props.
    for (let i = 0; i < 13; i++) {
      boilSeed('grass-' + i);
      const x = -400 + i * 245 + hash(i * 3 + 17) * 60;
      const y = 875 + hash(i + 9) * 150;
      const h = 24 + hash(i + 3) * 25;
      const w = Math.sin(t * 1.25 + i) * 7;
      inkLine([[x - 12, y], [x - 13 + w * .5, y - h * .6], [x - 16 + w, y - h]], .22, colors.grass, 'inkfine');
      inkLine([[x + 2, y + 1], [x + 5 + w * .6, y - h * .65]], .18, colors.grass, 'inkfine');
    }
    petalFlower(1145, GROUND + 6, 1.15, t, 1);
    petalFlower(1715, GROUND + 28, .86, t, 2);
    // Seed-like drifting flecks are faint, slow and never compete with the butterfly.
    for (let i = 0; i < 5; i++) {
      boilSeed('seed-' + i);
      const x = 260 + i * 380 + Math.sin(t * .25 + i) * 25;
      const y = 440 + Math.sin(i * 1.7) * 120 + Math.cos(t * .35 + i) * 15;
      inkLine([[x, y], [x + 5, y - 3]], .14, '#B9AB8F', 'inkfine');
    }
  }

  function butterfly(x, y, s, t, settle = 0, rot = 0) {
    boilSeed('butterfly');
    push(); translate(x, y); rotate(rot);
    const flap = .27 + .73 * Math.abs(Math.sin(t * TAU * (settle ? 1.6 : 4.4)));
    const open = lerp(flap, .78 + .1 * Math.sin(t * 3.1), settle);
    const wingX = s * open;
    for (const dir of [-1, 1]) {
      paint(ellPts(dir * wingX * .61, -s * .28, wingX * .75, s * .86, 22, .35, dir * -.33), { wash: colors.wing, ink: PAL.ink, sw: .26, curv: .5 });
      paint(ellPts(dir * wingX * .53, s * .65, wingX * .61, s * .53, 18, .3, dir * .24), { wash: colors.gold, ink: PAL.ink, sw: .22, curv: .5 });
      paint(ellPts(dir * wingX * .78, -s * .49, wingX * .15, s * .19, 12), { wash: colors.wingLight, ink: null });
    }
    paint(ribbon([[0, -s * .72], [s * .04, .1 * s], [0, s * 1.08]], s * .19, s * .09), { wash: '#687567', ink: PAL.ink, sw: .18 });
    inkLine([[0, -s * .64], [-s * .14, -s * 1.02], [-s * .36, -s * 1.14]], .18, PAL.ink, 'inkfine');
    inkLine([[0, -s * .64], [s * .14, -s * 1.02], [s * .34, -s * 1.13]], .18, PAL.ink, 'inkfine');
    pop();
  }

  // A light, discontinuous ink arc makes the flight readable without a digital trail.
  function flightDashes(x, y, t, amount = 1) {
    if (amount < .05) return;
    boilSeed('flight-dashes');
    for (let i = 0; i < 3; i++) {
      const xx = x - 43 - i * 31, yy = y + 10 + Math.sin(t * 4 - i * .8) * 12;
      inkLine([[xx - 10, yy + 4], [xx, yy], [xx + 7, yy - 1]], .18 * amount, '#A3AA99', 'inkfine');
    }
  }

  function hero(x, t, pose) {
    clawd(x, GROUND, HERO_UNIT, { boilKey: 'hero', swMul: .74, ...pose });
  }

  function notice(t, lt) {
    camBegin(940 + 10 * Math.sin(lt * .4), 564, 1 + .016 * lt);
    meadow(t);
    const step = ease(seg(t, 3, 4));
    const mood = emotions(t, [
      [0, 'sleepy', { emote: null }],
      [1.5, 'surprised', { emote: '!', lookX: .8, lookY: -.5 }],
      [2.5, 'playful', { emote: null, lookX: .9, lookY: -.4 }],
    ], { take: .68 });
    const facing = turn(t, 2.85, 3.1, 0, .17);
    hero(650 + step * 120, t, { ...mood, ...facing, walk: step * .8, aL: .15 + .2 * step, aR: -.2, dy: (mood.dy || 0) - Math.sin(step * Math.PI) * .32 });
    if (t >= .8) {
      const rise = ease(seg(t, .8, 2.1));
      const bx = lerp(1140, 1110, rise) + Math.sin(t * 3) * 28 * rise;
      const by = lerp(735, 448, rise) + Math.sin(t * 4) * 14 * rise;
      butterfly(bx, by, 29, t, 0, -.12 + Math.sin(t * 2) * .12);
    }
    const centre = toScreen(745, 615);
    camEnd();
    if (lt < .65) iris(centre[0], centre[1], lerp(0, 2250, easeOut(lt / .65)), PAL.paper);
  }

  function chase(t, lt, dur) {
    const runK = ease(seg(lt, 0, 2.65));
    const x = lerp(770, 1360, runK);
    const land = jump(t, 6.5, 7, 2.55);
    const camX = lerp(965, 1460, ease(seg(lt, 0, 3.35)));
    camBegin(camX, 560 - Math.sin(lt * .7) * 7, 1.07, -.006 * Math.sin(lt));
    meadow(t);
    const active = 1 - ease(seg(t, 6.4, 7.35));
    const mood = emotions(t, [[4, 'playful', { emote: null }], [5.5, 'determined', { emote: null }], [7.5, 'confused', { emote: '?' }]], { take: .55 });
    const spin = turn(t, 7.18, 7.5, .25, 0);
    hero(x, t, {
      ...mood, ...spin,
      walk: (x - 770) / 118,
      aL: lerp(.35 + .35 * Math.sin(lt * TAU * 3), 1.0, ease(seg(t, 6.2, 6.5))) * active - .25 * (1 - active),
      aR: -.25 - .2 * Math.sin(lt * TAU * 3 + .6),
      lookX: .7, lookY: -.4,
      dy: land.dy - Math.abs(Math.sin(lt * TAU * 3)) * .45 * active,
      sq: land.sq + (mood.sq || 0) * .35,
      rot: -.035 * active,
    });
    const dodge = ease(seg(t, 6.3, 7.2));
    const bx = x + lerp(260, 560, dodge);
    const by = 464 - 115 * dodge + Math.sin(t * 5) * 23;
    flightDashes(bx, by, t, 1);
    butterfly(bx, by, 29, t, 0, -.13 + Math.sin(t * 2) * .12);
    // A painted puff makes the small landing visible, then dissipates.
    if (t > 7 && t < 7.55) {
      const a = seg(t, 7, 7.55);
      boilSeed('landing-puff');
      for (let i = 0; i < 3; i++) {
        const px = x + (i - 1) * (44 + 30 * a);
        paint(ellPts(px, GROUND + 8 - 15 * a, 23 + a * 11, 12 + a * 8, 16, 1), { wash: '#E2D9BA', washOp: (1 - a) * 110, ink: null });
      }
    }
    camEnd();
    if (lt > dur - .34) brushWipe((lt - (dur - .34)) / .68, ['#A6BA91', '#D2D9B5']);
  }

  function restingPose(t) {
    const mood = emotions(t, [[8, 'sad', { emote: null, gloom: .05, tintK: .08 }], [9.5, 'relieved', { emote: null, eyes: 'closed' }]], { take: .45 });
    return { ...mood, aL: -.72, aR: -.62, rot: .015 * Math.sin(t * 1.5), dy: -.05 + .04 * Math.sin(t * 2), sq: .025 + .012 * Math.sin(t * 2) };
  }

  function headAnchor(pose) {
    // This matches clawd()'s squash and rotation, so the feet of the butterfly touch the head.
    const px = (pose.dx || 0) * HERO_UNIT;
    const py = -8 * HERO_UNIT * (1 - (pose.sq || 0));
    const a = pose.rot || 0;
    return [1360 + px - py * Math.sin(a), GROUND + (pose.dy || 0) * HERO_UNIT + py * Math.cos(a) - 10];
  }

  function pause(t, lt) {
    camBegin(1434 + 7 * Math.sin(lt * .5), 615, 1.51 + .006 * lt);
    meadow(t);
    const mood = restingPose(t);
    hero(1360, t, mood);
    if (t >= 10) {
      const k = ease(seg(t, 10, 12));
      const head = headAnchor(mood);
      const bx = lerp(1920, head[0], k) + Math.sin(t * 4.1) * 22 * (1 - k);
      const by = lerp(350, head[1], k) - Math.sin(k * Math.PI) * 110;
      butterfly(bx, by, 26, t, k * .7, -.2 * (1 - k));
    }
    camEnd();
    if (lt < .34) brushWipe(.5 + lt / .68, ['#A6BA91', '#D2D9B5']);
  }

  function friend(t, lt) {
    const back = ease(seg(lt, 1, 3.3));
    camBegin(1434 + back * 8, 615 - back * 30, lerp(1.534, 1.12, back));
    meadow(t);
    const mood = emotions(t, [
      [12, 'relieved', { emote: null, eyes: 'closed' }],
      [12.5, 'surprised', { emote: null, lookY: -.9, lookX: .1 }],
      [13.5, 'happy', { emote: null, lookY: -.35, blush: .45 }],
    ], { take: .32 });
    // Keep the body almost still while the butterfly is perched: the face carries this payoff.
    const settled = { ...mood, dx: 0, dy: -.05 + .04 * Math.sin(t * 2), sq: .025 + .012 * Math.sin(t * 2), aL: -.65 + .12 * back, aR: -.55, rot: .015 * Math.sin(t * 1.5) };
    hero(1360, t, settled);
    const head = headAnchor(settled);
    butterfly(head[0], head[1], 26, t, 1, settled.rot);
    if (t > 13.5) {
      emote('heart', 1600, 458, 30, easeOut(seg(t, 13.5, 14)), t - 13.5);
    }
    const at = toScreen(1360, 625);
    camEnd();
    if (lt > 3.25) iris(at[0], at[1], lerp(1950, 0, ease(seg(lt, 3.25, 4))), PAL.paper);
  }

  shots([[0, notice], [4, chase], [8, pause], [12, friend]]);
})();
