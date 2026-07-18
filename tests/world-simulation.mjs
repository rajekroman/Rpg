import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World("willowVale");
const initialY = world.player.y;
for (let i = 0; i < 60; i += 1) {
  world.move({ forward: 1, strafe: 0, turn: 0 }, 1 / 60);
}
assert.ok(world.player.y < initialY - 1.5, "Hráč se nepohnul očekávaným směrem.");

world.player.x = 1.25;
world.player.y = 2.5;
world.player.direction = Math.PI;
for (let i = 0; i < 120; i += 1) {
  world.move({ forward: 1, strafe: 0, turn: 0 }, 1 / 60);
}
assert.ok(world.player.x >= 1.2, "Kolize dovolila hráči projít západním okrajem mapy.");

world.player.x = 6.5;
world.player.y = 19.7;
world.player.direction = -Math.PI / 2;
const sign = world.getInteractable();
assert.equal(sign?.id, "road-sign", "Detekce interakce nenalezla směrovník.");

world.flags["inspected:road-sign"] = true;
const snapshot = world.snapshot();
const restored = new World("willowVale");
restored.restore(snapshot);
assert.equal(restored.player.x, world.player.x, "Pozice X se neobnovila.");
assert.equal(restored.player.y, world.player.y, "Pozice Y se neobnovila.");
assert.equal(restored.flags["inspected:road-sign"], true, "Příznak světa se neobnovil.");

console.log("World simulation OK: pohyb, kolize, interakce a snapshot.");
