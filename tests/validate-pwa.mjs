import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const manifest = JSON.parse(await readFile(resolve(root, "manifest.webmanifest"), "utf8"));
assert.equal(manifest.display, "standalone");
assert.equal(manifest.orientation, "landscape");
assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192"));
assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512"));
for (const icon of manifest.icons) assert.ok((await stat(resolve(root, icon.src))).size > 1000, `Chybí ikona ${icon.src}`);
const sw = await readFile(resolve(root, "sw.js"), "utf8");
for (const path of ["./index.html", "./styles.css", "./src/main.js", "./manifest.webmanifest"]) assert.ok(sw.includes(path), `SW neobsahuje ${path}`);
assert.ok(sw.includes("clients.claim"));
assert.ok(sw.includes("RUNTIME_CACHE"));
const coreMatch = sw.match(/const CORE_ASSETS = (\[[\s\S]*?\]);/);
assert.ok(coreMatch, "Nelze přečíst CORE_ASSETS.");
const coreAssets = JSON.parse(coreMatch[1]);
for (const asset of coreAssets.filter((value) => value !== "./")) {
  const local = resolve(root, asset.replace(/^\.\//, ""));
  assert.ok((await stat(local)).isFile(), `Service worker odkazuje na chybějící ${asset}`);
}
assert.ok(!coreAssets.includes("./package.json"));
assert.ok(!coreAssets.some((asset) => asset.includes("ASSET_PREVIEW")));

const html = await readFile(resolve(root, "index.html"), "utf8");
assert.ok(html.includes('rel="manifest"'));
assert.ok(html.includes('apple-touch-icon'));
console.log("PWA validation OK: manifest, ikony, offline cache a instalační metadata.");
