import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
const main = await readFile(new URL("../src/main.js", import.meta.url), "utf8");
assert.ok(main.indexOf("const game = new Game") < main.indexOf("audio.loadAll().then"), "Menu musí být zpřístupněno před dokončením načítání audia.");
const gameSize = (await stat(new URL("../src/core/Game.js", import.meta.url))).size;
const cssSize = (await stat(new URL("../styles.css", import.meta.url))).size;
assert.ok(gameSize < 150_000, `Game.js překročil rozpočet: ${gameSize}`);
assert.ok(cssSize < 100_000, `styles.css překročil rozpočet: ${cssSize}`);
console.log(`Release budget OK: Game.js ${(gameSize/1024).toFixed(1)} KiB, CSS ${(cssSize/1024).toFixed(1)} KiB, audio neblokuje menu.`);
