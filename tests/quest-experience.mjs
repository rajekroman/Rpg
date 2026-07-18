import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World("willowVale");
world.emitQuestEvent("dialogue", "elira:accepted");
world.inspectEntity(world.entities.find((entity) => entity.id === "silver-marker"));
world.collectEntity(world.entities.find((entity) => entity.id === "silver-fragment"));
world.removeItem("silver-fragment", 1);
world.emitQuestEvent("dialogue", "elira:return");

for (const member of world.party) {
  assert.equal(member.experience, 180);
  assert.equal(member.level, 2);
}

world.startQuest("lostSatchel");
world.collectEntity(world.entities.find((entity) => entity.id === "lost-satchel"));
world.removeItem("lost-satchel", 1);
world.emitQuestEvent("dialogue", "tomar:return");

world.startQuest("moonleafTonic");
for (const herb of world.entities.filter((entity) => entity.kind === "herb")) world.collectEntity(herb);
world.removeItem("moonleaf", 3);
world.emitQuestEvent("dialogue", "mira:return");

for (const member of world.party) {
  assert.equal(member.experience, 335);
  assert.equal(member.level, 3, `${member.name} nedosáhl plánované úrovně 3.`);
  assert.equal(member.attributePoints, 6);
  assert.equal(member.skillPoints, 4);
}

const snapshot = world.snapshot();
const restored = new World("willowVale");
restored.restore(snapshot);
assert.deepEqual(restored.partyManager.snapshot(), world.partyManager.snapshot());

console.log("Quest experience OK: kampaň přivede celou družinu na úroveň 3 a stav se ukládá.");
