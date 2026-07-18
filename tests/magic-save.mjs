import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World();
world.partyManager.awardExperience(500);
world.magic.applyPartyStatus("daren", "courage", 9, 1, "daren", "Bojový pokřik");
world.magic.applyEnemyStatus("echo-hound-west", "burning", 5, 4, "orin", "Žhavý šíp");
world.magic.setHotbarSlot("orin", 7, "fireNova", world.partyManager);
world.magic.cooldowns.orin.fireNova = 4.25;
const snapshot = world.snapshot();
const restored = new World();
restored.restore(snapshot);
assert.ok(restored.magic.getPartyStatuses("daren").some((status) => status.id === "courage"));
assert.ok(restored.magic.getEnemyStatuses("echo-hound-west").some((status) => status.id === "burning"));
assert.equal(restored.magic.getHotbar("orin")[7], "fireNova");
assert.equal(restored.magic.getCooldown("orin", "fireNova"), 4.25);

const legacy = structuredClone(snapshot);
delete legacy.magic;
const migrated = new World();
migrated.restore(legacy);
assert.equal(migrated.magic.getHotbar("orin")[0], "emberBolt");
assert.equal(migrated.magic.getPartyStatuses("daren").length, 0);
console.log("Magic save OK: stavy, cooldowny, hotbar a migrace uložené pozice M05.");
