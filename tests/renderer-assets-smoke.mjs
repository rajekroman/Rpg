import assert from "node:assert/strict";

let externalDraws = 0;
const externalImage = { external: true, width: 768, height: 896 };
function gradient() { return { addColorStop() {} }; }
function makeContext() {
  const target = {
    createLinearGradient: gradient,
    createRadialGradient: gradient,
    measureText: () => ({ width: 10 }),
    drawImage(image) { if (image?.external) externalDraws += 1; },
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
globalThis.document = { createElement(tag) { assert.equal(tag, "canvas"); return makeCanvas(64, 64); } };

const frame = { image: externalImage, sx: 0, sy: 0, sw: 64, sh: 64 };
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
const world = new World("willowVale");
renderer.render(world, 0);
assert.ok(externalDraws > 100, `Renderer musí použít externí atlasy; drawImage=${externalDraws}.`);

console.log(`Renderer asset smoke OK: ${externalDraws} vykreslení z PNG atlasů.`);
