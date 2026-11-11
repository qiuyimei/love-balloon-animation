from pathlib import Path
import subprocess, json
import numpy as np

root = Path(__file__).resolve().parent
ffmpeg = root.parent / 'render-runtime' / 'bin' / 'ffmpeg.exe'
pcm = subprocess.run([str(ffmpeg), '-v', 'error', '-i', str(root/'assets'/'song.wav'), '-ac','1','-ar','12000','-f','s16le','-'], capture_output=True, check=True).stdout
x = np.frombuffer(pcm,dtype=np.int16).astype(float)/32768
env = np.sqrt(np.mean(x[:len(x)//120*120].reshape(-1,120)**2,axis=1))
flux = np.maximum(0,np.diff(env,prepend=0)); onsets=[]
for i in range(1,len(flux)-1):
    avg = flux[max(0,i-50):i+50].mean()
    if flux[i]>avg*3 and flux[i]>=flux[i-1] and flux[i]>=flux[i+1] and flux[i]>.002:
        t=i/100
        if not onsets or t-onsets[-1]['start']>.12: onsets.append(dict(start=t,t=t,s=float(flux[i])))
        elif flux[i]>onsets[-1]['s']: onsets[-1].update(t=t,s=float(flux[i]))
strong=[]
for o in onsets:
    nb=sorted(p['s'] for p in onsets if abs(p['t']-o['t'])<=1)
    if o['s']>=nb[int(len(nb)*.3)]: strong.append(o['t'])
near=lambda t: min(strong,key=lambda v:abs(v-t))
bounds=[0,12.653,39.296,60.611,89.918,108.568,129.882,151.197,175.175,193.826,216]
actual=[near(t) if 0<t<210 else t for t in bounds]
data={'strong_onsets':strong,'chapter_bounds':actual}
(root/'song_map'/'onsets.json').write_text(json.dumps(data,indent=2),encoding='utf-8')
js='const AUDIO_ONSETS = '+json.dumps(strong)+';\nconst CHAPTER_BOUNDS = '+json.dumps(actual)+';\n'
(root/'src'/'audio-onsets.js').write_text(js,encoding='utf-8')
print('Chapters:',actual)
print('Strong accents:',len(strong))
