// Original score, 120 BPM. Music and animation share the same half-second grid.
window.CUES = [1.5, 4, 6.5, 7, 8, 12, 12.5, 13.5];
window.SCORE = ac => {
  const seconds = 16, beat = .5;
  const master = ac.createGain();
  master.gain.setValueAtTime(.0001, 0);
  master.gain.linearRampToValueAtTime(.68, .13);
  master.gain.setValueAtTime(.68, 15.05);
  master.gain.exponentialRampToValueAtTime(.0001, 16);
  master.connect(ac.destination);
  const reverb = ac.createDelay(.3); reverb.delayTime.value = .185;
  const echo = ac.createGain(); echo.gain.value = .13;
  reverb.connect(echo); echo.connect(master);
  const freq = n => 440 * 2 ** ((n - 69) / 12);
  const pluck = (midi, t, amp = .055, length = .46, pan = 0, bright = false) => {
    if (t < 0 || t >= seconds - .25) return;
    const bus = ac.createGain();
    bus.gain.setValueAtTime(.00001, t);
    bus.gain.exponentialRampToValueAtTime(amp, t + .012);
    bus.gain.exponentialRampToValueAtTime(.00001, Math.min(seconds, t + length));
    const panner = ac.createStereoPanner(); panner.pan.value = pan;
    bus.connect(panner); panner.connect(master); bus.connect(reverb);
    for (const [partial, strength] of [[1, 1], [2, bright ? .22 : .12], [3, .055]]) {
      const osc = ac.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq(midi) * partial;
      const gain = ac.createGain(); gain.gain.value = strength;
      osc.connect(gain); gain.connect(bus); osc.start(t); osc.stop(Math.min(seconds + .05, t + length + .03));
    }
  };
  const bass = (midi, t, amp = .045) => pluck(midi, t, amp, .46, -.1);
  const noiseBuffer = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
  const nd = noiseBuffer.getChannelData(0); let state = 1701;
  for (let i = 0; i < nd.length; i++) { state = (state * 16807) % 2147483647; nd[i] = (state / 2147483647 * 2 - 1); }
  const brush = (t, amp = .012, dur = .08, high = 5200) => {
    const source = ac.createBufferSource(); source.buffer = noiseBuffer;
    const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = high;
    const g = ac.createGain(); g.gain.setValueAtTime(.00001, t); g.gain.exponentialRampToValueAtTime(amp, t + .004); g.gain.exponentialRampToValueAtTime(.00001, t + dur);
    source.connect(f); f.connect(g); g.connect(master); source.start(t, .23); source.stop(t + dur + .01);
  };
  const chords = [
    [50, 62, 66, 69], [55, 62, 67, 71], [47, 62, 66, 71], [45, 61, 64, 69],
    [50, 62, 66, 69], [55, 62, 67, 71], [45, 61, 64, 67], [50, 62, 66, 69],
  ];
  const melody = [
    [74, null, 78, 76, 74, null, 69, null],
    [71, null, 74, null, 78, 76, 74, null],
    [78, 81, 78, null, 76, 74, 71, null],
    [73, null, 76, 78, 76, null, 73, null],
    [74, null, null, 69, 66, null, 69, null],
    [71, null, 74, null, 76, null, 74, null],
    [73, null, 76, null, 78, 76, 73, null],
    [74, null, 78, null, 81, null, 74, null],
  ];
  for (let bar = 0; bar < 8; bar++) {
    const t = bar * 2, chord = chords[bar], quiet = bar === 4;
    const level = quiet ? .72 : 1;
    for (let b = 0; b < 4; b++) {
      bass(b % 2 ? chord[0] + 7 : chord[0], t + b * beat, .052 * level);
      pluck(chord[1 + b % 3], t + b * beat + .012, .032 * level, .7, b % 2 ? .35 : -.35);
      if (!quiet || b % 2) brush(t + b * beat, .009 * level, .065, 4200);
      brush(t + b * beat + .25, .0045 * level, .04, 6500);
    }
    for (let i = 0; i < 8; i++) if (melody[bar][i] != null) pluck(melody[bar][i], t + i * .25, .052 * level, .55, Math.sin(i) * .2, true);
  }
  // Small narrative sounds: airy wing flutters, jump, soft footfall, then a landing bell.
  for (const t of [1, 1.25, 1.5, 5.75, 6, 6.25, 10.5, 10.75, 11, 11.25, 11.5]) brush(t, .007, .045, 2200);
  pluck(81, 1.5, .05, .55, .3, true);
  pluck(69, 6.5, .045, .15, 0);
  pluck(74, 6.625, .032, .13, .15);
  bass(38, 7, .032); brush(7, .016, .12, 750);
  pluck(86, 12, .046, .75, .1, true);
  pluck(81, 12.5, .036, .6, -.15, true);
  pluck(86, 13.5, .032, .7, .1, true);
};
