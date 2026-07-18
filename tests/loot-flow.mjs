import assert from "node:assert/strict";
import { LootManager } from "../src/systems/LootManager.js";
import { World } from "../src/world/World.js";

const lootManager = new LootManager();
assert.deepEqual(lootManager.roll("roadCache", "willowVale:road-cache"), lootManager.roll("roadCache", "willowVale:road-cache"), "Loot musí být deterministický.");
assert.notDeepEqual(lootManager.roll("roadCache", "a"), lootManager.roll("roadCache", "b"), "Různá semena mají poskytovat různou kořist.");

const world = new World();
const chest = world.entities.find((entity) => entity.id === "road-cache");
const goldBefore = world.gold;
const result = world.openLoot(chest);
assert.equal(result.ok, true);
assert.ok(result.items.length > 0);
assert.ok(world.gold > goldBefore);
assert.equal(chest.hidden, true);
assert.equal(world.flags["looted:road-cache"], true);
assert.equal(world.openLoot(chest).ok, false, "Schránku nelze vybrat dvakrát.");

const restored = new World();
restored.restore(world.snapshot());
assert.equal(restored.flags["looted:road-cache"], true);
assert.equal(restored.entities.find((entity) => entity.id === "road-cache").hidden, true);

console.log("Loot flow OK: deterministická kořist, jednorázové truhly a persistence.");
