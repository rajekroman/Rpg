import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World();
const hound = world.entities.find((entity) => entity.id === "echo-hound-west");
assert.ok(hound);
world.player.x = hound.x - 1.2;
world.player.y = hound.y;
world.player.direction = 0;
const startingXp = world.partyManager.getMember("daren").experience;

let attempts = 0;
while (!world.combat.getEnemyState(hound.id)?.dead && attempts < 20) {
  const result = world.attack();
  assert.ok(result.ok, result.reason);
  for (let tick = 0; tick < 18; tick += 1) world.update(0.1);
  attempts += 1;
}
const houndState = world.combat.getEnemyState(hound.id);
assert.ok(houndState?.dead, "Boj zblízka neporažil protivníka.");
assert.equal(hound.kind, "corpse");
assert.equal(hound.solid, false);
assert.equal(hound.interaction.type, "loot");
assert.ok(world.partyManager.getMember("daren").experience > startingXp, "Za zabití nebyly přiděleny zkušenosti.");

const loot = world.openLoot(hound);
assert.ok(loot.ok, loot.reason);
assert.equal(hound.hidden, true);
assert.equal(world.flags[`looted:${hound.id}`], true);

const rangedWorld = new World();
const rangedTarget = rangedWorld.entities.find((entity) => entity.id === "echo-hound-west");
rangedWorld.selectPartyMember("lyra", false);
rangedWorld.player.x = rangedTarget.x - 4;
rangedWorld.player.y = rangedTarget.y;
rangedWorld.player.direction = 0;
const ranged = rangedWorld.attack();
assert.ok(ranged.ok && ranged.pending && ranged.attackKind === "ranged");
assert.equal(rangedWorld.combat.projectiles.length, 1);
for (let tick = 0; tick < 30 && rangedWorld.combat.projectiles.length; tick += 1) rangedWorld.update(0.05);
assert.equal(rangedWorld.combat.projectiles.length, 0);
assert.ok(rangedWorld.combat.getEnemyState(rangedTarget.id).hp < 58, "Projektil nezasáhl protivníka.");
console.log("Combat flow OK: melee, střelba, projektil, smrt, XP a kořist.");
