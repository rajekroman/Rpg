import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World("hollowThrone");
for (const entity of world.entities) if (entity.enemyId && entity.id !== "mor-kharr") entity.hidden = true;
const boss = world.entities.find((entity) => entity.id === "mor-kharr");
assert.ok(boss, "Mor-Kharr chybí v Prázdném trůnu.");
world.player.x = boss.x;
world.player.y = boss.y + 3;
const state = world.combat.ensureEnemyState(boss);
state.alerted = true;

const healParty = () => {
  for (const member of world.party) {
    member.hp = member.maxHp;
    member.condition = "healthy";
  }
};

state.hp = 535;
healParty();
world.update(0.1);
assert.equal(world.combat.getEnemyBrain(boss.id)?.phase, 2, "Mor-Kharr nepřešel do druhé fáze.");
assert.ok(world.entities.filter((entity) => entity.summoned).length >= 2, "Druhá fáze nepovolala ozvěny.");

state.hp = 320;
healParty();
world.update(0.1);
assert.equal(world.combat.getEnemyBrain(boss.id)?.phase, 3, "Mor-Kharr nepřešel do třetí fáze.");
assert.ok(world.party.some((member) => world.magic.getPartyStatuses(member.id).some((status) => status.id === "exposed")), "Třetí fáze nepoužila Vlnu zlomu.");

state.hp = 120;
healParty();
world.update(0.1);
assert.equal(world.combat.getEnemyBrain(boss.id)?.phase, 4, "Mor-Kharr nepřešel do čtvrté fáze.");
assert.ok(world.party.some((member) => world.magic.getPartyStatuses(member.id).some((status) => status.id === "shaken")), "Čtvrtá fáze nepoužila Ničivý puls.");

world.combat.targetId = boss.id;
const target = world.combat.getTargetView(world);
assert.equal(target.phase, 4);
assert.equal(target.maxHp, 720);

const snapshot = world.snapshot();
const restored = new World();
restored.restore(snapshot);
assert.equal(restored.zoneId, "hollowThrone");
assert.equal(restored.combat.getEnemyBrain(boss.id)?.phase, 4);
assert.ok(restored.entities.some((entity) => entity.summoned), "Přivolané ozvěny se po načtení ztratily.");
console.log("Final boss OK: 4 fáze, posily, plošné schopnosti a persistence.");
