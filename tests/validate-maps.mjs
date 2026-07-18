import assert from "node:assert/strict";
import { ZONES } from "../src/world/maps.js";

function isEntityFloor(zone, x, y) {
  return Number(zone.map[y]?.[x] ?? 1) === 0;
}

function buildEventuallyOpenTiles(zone) {
  const open = new Set();
  for (const entity of zone.entities) {
    const interaction = entity.interaction;
    if (["door", "secret"].includes(interaction?.type)) open.add(`${interaction.tileX},${interaction.tileY}`);
    if (interaction?.type === "lever") {
      for (const target of interaction.targets || []) if (Number(target.tile) === 0) open.add(`${target.tileX},${target.tileY}`);
    }
  }
  return open;
}

function isWalkable(zone, x, y, eventuallyOpen) {
  if (eventuallyOpen.has(`${x},${y}`)) return true;
  return Number(zone.map[y]?.[x] ?? 1) === 0;
}

function reachableTiles(zone) {
  const startX = Math.floor(zone.start.x);
  const startY = Math.floor(zone.start.y);
  const eventuallyOpen = buildEventuallyOpenTiles(zone);
  assert.ok(isWalkable(zone, startX, startY, eventuallyOpen), `${zone.id}: start je ve zdi`);

  const queue = [[startX, startY]];
  const visited = new Set([`${startX},${startY}`]);
  const directions = [[1,0],[-1,0],[0,1],[0,-1]];

  while (queue.length) {
    const [x, y] = queue.shift();
    for (const [dx, dy] of directions) {
      const nextX = x + dx;
      const nextY = y + dy;
      const key = `${nextX},${nextY}`;
      if (visited.has(key) || !isWalkable(zone, nextX, nextY, eventuallyOpen)) continue;
      visited.add(key);
      queue.push([nextX, nextY]);
    }
  }
  return visited;
}

let zonesChecked = 0;
let entitiesChecked = 0;
let transitionsChecked = 0;

for (const [zoneId, zone] of Object.entries(ZONES)) {
  assert.equal(zone.id, zoneId, `${zoneId}: id oblasti neodpovídá klíči`);
  assert.ok(zone.map.length >= 8, `${zoneId}: mapa je příliš malá`);
  const width = zone.map[0].length;
  assert.ok(width >= 8, `${zoneId}: mapa je příliš úzká`);
  assert.ok(zone.map.every((row) => row.length === width), `${zoneId}: řádky mapy mají různé délky`);
  assert.ok(zone.map[0].split("").every((tile) => tile !== "0"), `${zoneId}: horní okraj není uzavřen`);
  assert.ok(zone.map.at(-1).split("").every((tile) => tile !== "0"), `${zoneId}: dolní okraj není uzavřen`);
  assert.ok(zone.map.every((row) => row[0] !== "0" && row.at(-1) !== "0"), `${zoneId}: boční okraj není uzavřen`);

  const reachable = reachableTiles(zone);
  const ids = new Set();
  for (const entity of zone.entities) {
    assert.ok(!ids.has(entity.id), `${zoneId}: duplicitní entita ${entity.id}`);
    ids.add(entity.id);
    const x = Math.floor(entity.x);
    const y = Math.floor(entity.y);
    assert.ok(isEntityFloor(zone, x, y), `${zoneId}/${entity.id}: entita je ve zdi`);
    assert.ok(reachable.has(`${x},${y}`), `${zoneId}/${entity.id}: entita není dosažitelná ani po otevření mechanismů`);
    if (entity.interaction?.type === "transition") {
      assert.ok(ZONES[entity.interaction.targetZone], `${zoneId}/${entity.id}: cílová oblast neexistuje`);
      transitionsChecked += 1;
    }
    entitiesChecked += 1;
  }
  for (const trap of zone.traps || []) {
    assert.ok(isEntityFloor(zone, trap.x, trap.y), `${zoneId}/${trap.id}: past není na podlaze`);
  }
  zonesChecked += 1;
}

assert.ok(transitionsChecked >= 4, "Chybí obousměrné přechody mezi oblastmi.");
console.log(`Map validation OK: ${zonesChecked} oblasti, ${entitiesChecked} entit, ${transitionsChecked} přechodů.`);
