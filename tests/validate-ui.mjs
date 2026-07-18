import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const game = await readFile(new URL("../src/core/Game.js", import.meta.url), "utf8");
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
const requested = [...game.matchAll(/byId\("([^"]+)"\)/g)].map((match) => match[1]);

for (const id of requested) assert.ok(ids.has(id), `Game.js očekává chybějící HTML prvek #${id}`);
assert.equal(ids.size, new Set(ids).size, "HTML obsahuje duplicitní id.");
assert.ok(html.includes('lang="cs"'));
assert.ok(html.includes('src/main.js'));

console.log(`UI contract OK: ${requested.length} požadovaných prvků existuje v index.html.`);
