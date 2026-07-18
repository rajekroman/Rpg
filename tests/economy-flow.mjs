import assert from "node:assert/strict";
import { World } from "../src/world/World.js";

const world = new World();
world.gold = 500;
const initialStock = world.vendorManager.getStock("tomar", "minor-healing-potion");
const initialPotions = world.getItemCount("minor-healing-potion");
const price = world.vendorManager.getBuyPrice("tomar", "minor-healing-potion", world.partyManager, world.reputation);
const buy = world.buyItem("tomar", "minor-healing-potion");
assert.equal(buy.ok, true);
assert.equal(buy.total, price);
assert.equal(world.gold, 500 - price);
assert.equal(world.getItemCount("minor-healing-potion"), initialPotions + 1);
assert.equal(world.vendorManager.getStock("tomar", "minor-healing-potion"), initialStock - 1);

assert.equal(world.addItem("old-silver-brooch", 1).ok, true);
const beforeSale = world.gold;
const sellPrice = world.vendorManager.getSellPrice("tomar", "old-silver-brooch", world.partyManager, world.reputation);
const sale = world.sellItem("tomar", "old-silver-brooch");
assert.equal(sale.ok, true);
assert.equal(world.gold, beforeSale + sellPrice);
assert.equal(world.getItemCount("old-silver-brooch"), 0);

const baselinePrice = world.vendorManager.getBuyPrice("mira", "greater-healing-potion", world.partyManager, 0);
world.partyManager.getMember("saela").skills.diplomacy = 9;
const diplomacyPrice = world.vendorManager.getBuyPrice("mira", "greater-healing-potion", world.partyManager, 20);
assert.ok(diplomacyPrice < baselinePrice, "Diplomacie a pověst musí zlepšit nákupní cenu.");

const snapshot = world.snapshot();
const restored = new World();
restored.restore(snapshot);
assert.equal(restored.vendorManager.getStock("tomar", "minor-healing-potion"), initialStock - 1);

console.log("Economy flow OK: nákup, prodej, zásoby, diplomacie, pověst a save/restore.");
