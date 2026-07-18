import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  ASSET_MANIFEST,
  EFFECT_SPRITES,
  ENEMY_SPRITES,
  FLOOR_TEXTURES,
  ITEM_ICONS,
  ABILITY_ICONS,
  PORTRAITS,
  WALL_TEXTURES,
  WEAPON_SPRITES,
  WORLD_SPRITES,
} from "../src/data/assets.js";

function pngDimensions(buffer) {
  assert.equal(buffer.subarray(1, 4).toString("ascii"), "PNG", "Soubor není PNG.");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

for (const [key, descriptor] of Object.entries(ASSET_MANIFEST)) {
  const path = fileURLToPath(descriptor.url);
  const buffer = await readFile(path);
  const dimensions = pngDimensions(buffer);
  assert.equal(dimensions.width, descriptor.frameWidth * descriptor.columns, `${key}: nesprávná šířka atlasu.`);
  assert.equal(dimensions.height, descriptor.frameHeight * descriptor.rows, `${key}: nesprávná výška atlasu.`);
  assert.ok((await stat(path)).size > 500, `${key}: atlas je podezřele malý.`);
}

for (const [memberId, url] of Object.entries(PORTRAITS)) {
  const buffer = await readFile(fileURLToPath(url));
  assert.deepEqual(pngDimensions(buffer), { width: 64, height: 80 }, `${memberId}: portrét má nesprávný rozměr.`);
}

assert.equal(Object.keys(WALL_TEXTURES).length, 5);
assert.equal(Object.keys(FLOOR_TEXTURES).length, 3);
assert.equal(Object.keys(WORLD_SPRITES).length, 14);
assert.equal(Object.keys(ENEMY_SPRITES).length, 6);
assert.equal(Object.keys(WEAPON_SPRITES).length, 4);
assert.equal(Object.keys(EFFECT_SPRITES).length, 10);
assert.equal(Object.keys(PORTRAITS).length, 4);
assert.equal(Object.keys(ITEM_ICONS).length, 34);
assert.equal(Object.keys(ABILITY_ICONS).length, 16);

console.log("Asset validation OK: 7 atlasů, 5 stěn, 3 podlahy, 14 objektů, 6 nepřátel, 4 zbraně, 10 efektů, 50 ikon a 4 portréty.");
