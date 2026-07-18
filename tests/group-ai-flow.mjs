import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World();
const west = world.entities.find((entity) => entity.id === "echo-hound-west");
const mate = world.entities.find((entity) => entity.id === "echo-hound-packmate");
const east = world.entities.find((entity) => entity.id === "echo-hound-east");
world.player.x = west.x;
world.player.y = west.y + 2.2;
for (let tick = 0; tick < 25; tick += 1) world.update(0.1);
assert.ok(world.combat.getEnemyState(west.id)?.alerted, "První honič nezískal aggro.");
assert.ok(world.combat.getEnemyState(mate.id)?.alerted, "Poplach se nepřenesl na člena smečky.");
assert.ok(world.combat.getEnemyState(east.id)?.alerted, "Skupinový poplach nedosáhl vzdálenějšího člena.");
assert.ok(world.combat.getEnemyBrain(west.id)?.frenzyTimer > 0 || world.combat.getEnemyBrain(mate.id)?.frenzyTimer > 0, "Smečka nepoužila skupinový řev.");
console.log("Group AI OK: sdílený poplach, koordinace skupiny a smečkový buff.");
