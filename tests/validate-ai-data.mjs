import assert from "node:assert/strict";
import { ENEMIES } from "../src/data/enemies.js";
import { ENEMY_ABILITIES } from "../src/data/enemyAbilities.js";

assert.ok(Object.keys(ENEMIES).length >= 6, "Chybí archetypy nepřátel.");
assert.ok(Object.keys(ENEMY_ABILITIES).length >= 8, "Chybí nepřátelské schopnosti.");
for (const enemy of Object.values(ENEMIES)) {
  assert.ok(enemy.aiRole, `${enemy.id}: chybí AI role.`);
  assert.ok(Array.isArray(enemy.abilities), `${enemy.id}: abilities musí být pole.`);
  for (const abilityId of enemy.abilities) assert.ok(ENEMY_ABILITIES[abilityId], `${enemy.id}: neznámá schopnost ${abilityId}.`);
}
const boss = ENEMIES.echoWarden;
assert.equal(boss.boss, true);
assert.equal(boss.phases.length, 2);
assert.deepEqual(boss.phases.map((phase) => phase.phase), [2, 3]);
const finalBoss = ENEMIES.morKharr;
assert.equal(finalBoss.boss, true);
assert.deepEqual(finalBoss.phases.map((phase) => phase.phase), [2, 3, 4]);
console.log(`AI data OK: ${Object.keys(ENEMIES).length} archetypů, ${Object.keys(ENEMY_ABILITIES).length} schopností, bossové se 3 a 4 fázemi.`);
