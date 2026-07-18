import assert from "node:assert/strict";
import { ATTRIBUTES, CLASSES, RESISTANCE_NAMES } from "../src/data/classes.js";
import { PARTY_SEEDS } from "../src/data/party.js";
import { SKILLS } from "../src/data/skills.js";

assert.equal(PARTY_SEEDS.length, 4, "Hra musí mít čtyři členy družiny.");
assert.equal(new Set(PARTY_SEEDS.map((member) => member.id)).size, PARTY_SEEDS.length, "ID členů družiny nejsou unikátní.");

for (const seed of PARTY_SEEDS) {
  const classDefinition = CLASSES[seed.classId];
  assert.ok(classDefinition, `${seed.id}: neznámá třída ${seed.classId}`);
  assert.ok(seed.biography.length >= 60, `${seed.id}: chybí použitelná biografie`);
  for (const attributeId of Object.keys(ATTRIBUTES)) {
    assert.ok(Number.isInteger(seed.attributes[attributeId]), `${seed.id}: chybí atribut ${attributeId}`);
  }
  for (const resistanceId of Object.keys(RESISTANCE_NAMES)) {
    assert.ok(Number.isInteger(seed.resistances[resistanceId]), `${seed.id}: chybí odolnost ${resistanceId}`);
  }
  for (const [skillId, rank] of Object.entries(seed.skills)) {
    assert.ok(SKILLS[skillId], `${seed.id}: neznámá dovednost ${skillId}`);
    assert.ok(classDefinition.skillCaps[skillId] >= rank, `${seed.id}: počáteční hodnost ${skillId} překračuje třídní limit`);
  }
  for (const [skillId, cap] of Object.entries(classDefinition.skillCaps)) {
    assert.ok(SKILLS[skillId], `${classDefinition.id}: neznámá dovednost ${skillId}`);
    assert.ok(Number.isInteger(cap) && cap >= 1 && cap <= 10, `${classDefinition.id}: neplatný limit ${skillId}`);
  }
}

console.log(`Character data OK: ${PARTY_SEEDS.length} hrdinové, ${Object.keys(CLASSES).length} třídy, ${Object.keys(SKILLS).length} dovedností.`);
