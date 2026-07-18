import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World();
for (const entity of world.entities) if (entity.enemyId && entity.id !== "echo-warden") entity.hidden = true;
const boss = world.entities.find((entity) => entity.id === "echo-warden");
world.player.x = boss.x;
world.player.y = boss.y + 3;
const state = world.combat.ensureEnemyState(boss);
state.alerted = true;
state.hp = 160;
world.update(0.1);
assert.equal(world.combat.getEnemyBrain(boss.id)?.phase, 2, "Boss nepřešel do druhé fáze.");
assert.equal(world.entities.filter((entity) => entity.enemyId === "echoShade").length, 2, "Druhá fáze nepovolala dvě ozvěny.");

state.hp = 80;
world.update(0.1);
assert.equal(world.combat.getEnemyBrain(boss.id)?.phase, 3, "Boss nepřešel do třetí fáze.");
assert.ok(world.party.some((member) => world.magic.getPartyStatuses(member.id).some((status) => status.id === "shaken")), "Třetí fáze nepoužila ničivý puls.");
const view = world.combat.getTargetView(world) || (() => { world.combat.targetId = boss.id; return world.combat.getTargetView(world); })();
assert.equal(view.phase, 3);
console.log("Boss phase OK: fáze 2, přivolání posil, fáze 3 a ničivý puls.");
