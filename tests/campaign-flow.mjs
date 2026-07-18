import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World();
const emit = (event, target, count = 1) => world.emitQuestEvent(event, target, count);

emit("dialogue", "elira:accepted");
emit("inspect", "silver-marker");
emit("collect", "silver-fragment");
emit("dialogue", "elira:return");
assert.equal(world.quests.getStatus("silverEcho"), "completed");
world.changeZone("silverPass", "fromVale");
world.changeZone("echoCrypt", "entrance");
emit("mechanism", "crypt-lever");
emit("inspect", "crypt-altar");
assert.equal(world.quests.getStatus("beneathGate"), "completed");
assert.equal(world.quests.getStatus("councilOfSilverhaven"), "active");

world.changeZone("silverhaven", "fromPass");
assert.equal(world.quests.getStatus("councilOfSilverhaven"), "completed");
emit("dialogue", "leader:watch");
emit("dialogue", "leader:caravans");
emit("dialogue", "leader:archive");
assert.equal(world.quests.getStatus("threeVoices"), "completed");
world.flags["campaign:expeditionAlliance"] = "freeCaravans";
world.adjustFaction("freeCaravans", 2);
emit("dialogue", "alliance:chosen");
assert.equal(world.flags["access:ashenMarch"], true);

world.changeZone("ashenMarch", "fromCity");
emit("inspect", "broken-caravan");
emit("mechanism", "march-beacon");
world.changeZone("drownedAbbey", "entrance");
emit("kill", "echoShade", 4);
world.flags["campaign:relicChoice"] = "preserve";
world.adjustFaction("obsidianArchive", 2);
emit("dialogue", "reliquary:chosen");

world.changeZone("glasswood", "fromAbbey");
emit("inspect", "memory-tree", 3);
world.changeZone("obsidianArchive", "fromGlasswood");
emit("mechanism", "archive-seal");
emit("inspect", "obsidian-tablet", 3);
emit("collect", "true-name-tablet");
world.addItem("true-name-tablet", 1);
emit("dialogue", "council:true-name");
world.flags["campaign:finalAlliance"] = "obsidianArchive";
world.adjustFaction("obsidianArchive", 4);
emit("dialogue", "final-alliance:chosen");

world.changeZone("crownCitadel", "fromCity");
emit("inspect", "crown-anchor", 3);
world.changeZone("hollowThrone", "entrance");
emit("kill", "morKharr");

assert.equal(world.quests.getStatus("hollowThrone"), "completed");
const ending = world.consumeEnding();
assert.ok(ending);
assert.equal(ending.id, "obsidianArchive-preserve");
assert.match(ending.title, /Katalog/);
assert.equal(world.consumeEnding(), null, "Epilog se nesmí otevřít opakovaně.");

const snapshot = world.snapshot();
assert.equal(snapshot.version, 11);
assert.equal(snapshot.campaign.ending.id, ending.id);
assert.equal(snapshot.factions.obsidianArchive, 6);
const restored = new World();
restored.restore(snapshot);
assert.equal(restored.campaign.ending.id, ending.id);
assert.equal(restored.quests.getStatus("hollowThrone"), "completed");

console.log("Campaign flow OK: celá hlavní osa, dvě rozhodnutí, frakce, epilog a persistence.");
