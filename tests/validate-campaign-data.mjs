import assert from "node:assert/strict";
import { QUESTS } from "../src/data/quests.js";
import { DIALOGUES } from "../src/data/dialogues.js";
import { ZONES } from "../src/world/maps.js";
import { FACTIONS } from "../src/data/factions.js";
import { ITEMS } from "../src/data/items.js";
import { ENEMIES } from "../src/data/enemies.js";

const main = Object.values(QUESTS).filter((quest) => quest.category === "main");
const side = Object.values(QUESTS).filter((quest) => quest.category === "side");
assert.equal(main.length, 20, "Kampaň musí mít přesně 20 hlavních questů.");
assert.equal(side.length, 30, "Kampaň musí mít přesně 30 vedlejších questů.");
assert.equal(Object.keys(ZONES).length, 10, "Kampaň musí obsahovat 10 oblastí.");
assert.equal(Object.keys(FACTIONS).length, 3);
assert.ok(DIALOGUES.councilScribe && DIALOGUES.reliquaryVoice);
assert.ok(ITEMS["true-name-tablet"] && ITEMS["reliquary-heart"]);
assert.ok(ENEMIES.morKharr?.boss);
assert.ok((ZONES.hollowThrone.entities || []).some((entity) => entity.enemyId === "morKharr"));

console.log(`Campaign data OK: ${main.length} hlavních, ${side.length} vedlejších questů, ${Object.keys(ZONES).length} oblastí a ${Object.keys(FACTIONS).length} frakce.`);
