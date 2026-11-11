(() => {
  PAL.ink = '#48333C';
  const FLOOR_Y = 878, U_BOY = 40, U_GIRL = 39;
  const C = {
    sky: '#F1DDC9', peach: '#EDC1AD', river: '#A9BCC3',
    bank: '#C6BCAC', stone: '#CDB8A3', rail: '#A58C7B',
    tower: '#C2A48D', balloon: '#D95C71', highlight: '#F3A2A9',
    pink: '#DB9FA9', pinkDark: '#AF7584', pinkLight: '#F1C3C6',
  };
  const BAR = 4 * BEAT;

  function tower(t) {
    boilSeed('eiffel');
    const x = 440, y = 690, h = 450;
    paint([
      [x - 106, y], [x - 69, y - 105], [x - 37, y - 255], [x - 10, y - h + 47],
      [x - 4, y - h], [x + 5, y - h], [x + 13, y - h + 47], [x + 38, y - 255],
      [x + 70, y - 105], [x + 108, y], [x + 62, y], [x + 35, y - 78],
      [x, y - 104], [x - 35, y - 78], [x - 62, y],
    ], { wash: C.tower, washOp: 165, ink: null });
    for (const [yy, half] of [[y - 107, 82], [y - 260, 48], [y - 330, 30]]) {
      inkLine([[x - half, yy], [x + half, yy]], .32, '#B69A86', 'inkfine');
    }
    for (let i = 0; i < 6; i++) {
      const yy = y - 125 - i * 42, ww = 64 - i * 8;
      inkLine([[x - ww, yy], [x + ww - 6, yy - 30]], .19, '#B19984', 'inkfine');
      inkLine([[x + ww, yy], [x - ww + 6, yy - 30]], .19, '#B19984', 'inkfine');
    }
  }

  function paris(t) {
    boilSeed('sky');
    paint(rectPts(-600, -400, 3200, 1800), { wash: C.sky, ink: null });
    boilSeed('sunset');
    paint(ellPts(1250, 250, 405, 220, 36, 14), { fill: C.peach, fillOp: 100, bleed: .25, tex: .65, border: .45, ink: null });
    // Distant architecture is one quiet silhouette, with no lettering or photographic assets.
    boilSeed('far-bank');
    const roof = [[-400, 701], [-400, 622], [-90, 622], [-90, 579], [12, 579], [50, 539], [94, 579], [172, 579], [172, 632],
      [584, 632], [584, 590], [677, 560], [763, 590], [763, 648], [973, 648], [973, 600], [1052, 600], [1087, 558],
      [1124, 600], [1227, 600], [1227, 648], [1540, 648], [1540, 602], [1633, 602], [1633, 648], [2240, 648], [2240, 710]];
    paint(roof, { wash: '#CBBFAF', washOp: 145, ink: null });
    tower(t);
    boilSeed('river');
    paint(rectPts(-500, 700, 3000, 290, 7), { fill: C.river, fillOp: 170, bleed: .13, tex: .6, border: .32, ink: null });
    for (let i = 0; i < 9; i++) {
      boilSeed('water-' + i);
      const xx = -160 + i * 270, yy = 722 + (i % 3) * 42;
      inkLine([[xx + 7 * Math.sin(t + i), yy], [xx + 95, yy + 2], [xx + 170, yy]], .18, '#91A8B2', 'inkfine');
    }
    // The foreground bridge is a flat drawing, behind both actors.
    boilSeed('walkway');
    paint([[-500, 842], [2400, 842], [2400, 1350], [-500, 1350]], { wash: '#E9D5BB', fill: '#D5BFA8', fillOp: 38, bleed: .1, tex: .5, border: .25, ink: null });
    boilSeed('railing');
    inkLine([[-500, 754], [2400, 754]], .53, C.rail, 'inkfine');
    inkLine([[-500, 824], [2400, 824]], .36, C.rail, 'inkfine');
    for (let i = 0; i < 13; i++) {
      const x = -250 + i * 220;
      inkLine([[x, 755], [x, 839]], .31, C.rail, 'inkfine');
    }
    // A small street lamp and leaves anchor the setting without stealing the focal point.
    boilSeed('lamp');
    inkLine([[1810, 842], [1810, 375], [1790, 335], [1752, 333]], .75, '#A58A79', 'inkfine');
    paint([[1728, 334], [1778, 334], [1770, 390], [1738, 390]], { wash: '#EACB99', ink: '#AF9278', sw: .35 });
    inkLine([[1724, 332], [1752, 313], [1780, 332]], .36, '#A58A79', 'inkfine');
    for (let i = 0; i < 5; i++) {
      boilSeed('foreground-leaf-' + i);
      const x = 90 + i * 40, y = 1060 - i * 8, sway = Math.sin(t * 1.4 + i) * 7;
      paint(ribbon([[x, y], [x + 18 + sway, y - 80], [x + 55 + sway, y - 114]], 17, 1), { wash: '#9BA17B', ink: null });
    }
  }

  function armTip(x, u, pose, side) {
    const angle = side > 0 ? pose.aR : pose.aL;
    const aa = angle ?? .2;
    const extra = .55 * clamp((Math.abs(aa) - .7) / .9);
    const localX = side * (4.9 + extra + 2.2 * Math.cos(aa)) * u;
    const localY = (-4.5 - 2.2 * Math.sin(aa)) * u;
    const sq = (pose.sq || 0) + (pose.take || 0), rot = pose.rot || 0;
    const px = localX * (1 + sq * .6), py = localY * (1 - sq);
    return [x + (pose.dx || 0) * u + px * Math.cos(rot) - py * Math.sin(rot),
      FLOOR_Y + (pose.dy || 0) * u + px * Math.sin(rot) + py * Math.cos(rot)];
  }

  function heartBalloon(anchor, t, transfer) {
    boilSeed('red-balloon');
    const bx = anchor[0] + 30 + Math.sin(t * 1.5) * 15;
    const by = 327 + Math.sin(t * 1.9 + .5) * 10 - transfer * 5;
    // The lower tip is a knot, not a free-floating end of string.
    const knot = [bx, by + 107];
    inkLine([knot, [bx - 13, by + 184], [anchor[0] + 16 * Math.sin(t * 2), anchor[1] - 84], anchor], .25, '#9D6D72', 'inkfine');
    push(); translate(bx, by); rotate(Math.sin(t * 1.7) * .035);
    paint(heartPts(0, 0, 108, 42), { wash: C.balloon, fill: '#EB8190', fillOp: 55, bleed: .06, tex: .7, border: .25, ink: '#8F4656', sw: .58 });
    paint([[-8, 101], [0, 110], [9, 100], [3, 117], [-5, 116]], { wash: C.balloon, ink: '#8F4656', sw: .24 });
    inkLine([[-48, -33], [-63, -62], [-53, -80], [-34, -83]], .7, C.highlight, 'dry', .6);
    pop();
  }

  function scene(t) {
    const approach = ease(seg(t, 1.9, 5.36));
    const heroX = lerp(605, 820, approach), girlX = 1390;
    const giving = ease(seg(t, 5.35, 6.65));
    const happy = ease(seg(t, 7.15, 8.65));
    const pushing = ease(seg(t, 0, 9));
    camBegin(lerp(1000, 1120, pushing), lerp(574, 587, pushing), lerp(1, 1.14, pushing));
    paris(t);

    const boyMood = emotions(t, [[0, 'shy', { emote: null, lookX: .9, blush: .35 }],
      [1.34, 'hopeful', { emote: null, lookX: .95 }],
      [5.34, 'shy', { emote: null, lookX: .9, blush: .55 }],
      [7.34, 'happy', { emote: null, lookX: .85, blush: .42 }]], { take: .32 });
    const walking = t > 1.9 && t < 5.36;
    const boyPose = { ...boyMood, view: 'front', dx: 0,
      aL: -.58 + .07 * Math.sin(t * 3), aR: .16 + .035 * Math.sin(t * 1.8),
      walk: approach * 1.65,
      dy: (boyMood.dy || 0) * .2 - (walking ? Math.abs(Math.sin(approach * 1.65 * TAU)) * .27 : 0),
      sq: (boyMood.sq || 0) * .45, rot: -.01 * walking + .007 * Math.sin(t * 2) };
    const girlMood = emotions(t, [[0, 'neutral', { emote: null, lookX: -.8 }],
      [3.34, 'surprised', { emote: null, lookX: -.95 }],
      [6.67, 'shy', { emote: null, lookX: -.9, blush: .7 }],
      [8.01, 'happy', { emote: null, lookX: -.85, blush: .58 }]], { take: .3 });
    const girlPose = { ...girlMood, view: 'front', dx: 0, col: C.pink, dk: C.pinkDark, lt: C.pinkLight,
      hat: 'bow', aL: lerp(-.65, .16, giving), aR: -.62,
      dy: (girlMood.dy || 0) * .16, sq: (girlMood.sq || 0) * .35,
      rot: .005 * Math.sin(t * 2.2) };

    clawd(heroX, FLOOR_Y, U_BOY, { ...boyPose, boilKey: 'orange', swMul: .72 });
    clawd(girlX, FLOOR_Y, U_GIRL, { ...girlPose, boilKey: 'pink', swMul: .72 });
    const boyHand = armTip(heroX, U_BOY, boyPose, 1);
    const girlHand = armTip(girlX, U_GIRL, girlPose, -1);
    const receive = ease(seg(t, 6.05, 6.65));
    heartBalloon([lerp(boyHand[0], girlHand[0], receive), lerp(boyHand[1], girlHand[1], receive)], t, receive);

    if (happy > .01) {
      for (let i = 0; i < 2; i++) {
        boilSeed('little-heart-' + i);
        const age = Math.max(0, t - 7.35 - i * .45), appear = ease(seg(age, 0, .5));
        if (appear <= .01) continue;
        const hx = 1100 + (i ? 68 : -54) + Math.sin(age * 2 + i) * 8;
        const hy = 595 - age * 48 - i * 22;
        paint(heartPts(hx, hy, (13 + 3 * i) * appear), { wash: '#D98C95', ink: null });
      }
    }
    const centre = toScreen(1100, 590);
    camEnd();
    if (t < .5) iris(centre[0], centre[1], lerp(0, 2100, easeOut(t / .5)), PAL.paper);
    if (t > 9.45) iris(centre[0], centre[1], lerp(1900, 0, ease(seg(t, 9.45, 10))), PAL.paper);
  }

  // Continuous camera and carried action through all four musical phrases.
  shots([[0, scene], [BAR, scene], [BAR * 2, scene], [BAR * 3, scene]]);
})();
