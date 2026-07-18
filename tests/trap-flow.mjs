import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World("echoCrypt");
const trapEntity = world.entities.find((entity) => entity.id === "crypt-trap-darts");
world.player.x = 4.5;
world.player.y = 17.5;
world.environment.update(0.4, world);
assert.equal(world.environment.isTrapAvailable(trapEntity, world), true, "Past nebyla odhalena Vnímáním 3.");
assert.equal(world.disarmTrap(trapEntity).ok, true, "Odhalenou past se nepodařilo zneškodnit.");
assert.equal(world.flags["trap:crypt-darts:disarmed"], true);

const rune = world.entities.find((entity) => entity.id === "crypt-trap-rune");
const hpBefore = world.party.reduce((sum, member) => sum + member.hp, 0);
world.player.x = 12.5;
world.player.y = 12.5;
world.environment.handlePlayerPosition(world);
const hpAfter = world.party.reduce((sum, member) => sum + member.hp, 0);
assert.ok(hpAfter < hpBefore, "Runa bolesti nezpůsobila družině poškození.");
const runeState = world.environment.traps["echoCrypt:crypt-rune"];
assert.equal(runeState.triggered, true);
assert.equal(world.environment.isTrapAvailable(rune, world), false, "Jednorázová spuštěná past zůstala aktivní.");

const restored = new World("echoCrypt");
restored.restore(world.snapshot());
assert.equal(restored.environment.traps["echoCrypt:crypt-darts"].disarmed, true);
assert.equal(restored.environment.traps["echoCrypt:crypt-rune"].triggered, true);

console.log("Trap flow OK: detekce, zneškodnění, spuštění, poškození a uložení.");
