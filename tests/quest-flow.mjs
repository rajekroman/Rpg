import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World("willowVale");
assert.equal(world.quests.getStatus("silverEcho"), "active");
assert.equal(world.quests.getState("silverEcho").stageIndex, 0);

world.emitQuestEvent("dialogue", "elira:accepted");
assert.equal(world.quests.getState("silverEcho").stageIndex, 1);

const marker = world.entities.find((entity) => entity.id === "silver-marker");
const fragment = world.entities.find((entity) => entity.id === "silver-fragment");
assert.ok(world.isEntityVisible(fragment), "Střep se má objevit ve druhé fázi hlavního questu.");
world.inspectEntity(marker);
world.collectEntity(fragment);
assert.equal(world.getItemCount("silver-fragment"), 1);
assert.equal(world.quests.getState("silverEcho").stageIndex, 2);
assert.equal(world.isEntityVisible(fragment), false, "Sebraný střep musí zmizet.");

world.removeItem("silver-fragment", 1);
world.emitQuestEvent("dialogue", "elira:return");
assert.equal(world.quests.getStatus("silverEcho"), "completed");
assert.equal(world.gold, 110);
assert.equal(world.reputation, 1);
assert.equal(world.getItemCount("eliras-seal"), 1);

world.startQuest("lostSatchel");
const satchel = world.entities.find((entity) => entity.id === "lost-satchel");
assert.ok(world.isEntityVisible(satchel));
world.collectEntity(satchel);
assert.equal(world.quests.getState("lostSatchel").stageIndex, 1);
world.removeItem("lost-satchel", 1);
world.emitQuestEvent("dialogue", "tomar:return");
assert.equal(world.quests.getStatus("lostSatchel"), "completed");

world.startQuest("moonleafTonic");
for (const herb of world.entities.filter((entity) => entity.kind === "herb")) world.collectEntity(herb);
assert.equal(world.getItemCount("moonleaf"), 3);
assert.equal(world.quests.getState("moonleafTonic").stageIndex, 1);
world.removeItem("moonleaf", 3);
world.emitQuestEvent("dialogue", "mira:return");
assert.equal(world.quests.getStatus("moonleafTonic"), "completed");
assert.equal(world.gold, 175);
assert.equal(world.reputation, 2);
assert.equal(world.getItemCount("moonleaf-tonic"), 1);

const snapshot = world.snapshot();
const restored = new World("willowVale");
restored.restore(snapshot);
assert.deepEqual(restored.quests.snapshot(), world.quests.snapshot());
assert.deepEqual(restored.inventory, world.inventory);
assert.equal(restored.gold, 175);

console.log("Quest flow OK: hlavní quest, 2 vedlejší questy, odměny a save/restore.");
