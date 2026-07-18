import assert from "node:assert/strict";
import { ZONES } from "../src/world/maps.js";

let draws = 0;
function gradient() { return { addColorStop() {} }; }
function makeContext() {
  const target = {
    createLinearGradient: gradient,
    createRadialGradient: gradient,
    measureText: () => ({ width: 10 }),
    drawImage() { draws += 1; },
  };
  return new Proxy(target, {
    get(object, property) { return property in object ? object[property] : () => {}; },
    set(object, property, value) { object[property] = value; return true; },
  });
}
function makeCanvas(width = 640, height = 360) {
  const context = makeContext();
  return { width, height, getContext() { return context; } };
}
globalThis.document = {
  createElement(tag) {
    assert.equal(tag, "canvas");
    return makeCanvas(64, 64);
  },
};

const frame = { image: { width: 1024, height: 1024 }, sx: 0, sy: 0, sw: 64, sh: 64 };
const assets = {
  getFloorTexture: () => frame,
  getWallTexture: () => frame,
  getWorldSprite: () => frame,
  getEnemySprite: () => frame,
  getWeaponSprite: () => frame,
  getEffectSprite: () => frame,
};
const { Raycaster } = await import("../src/render/Raycaster.js");
const { World } = await import("../src/world/World.js");
const renderer = new Raycaster(makeCanvas(), assets);

for (const zoneId of Object.keys(ZONES)) {
  const world = new World(zoneId);
  renderer.render(world, 0.33);
  assert.equal(renderer.zBuffer.length, 640, `Depth buffer selhal v oblasti ${zoneId}.`);
}
assert.equal(Object.keys(ZONES).length, 10);
assert.ok(draws > 500, `Atlasy nebyly při kampani dostatečně použity; drawImage=${draws}.`);
console.log(`Campaign renderer OK: ${Object.keys(ZONES).length} oblastí, ${draws} bitmapových vykreslení.`);
