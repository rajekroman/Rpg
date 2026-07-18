#!/usr/bin/env python3
"""Build a clean static GitHub Pages distribution."""
from pathlib import Path
import shutil
ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
if DIST.exists(): shutil.rmtree(DIST)
DIST.mkdir()
for name in ["index.html", "styles.css", "manifest.webmanifest", "sw.js", ".nojekyll"]:
    shutil.copy2(ROOT / name, DIST / name)
for directory in ["src", "assets", "vendor"]:
    shutil.copytree(ROOT / directory, DIST / directory)
print(f"Built {DIST}")
