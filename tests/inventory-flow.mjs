import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World();
const initial = world.getInventoryView();
assert.equal(initial.items.find((entry) => entry.itemId === "minor-healing-potion")?.count, 4);
assert.equal(world.inventoryManager.getEquipment("daren").mainHand, "iron-longsword");
assert.equal(world.inventoryManager.getEquipment("lyra").mainHand, "ashwood-bow");
assert.ok(initial.weight > 0 && initial.capacity > initial.weight);

const attackBefore = world.partyManager.getDerivedStats("daren").attack;
assert.equal(world.addItem("silver-watch-blade", 1).ok, true);
assert.equal(world.equipItem("daren", "silver-watch-blade").ok, true);
assert.equal(world.inventoryManager.getEquipment("daren").mainHand, "silver-watch-blade");
assert.equal(world.getItemCount("iron-longsword"), 1, "Původní meč se musí vrátit do batohu.");
assert.ok(world.partyManager.getDerivedStats("daren").attack > attackBefore, "Vzácná čepel musí zvýšit útok.");

assert.equal(world.addItem("ashwood-bow", 1).ok, true);
assert.equal(world.equipItem("lyra", "ashwood-bow").ok, true);
assert.equal(world.inventoryManager.getEquipment("lyra").offHand, null, "Dvoruční luk musí blokovat vedlejší ruku.");
assert.equal(world.unequipItem("lyra", "mainHand").ok, true);
assert.equal(world.inventoryManager.getEquipment("lyra").mainHand, null);

const daren = world.partyManager.getMember("daren");
world.partyManager.applyDamage("daren", 30);
const hpBefore = daren.hp;
assert.equal(world.useItem("minor-healing-potion", "daren").ok, true);
assert.ok(daren.hp > hpBefore, "Léčivý lektvar musí obnovit životy.");
assert.equal(world.getItemCount("minor-healing-potion"), 3);

const rationCount = world.getItemCount("travel-ration");
assert.equal(world.restParty().ok, true);
assert.equal(world.getItemCount("travel-ration"), rationCount - 1, "Odpočinek musí spotřebovat dávku.");

const snapshot = world.snapshot();
const restored = new World();
restored.restore(snapshot);
assert.deepEqual(restored.inventoryManager.snapshot(), world.inventoryManager.snapshot());
assert.equal(restored.partyManager.getDerivedStats("daren").attack, world.partyManager.getDerivedStats("daren").attack);
assert.deepEqual(restored.inventory, world.inventory);

console.log("Inventory flow OK: startovní výbava, equip/unequip, bonusy, lektvary, odpočinek a snapshot.");
