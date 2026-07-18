import assert from "node:assert/strict";
import { ENEMIES } from "../src/data/enemies.js";
import { LOOT_TABLES } from "../src/data/lootTables.js";
import { ZONES } from "../src/world/maps.js";

assert.ok(Object.keys(ENEMIES).length >= 5, "Milník 05 musí obsahovat alespoň pět typů nepřátel.");
for (const [enemyId, enemy] of Object.entries(ENEMIES)) {
  assert.equal(enemy.id, enemyId);
  assert.ok(enemy.name && enemy.kind, `${enemyId}: chybí název nebo sprite kind.`);
  assert.ok(enemy.maxHp > 0 && enemy.speed > 0 && enemy.aggroRange > 0);
  assert.ok(Array.isArray(enemy.damage) && enemy.damage.length === 2 && enemy.damage[1] >= enemy.damage[0]);
  assert.ok(enemy.attackCooldown > 0 && enemy.attackRange > 0);
  assert.ok(LOOT_TABLES[enemy.lootTable], `${enemyId}: neznámá loot tabulka ${enemy.lootTable}.`);
}

const enemyEntities = Object.values(ZONES).flatMap((zone) => zone.entities.filter((entity) => entity.enemyId));
assert.ok(enemyEntities.length >= 6, "Ve světě musí být nejméně šest bojových setkání.");
for (const entity of enemyEntities) {
  assert.ok(ENEMIES[entity.enemyId], `${entity.id}: neznámý nepřítel ${entity.enemyId}.`);
  assert.equal(entity.solid, true, `${entity.id}: živý nepřítel musí mít kolizi.`);
}
assert.ok(Object.values(ENEMIES).some((enemy) => enemy.boss), "Chybí boss.");
assert.ok(Object.values(ENEMIES).some((enemy) => enemy.projectileSpeed > 0), "Chybí nepřítel na dálku.");
console.log(`Enemy data OK: ${Object.keys(ENEMIES).length} typů, ${enemyEntities.length} setkání, boss a střelci.`);
