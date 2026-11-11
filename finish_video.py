from pathlib import Path
import subprocess,json,sys

root=Path(__file__).resolve().parent
ffmpeg=root.parent/'render-runtime'/'bin'/'ffmpeg.exe'
out=root.parent.parent/'outputs'
master=out/'告白气球-整首动画MV-1080p.mp4'
wechat=out/'告白气球-整首动画MV-微信版.mp4'
frames=root/'out'/'frames'
expected=216*24
direct_meta=root/'out'/'direct-full.json'
direct_video=root/'out'/'direct-full.h264'
direct=json.loads(direct_meta.read_text()) if direct_meta.exists() else None
if direct:
    assert direct['frames']==expected and direct['chunks']==expected, 'Direct encoding incomplete'
else:
    missing=[i for i in range(expected) if not (frames/f'f{i:05d}.jpg').exists()]
    small=[p.name for p in frames.glob('f*.jpg') if p.stat().st_size<20000]
    if missing or small:raise RuntimeError(f'Frames incomplete: missing{missing[:10]}, small{small[:10]}')

def encode(*args):
    subprocess.run([str(ffmpeg),'-hide_banner','-y','-loglevel','error','-stats',*map(str,args)],check=True)

if direct:
    encode('-fflags','+genpts','-r','24','-i',direct_video,'-i',root/'assets'/'song.wav','-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','192k','-t','216','-movflags','+faststart',master)
else:
    encode('-framerate','24','-i',frames/'f%05d.jpg','-i',root/'assets'/'song.wav','-map','0:v','-map','1:a','-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-t','216','-movflags','+faststart',master)
print('MASTER_READY',master,flush=True)
if '--quick' in sys.argv:
    encode('-ss','149','-i',master,'-frames:v','1',out/'告白气球-整首动画MV-封面.png')
    print(json.dumps({'master':str(master),'master_bytes':master.stat().st_size},ensure_ascii=False),flush=True)
    sys.exit(0)
# A single small, complete upload avoids sending a second large recording over the user's connection.
video_rate=int(25_000_000*8/216-128000-12000)
filters='scale=1280:720:flags=lanczos,hqdn3d=1.0:1.0:2.0:2.0'
passfile=root/'out'/'wechat-pass'
encode('-i',master,'-vf',filters,'-c:v','libx264','-preset','medium','-b:v',video_rate,'-pass','1','-passlogfile',passfile,'-an','-f','null','NUL')
encode('-i',master,'-vf',filters,'-c:v','libx264','-preset','medium','-b:v',video_rate,'-pass','2','-passlogfile',passfile,'-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-t','216','-movflags','+faststart',wechat)
encode('-ss','149','-i',master,'-frames:v','1',out/'告白气球-整首动画MV-封面.png')
print(json.dumps({'master':str(master),'master_bytes':master.stat().st_size,'wechat':str(wechat),'wechat_bytes':wechat.stat().st_size},ensure_ascii=False,indent=2),flush=True)
