import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World();
const raider = world.entities.find((entity) => entity.id === "ash-raider-south");
world.player.x = raider.x;
world.player.y = raider.y - 3;
world.player.direction = Math.PI / 2;
const hpBefore = world.party.reduce((sum, member) => sum + member.hp, 0);

for (let tick = 0; tick < 100; tick += 1) world.update(0.1);
const hpAfter = world.party.reduce((sum, member) => sum + member.hp, 0);
assert.ok(world.combat.getEnemyState(raider.id)?.alerted, "Střelec neaktivoval aggro.");
assert.ok(hpAfter < hpBefore, "Nepřátelská AI nezpůsobila poškození.");
assert.ok(world.combat.inCombat, "Soubojový stav se neaktivoval.");

const paused = world.toggleTacticalPause();
assert.equal(paused, true);
const positions = world.entities.filter((entity) => entity.enemyId).map((entity) => [entity.id, entity.x, entity.y]);
const partyHp = world.party.map((member) => member.hp);
world.move({ forward: 1, strafe: 0, turn: 0 }, 1);
for (let tick = 0; tick < 20; tick += 1) world.update(0.1);
assert.deepEqual(world.party.map((member) => member.hp), partyHp, "Během taktické pauzy pokračovalo poškození.");
assert.deepEqual(world.entities.filter((entity) => entity.enemyId).map((entity) => [entity.id, entity.x, entity.y]), positions, "Během taktické pauzy se pohybovali nepřátelé.");
assert.equal(world.toggleTacticalPause(), false);

const target = world.cycleCombatTarget();
assert.ok(target?.enemyId, "Přepínání cíle nenašlo nepřítele.");
console.log("Combat AI OK: aggro, střelba, poškození, bojový stav, cílení a taktická pauza.");
