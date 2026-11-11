"""Inspect the delivered MP4, not just the animation source."""
from pathlib import Path
import json
import subprocess
import sys
import wave

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
BIN = ROOT.parent / 'render-runtime' / 'bin'
FFMPEG = str(BIN / 'ffmpeg.exe')
FFPROBE = str(BIN / 'ffprobe.exe')
VIDEO = Path(sys.argv[1])
EXPECTED = float(sys.argv[2]) if len(sys.argv) > 2 else 10
TAG = f'{EXPECTED:g}s'


def run(binary, *args):
    return subprocess.run([binary, *args], check=True, capture_output=True).stdout


metadata = json.loads(run(FFPROBE, '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(VIDEO)))
v = next(s for s in metadata['streams'] if s['codec_type'] == 'video')
a = next(s for s in metadata['streams'] if s['codec_type'] == 'audio')
assert (v['width'], v['height']) == (1920, 1080), 'Unexpected frame dimensions'
assert v['r_frame_rate'] == '24/1', 'Unexpected frame rate'
assert abs(float(metadata['format']['duration']) - EXPECTED) < .06, 'Incorrect duration'
assert int(v['nb_frames']) == round(EXPECTED * 24), 'Missing or extra frames'

# Decode all frames to catch encoder errors, black frames and long freezes.
raw = run(FFMPEG, '-v', 'error', '-i', str(VIDEO), '-vf', 'scale=96:54,format=gray', '-f', 'rawvideo', '-')
frames = np.frombuffer(raw, dtype=np.uint8).reshape(-1, 54, 96)
assert len(frames) == round(EXPECTED * 24)
motion = np.abs(np.diff(frames.astype(np.float32), axis=0)).mean(axis=(1, 2))
assert float(frames.mean(axis=(1, 2)).min()) > 40, 'An unintended black frame was found'

pcm = run(FFMPEG, '-v', 'error', '-i', str(VIDEO), '-vn', '-ac', '2', '-ar', '48000', '-f', 'f32le', '-')
audio = np.frombuffer(pcm, dtype=np.float32).reshape(-1, 2)
with wave.open(str(ROOT / 'assets' / f'love-confession-{TAG}.wav'), 'rb') as wav:
    reference = np.frombuffer(wav.readframes(wav.getnframes()), dtype=np.int16).reshape(-1, 2).astype(np.float32) / 32768
n = min(len(audio), len(reference))
correlation = float(np.corrcoef(audio[:n].ravel(), reference[:n].ravel())[0, 1])
assert correlation > .98, 'The delivered audio differs from the approved song excerpt'
peak = float(np.abs(audio).max())
assert peak < 1, 'The encoded audio clips'

# View frames from the real MP4, including both transitions and the handoff.
times = [.2, .8, 2.7, 4.5, 5.9, 6.6, 8.6, 9.75]
if EXPECTED > 10:
    times = [.2, .8, 3.34, 6.67, 8.8, 10.13, 11.8, 13.6, 15.46, 16.9, 18.8, EXPECTED-.25]
sheet = Image.new('RGB', (4 * 480, ((len(times)+3)//4) * 294), '#f3ebdc')
draw = ImageDraw.Draw(sheet)
for i, t in enumerate(times):
    rgb = run(FFMPEG, '-v', 'error', '-ss', str(t), '-i', str(VIDEO), '-frames:v', '1', '-vf', 'scale=480:270', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-')
    frame = Image.frombytes('RGB', (480, 270), rgb)
    x, y = i % 4 * 480, i // 4 * 294
    sheet.paste(frame, (x, y + 24))
    draw.text((x + 7, y + 5), f'{t:.2f}s', fill='#48333c')
sheet.save(ROOT / 'out' / 'check' / f'encoded-review-{TAG}.jpg', quality=92)

report = {
    'duration_seconds': float(metadata['format']['duration']),
    'width': v['width'], 'height': v['height'], 'fps': v['r_frame_rate'],
    'decoded_video_frames': len(frames), 'video_codec': v['codec_name'], 'audio_codec': a['codec_name'],
    'audio_peak_dbfs': 20 * float(np.log10(peak + 1e-12)),
    'audio_rms_dbfs': 20 * float(np.log10(np.sqrt(np.mean(audio * audio)) + 1e-12)),
    'audio_reference_correlation': correlation,
    'minimum_mean_brightness': float(frames.mean(axis=(1, 2)).min()),
    'mean_frame_motion': float(motion.mean()),
    'size_bytes': VIDEO.stat().st_size,
}
(ROOT / 'out' / f'delivery-check-{TAG}.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
