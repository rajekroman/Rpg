import assert from "node:assert/strict";
import { World } from "../src/world/World.js";
import { DialogueManager } from "../src/systems/DialogueManager.js";
import { DIALOGUES } from "../src/data/dialogues.js";

const world = new World();
const dialogues = new DialogueManager(DIALOGUES);
const view = dialogues.start("valeBoard", world);
assert.ok(view.choices.some((choice) => choice.label.includes("Zuby v mlze")));
const hunt = view.choices.find((choice) => choice.label.includes("Zuby v mlze"));
dialogues.choose(hunt.id, world);
assert.equal(world.quests.getStatus("valeHounds"), "active");
world.emitQuestEvent("kill", "echoHound", 3);
assert.equal(world.quests.getStatus("valeHounds"), "completed");
assert.ok(world.gold > 35);

const second = dialogues.start("valeBoard", world);
assert.ok(!second.choices.some((choice) => choice.label.includes("Zuby v mlze")), "Dokončená zakázka se nesmí nabízet znovu.");
console.log("Side quest board OK: nabídka, přijetí, dokončení a skrytí zakázky.");
