import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World();
const enemy = world.entities.find((entity) => entity.enemyId);
world.combat.getEnemyState(enemy.id);
world.magic.applyEnemyStatus(enemy.id, "chilled", 1, 1, "test", "Test");
assert.equal(world.magic.getEnemyModifier(enemy.id, "speed"), 0.58);
world.update(1.1);
assert.equal(world.magic.getEnemyModifier(enemy.id, "speed"), 1, "Stav po vypršení zůstal aktivní.");

world.magic.applyPartyStatus("daren", "warded", 10, 1, "test", "Test");
assert.equal(world.magic.getPartyModifier("daren", "defense"), 18);
assert.equal(world.magic.getPartyModifier("daren", "resistance"), 12);
world.magic.applyPartyStatus("daren", "burning", 10, 1, "test", "Test");
assert.equal(world.magic.cleanseMember("daren"), 1);
assert.ok(world.magic.getPartyStatuses("daren").every((status) => status.definition.category === "positive"));

world.magic.applyPartyStatus("lyra", "regeneration", 8, 1, "test", "Obnova");
world.partyManager.applyDamage("lyra", 20);
const hp = world.partyManager.getMember("lyra").hp;
for (let i = 0; i < 22; i += 1) world.update(0.1);
assert.ok(world.partyManager.getMember("lyra").hp > hp, "Regenerace neléčí.");
console.log("Status flow OK: zpomalení, vypršení, obranné bonusy, očištění a regenerace.");
