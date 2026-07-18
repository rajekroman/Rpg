import assert from "node:assert/strict";
import { World } from "../src/world/World.js";
import { DialogueManager } from "../src/systems/DialogueManager.js";
import { DIALOGUES } from "../src/data/dialogues.js";

const world = new World("willowVale");
const dialogues = new DialogueManager(DIALOGUES);

let view = dialogues.start("elira", world);
assert.equal(view.nodeId, "intro");
assert.equal(view.choices.length, 3);
let outcome = dialogues.choose("intro:0", world);
assert.equal(outcome.view.nodeId, "gateLore");
outcome = dialogues.choose("gateLore:0", world);
assert.equal(outcome.view.nodeId, "taskGiven");
assert.equal(world.quests.getState("silverEcho").stageIndex, 1);
dialogues.choose("taskGiven:0", world);

world.inspectEntity(world.entities.find((entity) => entity.id === "silver-marker"));
world.collectEntity(world.entities.find((entity) => entity.id === "silver-fragment"));
view = dialogues.start("elira", world);
assert.equal(view.nodeId, "return");
assert.equal(view.choices[0].label, "Předat krystalický střep.");
outcome = dialogues.choose("return:0", world);
assert.equal(outcome.view.nodeId, "revelation");
assert.equal(world.quests.getStatus("silverEcho"), "completed");
assert.equal(world.flags["prologue:echoIdentified"], true);

view = dialogues.start("tomar", world);
assert.equal(view.nodeId, "offer");
outcome = dialogues.choose("offer:1", world);
assert.equal(outcome.view.nodeId, "letters");
outcome = dialogues.choose("letters:0", world);
assert.equal(world.quests.getStatus("lostSatchel"), "active");

view = dialogues.start("mira", world);
assert.equal(view.nodeId, "offer");
outcome = dialogues.choose("offer:1", world);
assert.equal(outcome.view.nodeId, "illness");

console.log("Dialogue flow OK: větvení, podmínky, efekty a změna vstupních uzlů.");
