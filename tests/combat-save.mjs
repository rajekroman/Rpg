import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const original = new World();
const enemy = original.entities.find((entity) => entity.id === "echo-hound-west");
original.player.x = enemy.x - 1.2;
original.player.y = enemy.y;
original.player.direction = 0;
const attack = original.attack();
assert.ok(attack.ok);
original.toggleTacticalPause();
const snapshot = original.snapshot();

const restored = new World();
restored.restore(snapshot);
assert.deepEqual(restored.combat.getEnemyState(enemy.id), original.combat.getEnemyState(enemy.id));
assert.equal(restored.combat.getMemberCooldown("daren"), original.combat.getMemberCooldown("daren"));
assert.equal(restored.combat.targetId, original.combat.targetId);
assert.equal(restored.combat.tacticalPaused, true);
assert.equal(restored.entities.find((entity) => entity.id === enemy.id).x, enemy.x);

const legacy = structuredClone(snapshot);
delete legacy.combat;
const migrated = new World();
migrated.restore(legacy);
assert.equal(migrated.combat.tacticalPaused, false);
assert.equal(migrated.combat.getEnemyState(enemy.id), null);
migrated.update(0.01);
assert.ok(migrated.combat.getEnemyState(enemy.id), "Starší save nevytvořil bojový stav nových nepřátel.");
console.log("Combat save OK: stav nepřátel, cooldown, cíl, pauza a migrace M04.");
