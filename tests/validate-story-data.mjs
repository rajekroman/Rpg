import assert from "node:assert/strict";
import { QUESTS } from "../src/data/quests.js";
import { DIALOGUES } from "../src/data/dialogues.js";

for (const [questId, quest] of Object.entries(QUESTS)) {
  assert.equal(quest.id, questId);
  assert.ok(quest.title && quest.summary);
  assert.ok(Array.isArray(quest.stages) && quest.stages.length > 0);
  for (const stage of quest.stages) {
    assert.ok(stage.title && stage.description);
    assert.ok(stage.objectives.length > 0);
    for (const objective of stage.objectives) {
      assert.ok(objective.id && objective.label && objective.event && objective.target);
      assert.ok((objective.count ?? 1) > 0);
    }
  }
}

for (const [dialogueId, dialogue] of Object.entries(DIALOGUES)) {
  assert.equal(dialogue.id, dialogueId);
  assert.ok(dialogue.entries.length > 0);
  for (const entry of dialogue.entries) assert.ok(dialogue.nodes[entry.node], `${dialogueId}: neznámý vstupní uzel ${entry.node}`);
  for (const [nodeId, node] of Object.entries(dialogue.nodes)) {
    assert.ok(node.speaker && node.text, `${dialogueId}/${nodeId}: chybí text nebo mluvčí`);
    assert.ok(Array.isArray(node.choices) && node.choices.length > 0, `${dialogueId}/${nodeId}: chybí volby`);
    for (const choice of node.choices) {
      assert.ok(choice.label);
      if (choice.next) assert.ok(dialogue.nodes[choice.next], `${dialogueId}/${nodeId}: neznámý cíl ${choice.next}`);
    }
  }
}

console.log(`Story data OK: ${Object.keys(QUESTS).length} questy, ${Object.keys(DIALOGUES).length} dialogové stromy.`);
