import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World("willowVale");
const initial = world.clock;
assert.equal(initial.hour, 20);
assert.ok(world.daylight < 0.4, "Hra nezačíná v očekávaném večerním světle.");

world.environment.advanceMinutes(16 * 60);
assert.equal(world.clock.day, 2, "Kalendář nepřešel do dalšího dne.");
assert.equal(world.clock.hour, 12);
assert.ok(world.daylight > 0.9, "Polední osvětlení není dostatečně světlé.");

const beforeRest = world.environment.calendar.totalMinutes;
assert.equal(world.restParty().ok, true);
assert.equal(Math.round(world.environment.calendar.totalMinutes - beforeRest), 480, "Odpočinek neposunul čas o osm hodin.");

world.changeZone("echoCrypt", "entrance");
assert.ok(world.daylight <= 0.2, "Dungeon nemá stabilní podzemní osvětlení.");
const snapshot = world.snapshot();
const restored = new World("willowVale");
restored.restore(snapshot);
assert.equal(Math.floor(restored.environment.calendar.totalMinutes), Math.floor(world.environment.calendar.totalMinutes));

console.log("Time flow OK: denní cyklus, odpočinek, podzemní světlo a persistence.");
