from pathlib import Path
import json,subprocess,hashlib,wave,sys
import numpy as np
from PIL import Image,ImageDraw

root=Path(__file__).resolve().parent
bindir=root.parent/'render-runtime'/'bin'
video=Path(sys.argv[1]);width=int(sys.argv[2]);tag=sys.argv[3]
def run(exe,*args):return subprocess.run([str(bindir/exe),*map(str,args)],capture_output=True,check=True).stdout
meta=json.loads(run('ffprobe.exe','-v','error','-show_streams','-show_format','-of','json',video))
v=next(s for s in meta['streams'] if s['codec_type']=='video');a=next(s for s in meta['streams'] if s['codec_type']=='audio')
assert v['width']==width and v['height']==round(width*9/16)
assert v['r_frame_rate']=='24/1' and int(v['nb_frames'])==5184
assert abs(float(meta['format']['duration'])-216)<.06
raw=run('ffmpeg.exe','-v','error','-i',video,'-vf','scale=96:54,format=gray','-f','rawvideo','-')
frames=np.frombuffer(raw,dtype=np.uint8).reshape(-1,54,96)
assert len(frames)==5184 and float(frames.mean((1,2)).min())>18
prev=None;streak=0;max_streak=0
for frame in frames:
    digest=hashlib.sha256(frame.tobytes()).digest();streak=streak+1 if digest==prev else 1;prev=digest;max_streak=max(max_streak,streak)
assert max_streak<24,f'Unintended exact freeze:{max_streak}frames'
pcm=run('ffmpeg.exe','-v','error','-i',video,'-vn','-ac','2','-ar','48000','-f','f32le','-')
audio=np.frombuffer(pcm,dtype=np.float32).reshape(-1,2)
with wave.open(str(root/'assets'/'song.wav'),'rb') as w:reference=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).reshape(-1,2).astype(np.float32)/32768
n=min(len(audio),len(reference));correlation=float(np.corrcoef(audio[:n:4].ravel(),reference[:n:4].ravel())[0,1]);peak=float(np.max(np.abs(audio)))
assert correlation>.97 and peak<1
times=[1.2,7.8,15.7,26.5,38.6,59.4,68,78,97.2,116,133,149,159,174,185,199.7,208.9,215.9]
sheet=Image.new('RGB',(1600,((len(times)+3)//4)*249),'#ede8dc');draw=ImageDraw.Draw(sheet)
for i,t in enumerate(times):
    rgb=run('ffmpeg.exe','-v','error','-ss',t,'-i',video,'-frames:v','1','-vf','scale=400:225','-pix_fmt','rgb24','-f','rawvideo','-')
    x,y=i%4*400,i//4*249;sheet.paste(Image.frombytes('RGB',(400,225),rgb),(x,y+24));draw.text((x+7,y+5),f'{t:.2f}s',fill='#48333c')
sheet.save(root/'out'/'check'/f'encoded-{tag}.jpg',quality=92)
report={'file':str(video),'duration':float(meta['format']['duration']),'width':v['width'],'height':v['height'],'fps':v['r_frame_rate'],'frames':len(frames),'audio_codec':a['codec_name'],'audio_correlation':correlation,'audio_peak_dbfs':20*float(np.log10(peak+1e-12)),'lowest_mean_brightness':float(frames.mean((1,2)).min()),'max_identical_frame_run':max_streak,'size_bytes':video.stat().st_size}
(root/'out'/f'verified-{tag}.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report,ensure_ascii=False,indent=2))
