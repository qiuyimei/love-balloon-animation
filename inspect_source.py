from pathlib import Path
import subprocess
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent
ffmpeg = root.parent / 'render-runtime' / 'bin' / 'ffmpeg.exe'
times = list(range(0,216,4))
for page in range((len(times)+19)//20):
    subset = times[page*20:(page+1)*20]
    sheet = Image.new('RGB', (1600, ((len(subset)+4)//5)*204), '#ede8dc')
    draw = ImageDraw.Draw(sheet)
    for i, t in enumerate(subset):
        buf = subprocess.run([str(ffmpeg), '-v', 'error', '-ss', str(t), '-i', str(root / 'ref' / 'source.mp4'), '-frames:v', '1', '-vf', 'scale=320:180', '-pix_fmt', 'rgb24', '-f', 'rawvideo', '-'], capture_output=True, check=True).stdout
        frame = Image.frombytes('RGB', (320,180), buf)
        x, y = (i%5)*320, (i//5)*204
        sheet.paste(frame, (x,y+24))
        draw.text((x+7,y+5), f'{t:.2f}s', fill='#44354a')
    path = root / 'ref' / 'sheets' / f'source-{page+1}.jpg'
    sheet.save(path, quality=90)
    print(path)
