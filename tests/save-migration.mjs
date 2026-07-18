import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const current = new World();
const legacy = current.snapshot();
delete legacy.inventoryState;
delete legacy.vendors;
legacy.inventory = {
  "silver-fragment": { id: "silver-fragment", name: "Krystalický střep", count: 1 },
  moonleaf: { id: "moonleaf", name: "Měsíčník", count: 2 },
};
legacy.entities = legacy.entities.filter((entity) => !["road-cache", "watch-armory-cache", "herbal-crate", "tomar-stall", "mira-stall"].includes(entity.id));

const migrated = new World();
migrated.restore(legacy);
assert.equal(migrated.getItemCount("silver-fragment"), 1);
assert.equal(migrated.getItemCount("moonleaf"), 2);
assert.equal(migrated.getItemCount("minor-healing-potion"), 4, "Migrace musí doplnit startovní předměty Milníku 04.");
assert.equal(migrated.inventoryManager.getEquipment("daren").mainHand, "iron-longsword");
assert.ok(migrated.entities.some((entity) => entity.id === "road-cache"), "Nové entity nesmí při migraci zmizet.");
assert.ok(migrated.getVendorView("tomar").wares.length > 0);

console.log("Save migration OK: inventář M03, nové vybavení, obchodníci a nové entity.");
