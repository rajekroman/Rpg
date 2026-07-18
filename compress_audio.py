#!/usr/bin/env python3
"""Compress generated WAV assets to MP3 and write a reproducible integrity index."""
from pathlib import Path
import hashlib, json, subprocess

ROOT = Path(__file__).resolve().parents[1] / "assets" / "audio"
for wav in sorted(ROOT.rglob("*.wav")):
    bitrate = "96k" if "music" in wav.parts else "80k" if "ambience" in wav.parts else "56k"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(wav), "-codec:a", "libmp3lame", "-b:a", bitrate, "-ar", "22050", str(wav.with_suffix(".mp3"))], check=True)
index = {}
for mp3 in sorted(ROOT.rglob("*.mp3")):
    probe = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "stream=codec_name,channels,sample_rate,duration", "-of", "json", str(mp3)], text=True))["streams"][0]
    data = mp3.read_bytes()
    index[mp3.relative_to(ROOT).as_posix()] = {
        "codec": probe["codec_name"], "channels": int(probe["channels"]), "sampleRate": int(probe["sample_rate"]),
        "duration": round(float(probe["duration"]), 3), "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest(),
    }
(ROOT / "audio-index.json").write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n")
print(f"Compressed {len(index)} files")
