import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

function isolate(world, ids) {
  for (const entity of world.entities) if (entity.enemyId && !ids.includes(entity.id)) entity.hidden = true;
}

const poisonWorld = new World();
isolate(poisonWorld, ["mire-crawler-east"]);
const crawler = poisonWorld.entities.find((entity) => entity.id === "mire-crawler-east");
poisonWorld.player.x = crawler.x;
poisonWorld.player.y = crawler.y + 3.2;
for (let tick = 0; tick < 55; tick += 1) poisonWorld.update(0.1);
assert.ok(poisonWorld.party.some((member) => poisonWorld.magic.getPartyStatuses(member.id).some((status) => status.id === "poisoned")), "Jedový chrchel neaplikoval otravu.");

const raiderWorld = new World();
isolate(raiderWorld, ["ash-raider-south"]);
const raider = raiderWorld.entities.find((entity) => entity.id === "ash-raider-south");
raiderWorld.player.x = raider.x;
raiderWorld.player.y = raider.y - 4;
for (let tick = 0; tick < 55; tick += 1) raiderWorld.update(0.1);
assert.ok(raiderWorld.party.some((member) => raiderWorld.magic.getPartyStatuses(member.id).some((status) => status.id === "exposed")), "Potlačovací střela neaplikovala odhalenou obranu.");

const shieldWorld = new World();
isolate(shieldWorld, ["hollow-sentinel-warden", "echo-warden"]);
const sentinel = shieldWorld.entities.find((entity) => entity.id === "hollow-sentinel-warden");
const warden = shieldWorld.entities.find((entity) => entity.id === "echo-warden");
shieldWorld.combat.ensureEnemyState(warden).hp = 120;
shieldWorld.player.x = 20.5;
shieldWorld.player.y = 5.5;
for (let tick = 0; tick < 20; tick += 1) shieldWorld.update(0.1);
assert.ok(shieldWorld.combat.getEnemyBrain(sentinel.id)?.shieldAuraTimer > 0, "Dutý strážce nepoužil ochranný puls.");
console.log("Enemy abilities OK: otrava, odhalení obrany a ochranná aura podpory.");
