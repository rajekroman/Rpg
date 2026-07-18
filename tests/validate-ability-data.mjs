import assert from "node:assert/strict";
import { ABILITIES, CLASS_HOTBARS, STATUS_EFFECTS } from "../src/data/abilities.js";
import { CLASSES } from "../src/data/classes.js";
import { SKILLS } from "../src/data/skills.js";

assert.equal(Object.keys(ABILITIES).length, 16, "Milník 06 musí obsahovat 16 schopností.");
assert.ok(Object.keys(STATUS_EFFECTS).length >= 9);
for (const [id, ability] of Object.entries(ABILITIES)) {
  assert.equal(id, ability.id);
  assert.ok(CLASSES[ability.classId], `${id}: neplatná třída.`);
  assert.ok(ability.name && ability.description && ability.icon);
  assert.ok(Number.isFinite(ability.cooldown) && ability.cooldown >= 0);
  assert.ok(Number.isFinite(ability.manaCost) && ability.manaCost >= 0);
  assert.ok(Array.isArray(ability.effects) && ability.effects.length > 0);
  if (ability.requiredSkill) {
    assert.ok(SKILLS[ability.requiredSkill.id], `${id}: neplatná dovednost.`);
    assert.ok(CLASSES[ability.classId].skillCaps[ability.requiredSkill.id] >= ability.requiredSkill.rank, `${id}: požadavek přesahuje třídní strop.`);
  }
  for (const effect of ability.effects) {
    if (effect.statusId) assert.ok(STATUS_EFFECTS[effect.statusId], `${id}: neplatný stav ${effect.statusId}.`);
  }
}
for (const [classId, hotbar] of Object.entries(CLASS_HOTBARS)) {
  assert.ok(CLASSES[classId]);
  assert.equal(hotbar.length, 4);
  assert.equal(new Set(hotbar).size, hotbar.length);
  hotbar.forEach((abilityId) => assert.equal(ABILITIES[abilityId].classId, classId));
}
console.log(`Ability data OK: ${Object.keys(ABILITIES).length} schopností, ${Object.keys(STATUS_EFFECTS).length} stavů, 4 třídní lišty.`);
