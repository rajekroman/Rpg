import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World("echoCrypt");
world.startQuest("beneathGate");
world.emitQuestEvent("enterZone", "echoCrypt", 1);
assert.equal(world.quests.getState("beneathGate").stageIndex, 1);

const entryDoor = world.entities.find((entity) => entity.id === "crypt-entry-door");
assert.equal(world.getTile(4, 18), 2);
assert.equal(world.useDoor(entryDoor).ok, true);
assert.equal(world.getTile(4, 18), 0, "Vstupní dveře nezměnily dynamickou mapovou dlaždici.");

const lockedDoor = world.entities.find((entity) => entity.id === "crypt-warden-door");
assert.equal(world.useDoor(lockedDoor).ok, false, "Uzamčené dveře se otevřely bez klíče.");
world.addItem("crypt-warden-key", 1, "Klíč správce krypty");
assert.equal(world.useDoor(lockedDoor).ok, true, "Klíč neodemkl dveře správce.");
assert.equal(world.getTile(8, 15), 0);

const lever = world.entities.find((entity) => entity.id === "crypt-lever");
assert.equal(world.getTile(13, 7), 2);
assert.equal(world.useLever(lever).ok, true);
assert.equal(world.getTile(13, 7), 0, "Páka neotevřela rezonanční bránu.");
assert.equal(world.quests.getState("beneathGate").stageIndex, 2);

const secret = world.entities.find((entity) => entity.id === "crypt-secret-wall");
world.player.x = 16.2;
world.player.y = 4.5;
world.environment.update(0.4, world);
assert.equal(secret.discovered, true, "Vnímání družiny neodhalilo tajnou stěnu.");
assert.equal(world.useSecret(secret).ok, true);
assert.equal(world.getTile(17, 4), 0, "Tajná stěna se neotevřela.");

const altar = world.entities.find((entity) => entity.id === "crypt-altar");
assert.equal(world.inspectEntity(altar), true);
assert.equal(world.quests.getStatus("beneathGate"), "completed", "Dungeon quest se po prozkoumání oltáře nedokončil.");
assert.equal(world.getItemCount("mirror-silver"), 1, "Chybí questová odměna Zrcadlové stříbro.");

const snapshot = world.snapshot();
const restored = new World("willowVale");
restored.restore(snapshot);
assert.equal(restored.zoneId, "echoCrypt");
assert.equal(restored.getTile(4, 18), 0);
assert.equal(restored.getTile(8, 15), 0);
assert.equal(restored.getTile(13, 7), 0);
assert.equal(restored.getTile(17, 4), 0);

console.log("Dungeon flow OK: dveře, klíč, páka, tajná stěna, quest a persistence.");
