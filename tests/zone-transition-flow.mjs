import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World("willowVale");
world.addItem("eliras-seal", 1, "Eliřina pečeť");
const exit = world.entities.find((entity) => entity.id === "willow-east-road");
assert.ok(exit, "Ve Vrbovém údolí chybí přechod do průsmyku.");

world.flags["persistent:test"] = true;
const result = world.useTransition(exit);
assert.equal(result.ok, true, "Přechod do průsmyku selhal.");
assert.equal(world.zoneId, "silverPass");
assert.equal(world.quests.getStatus("beneathGate"), "active", "Při vstupu do průsmyku se nespustil dungeon quest.");

const passExit = world.entities.find((entity) => entity.id === "pass-to-vale");
assert.ok(passExit);
world.useTransition(passExit);
assert.equal(world.zoneId, "willowVale");
assert.equal(world.flags["persistent:test"], true, "Globální příznak se po přechodu ztratil.");

const snapshot = world.snapshot();
const restored = new World("willowVale");
restored.restore(snapshot);
assert.equal(restored.zoneId, "willowVale");
assert.ok(restored.zoneEntityStates.silverPass, "Stav navštívené oblasti se neuložil.");

console.log("Zone transition OK: 3D svět přepíná oblasti a zachovává jejich stav.");
