import assert from "node:assert/strict";
import { World } from "../src/world/World.js";
import { Pathfinder } from "../src/systems/Pathfinder.js";

const world = new World();
const pathfinder = new Pathfinder(900);
const path = pathfinder.findPath(world, 3.5, 19.5, 20.5, 2.5, 0.24);
assert.ok(path.length > 10, "Navigace nenašla cestu přes oblast.");
for (const waypoint of path) assert.equal(world.isWall(waypoint.x, waypoint.y), false, `Waypoint je ve zdi: ${waypoint.x},${waypoint.y}`);
const last = path.at(-1);
assert.ok(Math.hypot(last.x - 20.5, last.y - 2.5) < 0.8, "Cesta nekončí u cíle.");
console.log(`Pathfinding OK: A* našel průchozí trasu o ${path.length} bodech.`);
