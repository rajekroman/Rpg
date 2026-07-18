import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const game = readFileSync(resolve(root, "src/core/Game.js"), "utf8");
const hybrid = readFileSync(resolve(root, "src/render/HybridRenderer.js"), "utf8");
const renderer = readFileSync(resolve(root, "src/render/CinematicRenderer.js"), "utf8");
const input = readFileSync(resolve(root, "src/core/InputManager.js"), "utf8");
const hud = readFileSync(resolve(root, "src/ui/Hud.js"), "utf8");
const css = readFileSync(resolve(root, "styles.css"), "utf8");
const index = readFileSync(resolve(root, "index.html"), "utf8");

assert.match(game, /HybridRenderer/);
assert.match(hybrid, /CinematicRenderer/);
assert.match(hybrid, /Raycaster/);
assert.match(renderer, /WebGLRenderer\(\{ canvas, antialias: false/);
assert.match(renderer, /NearestFilter/);
assert.match(renderer, /createProfessionalEnemy/);
assert.match(renderer, /createProfessionalBoss/);
assert.match(renderer, /createArmoredTorso/);
assert.match(renderer, /createWorldObject\(entity\)/);
assert.match(renderer, /fileMaterial\("pro-wall-stone"/);
assert.match(renderer, /ExtrudeGeometry/);
assert.match(renderer, /Math\.min\(512/);
assert.match(renderer, /createBackdropHouse/);
assert.match(renderer, /createRuinedTower/);
assert.match(input, /is-active/);
assert.match(hud, /renderQuickInventory/);
assert.match(css, /Professional production surfaces|Shared production surfaces/);
assert.match(css, /professional\/frame-stone\.png/);
assert.match(css, /grid-template-rows:repeat\(4/);
assert.match(css, /quick-inventory/);
assert.match(css, /image-rendering:pixelated/);
assert.doesNotMatch(index, /⚔|✋|◉|◎|⚙/);
assert.match(index, /VISUAL EDITION 2\.0/);
assert.match(index, /id="quick-inventory"/);
assert.match(index, /id="rest-button"/);
assert.match(index, /styles\.css\?v=2\.0\.0/);

for (const relative of [
  "assets/ui/professional/frame-stone.png",
  "assets/ui/professional/panel-obsidian.png",
  "assets/ui/professional/frame-slot.png",
  "assets/ui/professional/utility-icons.png",
  "assets/ui/professional/portrait-daren.png",
  "assets/textures/professional/stone-wall.png",
  "assets/textures/professional/grass.png",
  "PROFESSIONAL_FINAL_PREVIEW.png",
  "PROFESSIONAL_ASSET_SHEET.png",
  "assets/icons/icon-512.png",
]) assert.ok(statSync(resolve(root, relative)).size > 100, `${relative} chybí nebo je prázdný.`);

assert.ok(statSync(resolve(root, "vendor/three.module.min.js")).size > 250_000);
console.log("Professional visual edition OK: low-resolution 3D, mature enemy models, production textures, stone HUD, party portraits and touch zones.");

assert.ok(!renderer.includes("weapon-sword.png"), "Hlavní renderer nesmí používat prototypový weapon sprite.");
