from pathlib import Path
import subprocess
import json
import numpy as np

root = Path(__file__).resolve().parent
ffmpeg = root.parent / 'render-runtime' / 'bin' / 'ffmpeg.exe'
pcm = subprocess.run([str(ffmpeg), '-v', 'error', '-i', str(root / 'assets' / 'love-confession-20s.wav'), '-ac', '1', '-ar', '12000', '-f', 's16le', '-'], check=True, capture_output=True).stdout
x = np.frombuffer(pcm, dtype=np.int16).astype(float) / 32768
env = np.sqrt(np.mean(x[:len(x)//120*120].reshape(-1, 120)**2, axis=1))
flux = np.maximum(0, np.diff(env, prepend=0))
onsets = []
for i in range(1, len(flux)-1):
    mean = flux[max(0, i-50):i+50].mean()
    if flux[i] > mean*3 and flux[i] >= flux[i-1] and flux[i] >= flux[i+1] and flux[i] > .002:
        t = i/100
        if not onsets or t-onsets[-1]['start'] > .12:
            onsets.append(dict(start=t, t=t, s=flux[i]))
        elif flux[i] > onsets[-1]['s']:
            onsets[-1].update(t=t, s=flux[i])
strong = []
for o in onsets:
    nb = sorted(p['s'] for p in onsets if abs(p['t']-o['t']) <= 1)
    if o['s'] >= nb[int(len(nb)*.3)]:
        strong.append(o['t'])
print('Strong musical accents from 9 seconds:', [t for t in strong if t >= 9])

def rms(a, b):
    block = env[max(0, round(a*100)):min(len(env), round(b*100))]
    return np.sqrt(np.mean(block*block)) + 1e-6 if len(block) else 1e-6

for t in json.loads((root / 'assets' / 'love-confession-20s.cues.json').read_text()):
    near = min(strong, key=lambda v: abs(v-t))
    before = rms(t-1, t)
    wins = [rms(t-k, t-k+1) for k in [1,2,3,4]]
    loud = max(wins)
    srt = sorted(wins)
    ref = loud if 20*np.log10(before/loud) < -10 else max(before, (srt[1]+srt[2])/2)
    jump = 20*np.log10(rms(t,t+.3)/ref)
    print(f'cue {t:.2f}s, onset offset {(near-t)*1000:+.0f}ms, loudness change {jump:+.1f}dB')
