#!/usr/bin/env python3
"""Generate the production service worker core asset list."""
from pathlib import Path
import json
ROOT = Path(__file__).resolve().parents[1]
paths = [Path("index.html"), Path("styles.css"), Path("manifest.webmanifest")]
paths += sorted((ROOT / "src").rglob("*.js"))
paths += sorted(path for path in (ROOT / "assets").rglob("*") if path.is_file() and path.suffix.lower() in {".png", ".jpg", ".jpeg", ".mp3", ".json"})
paths += sorted((ROOT / "vendor").rglob("*.js"))
relative = []
for item in paths:
    path = item if not item.is_absolute() else item.relative_to(ROOT)
    relative.append("./" + path.as_posix())
relative = sorted(set(["./"] + relative))
source = f'''const CACHE_VERSION = "ksb-2.0.0-professional";
const CORE_CACHE = `${{CACHE_VERSION}}-core`;
const RUNTIME_CACHE = `${{CACHE_VERSION}}-runtime`;
const CORE_ASSETS = {json.dumps(relative, ensure_ascii=False, indent=2)};

self.addEventListener("install", (event) => {{
  event.waitUntil(caches.open(CORE_CACHE).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()));
}});

self.addEventListener("activate", (event) => {{
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
}});

self.addEventListener("message", (event) => {{
  if (event.data === "SKIP_WAITING") self.skipWaiting();
}});

self.addEventListener("fetch", (event) => {{
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {{
    event.respondWith(fetch(request).then((response) => {{
      const copy = response.clone();
      caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
      return response;
    }}).catch(async () => (await caches.match(request)) || caches.match("./index.html")));
    return;
  }}

  event.respondWith(caches.match(request).then((cached) => {{
    if (cached) return cached;
    return fetch(request).then((response) => {{
      if (response.ok && response.type === "basic") {{
        const copy = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
      }}
      return response;
    }});
  }}));
}});
'''
(ROOT / "sw.js").write_text(source)
print(f"Generated sw.js with {len(relative)} core assets")
