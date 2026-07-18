import assert from "node:assert/strict";
import { AssetManager } from "../src/core/AssetManager.js";

class FakeImage {
  set src(value) {
    this.url = value;
    queueMicrotask(() => this.onload?.());
  }
}
globalThis.Image = FakeImage;

const manager = new AssetManager({
  demo: { url: "demo.png", frameWidth: 64, frameHeight: 64, columns: 4, rows: 3 },
});
const result = await manager.loadAll();
assert.deepEqual(result, { loaded: 1, failed: 0, fallback: false });
const frame = manager.getFrame("demo", 2, 1);
assert.equal(frame.sx, 128);
assert.equal(frame.sy, 64);
assert.equal(frame.sw, 64);
assert.equal(frame.sh, 64);
assert.equal(frame.image.url, "demo.png");

console.log("Asset manager OK: asynchronní preload a výřez atlasu.");
