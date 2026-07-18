import assert from "node:assert/strict";
import { CLASSES } from "../src/data/classes.js";
import { EQUIPMENT_SLOTS, ITEMS, RARITIES, STARTER_BACKPACK, STARTER_LOADOUT } from "../src/data/items.js";
import { LOOT_TABLES } from "../src/data/lootTables.js";
import { VENDORS } from "../src/data/vendors.js";

assert.ok(Object.keys(ITEMS).length >= 30, "Milník 04 musí obsahovat alespoň 30 definic předmětů.");
for (const [itemId, item] of Object.entries(ITEMS)) {
  assert.equal(item.id, itemId, `ID předmětu ${itemId} nesouhlasí.`);
  assert.ok(item.name && item.description, `${itemId} nemá název nebo popis.`);
  assert.ok(RARITIES[item.rarity], `${itemId} používá neznámou vzácnost.`);
  assert.ok(Number.isFinite(item.value) && item.value >= 0, `${itemId} má neplatnou hodnotu.`);
  assert.ok(Number.isFinite(item.weight) && item.weight >= 0, `${itemId} má neplatnou hmotnost.`);
  assert.ok(Number.isInteger(item.stackLimit) && item.stackLimit >= 1, `${itemId} má neplatný limit stohu.`);
  if (item.slot) assert.ok(EQUIPMENT_SLOTS[item.slot], `${itemId} používá neznámý slot.`);
  for (const classId of item.allowedClasses || []) assert.ok(CLASSES[classId], `${itemId} povoluje neznámou třídu ${classId}.`);
}

for (const [memberId, slots] of Object.entries(STARTER_LOADOUT)) {
  assert.ok(Object.keys(slots).length >= 2, `${memberId} nemá skutečnou počáteční výbavu.`);
  for (const [slotId, itemId] of Object.entries(slots)) {
    assert.equal(ITEMS[itemId]?.slot, slotId, `${memberId}: ${itemId} nepatří do slotu ${slotId}.`);
  }
}
for (const [itemId, count] of Object.entries(STARTER_BACKPACK)) {
  assert.ok(ITEMS[itemId], `Startovní batoh obsahuje neznámý předmět ${itemId}.`);
  assert.ok(count > 0 && count <= ITEMS[itemId].stackLimit);
}
for (const table of Object.values(LOOT_TABLES)) {
  assert.ok(table.rolls > 0 && table.entries.length > 0, `${table.id} je prázdná loot tabulka.`);
  for (const entry of table.entries) assert.ok(ITEMS[entry.itemId], `${table.id} odkazuje na ${entry.itemId}.`);
}
for (const vendor of Object.values(VENDORS)) {
  for (const itemId of Object.keys(vendor.stock)) assert.ok(ITEMS[itemId], `${vendor.id} prodává neznámý předmět ${itemId}.`);
}

console.log(`Item data OK: ${Object.keys(ITEMS).length} předmětů, ${Object.keys(LOOT_TABLES).length} loot tabulky, ${Object.keys(VENDORS).length} obchodníci.`);
