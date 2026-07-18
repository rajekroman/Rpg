import assert from "node:assert/strict";
import { PartyManager, experienceForLevel } from "../src/systems/PartyManager.js";

const party = new PartyManager();
assert.equal(party.members.length, 4);
assert.equal(party.activeMember.id, "daren");
assert.equal(experienceForLevel(2), 100);
assert.ok(experienceForLevel(3) > experienceForLevel(2));

for (const member of party.members) {
  assert.equal(member.level, 1);
  assert.ok(member.maxHp > 0);
  assert.ok(member.maxMp >= 0);
  assert.equal(member.hp, member.maxHp);
  assert.equal(member.mp, member.maxMp);
  assert.equal(member.condition, "healthy");
}

const levelTwo = party.awardExperience(180);
assert.equal(levelTwo.filter((entry) => entry.type === "levelUp").length, 4, "Každý člen měl postoupit na úroveň 2.");
for (const member of party.members) {
  assert.equal(member.level, 2);
  assert.equal(member.attributePoints, 3);
  assert.equal(member.skillPoints, 2);
}

party.awardExperience(155);
for (const member of party.members) {
  assert.equal(member.level, 3, `${member.name} měl dosáhnout úrovně 3.`);
  assert.equal(member.attributePoints, 6);
  assert.equal(member.skillPoints, 4);
}

const darenBefore = party.getMemberView("daren");
const enduranceBefore = darenBefore.member.attributes.endurance;
const hpBefore = darenBefore.member.maxHp;
const attributeResult = party.spendAttributePoint("daren", "endurance");
assert.equal(attributeResult.ok, true);
const darenAfterAttribute = party.getMemberView("daren");
assert.equal(darenAfterAttribute.member.attributes.endurance, enduranceBefore + 1);
assert.ok(darenAfterAttribute.member.maxHp > hpBefore, "Odolnost musí zvýšit maximální životy.");
assert.equal(darenAfterAttribute.member.attributePoints, 5);

const bladeBefore = darenAfterAttribute.member.skills.blade;
const attackBefore = darenAfterAttribute.derived.attack;
const skillResult = party.trainSkill("daren", "blade");
assert.equal(skillResult.ok, true);
const darenAfterSkill = party.getMemberView("daren");
assert.equal(darenAfterSkill.member.skills.blade, bladeBefore + 1);
assert.ok(darenAfterSkill.derived.attack > attackBefore, "Výcvik čepele musí zvýšit útok.");
assert.equal(darenAfterSkill.member.skillPoints, 3);

party.applyDamage("lyra", party.getMember("lyra").maxHp);
assert.equal(party.getMember("lyra").condition, "unconscious");
party.heal("lyra", 10);
assert.notEqual(party.getMember("lyra").condition, "unconscious");
party.applyDamage("orin", party.getMember("orin").hp + party.getMember("orin").maxHp);
assert.equal(party.getMember("orin").condition, "dead");
assert.equal(party.heal("orin", 999), false, "Běžné léčení nesmí oživit mrtvou postavu.");

party.selectMember("saela");
const snapshot = party.snapshot();
const restored = new PartyManager(snapshot);
assert.deepEqual(restored.snapshot(), snapshot, "Snapshot družiny se neobnovil beze ztráty.");
assert.equal(restored.activeMember.id, "saela");

console.log("Party progression OK: úrovně 1–3, body, atributy, dovednosti, stavy a snapshot.");
