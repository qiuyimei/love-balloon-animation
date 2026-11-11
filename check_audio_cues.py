from pathlib import Path
import subprocess,json
import numpy as np
root=Path(__file__).resolve().parent
ffmpeg=root.parent/'render-runtime'/'bin'/'ffmpeg.exe'
raw=subprocess.run([str(ffmpeg),'-v','error','-i',str(root/'assets'/'song.wav'),'-ac','1','-ar','12000','-f','s16le','-'],capture_output=True,check=True).stdout
x=np.frombuffer(raw,dtype=np.int16).astype(float)/32768
env=np.sqrt(np.mean(x[:len(x)//120*120].reshape(-1,120)**2,axis=1))
def rms(a,b):
    z=env[max(0,round(a*100)):min(len(env),round(b*100))]
    return float(np.sqrt(np.mean(z*z))+1e-6) if len(z) else 1e-6
strong=json.loads((root/'song_map'/'onsets.json').read_text())['strong_onsets']
result=[]
for t in json.loads((root/'assets'/'full-song.cues.json').read_text()):
    near=min(strong,key=lambda v:abs(v-t));before=rms(t-1,t)
    wins=[rms(t-k,t-k+1) for k in [1,2,3,4]];loud=max(wins);srt=sorted(wins)
    ref=loud if 20*np.log10(before/loud)<-10 else max(before,(srt[1]+srt[2])/2)
    jump=20*np.log10(rms(t,t+.3)/ref)
    result.append(dict(t=t,onset=near,offset_ms=round((near-t)*1000),loudness_jump_db=round(float(jump),2)))
(root/'out'/'audio-cue-precheck.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print('Cue count:',len(result),'max onset offset:',max(abs(r['offset_ms']) for r in result),'ms')
print('Loudness entries above6dB:',[r for r in result if r['loudness_jump_db']>6])
