import assert from "node:assert/strict";
import { SaveManager } from "../src/core/SaveManager.js";

const storage = new Map();
globalThis.localStorage = {
  getItem(key) { return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { storage.set(key, value); },
  removeItem(key) { storage.delete(key); },
};

const legacySnapshot = { version: 11, zoneId: "willowVale", marker: "m11" };
storage.set("kroniky-stribrne-brany-m11-save", JSON.stringify({ version: 11, snapshot: legacySnapshot }));
const manager = new SaveManager();
assert.equal(manager.hasSave(), true);
assert.deepEqual(manager.load(), legacySnapshot, "Release 1.0 musí načíst pozici M11.");

const currentSnapshot = { version: 12, zoneId: "hollowThrone", marker: "m12" };
assert.equal(manager.save(currentSnapshot), true);
const payload = JSON.parse(storage.get("kroniky-stribrne-brany-m12-save"));
assert.equal(payload.version, 12);
assert.equal(typeof payload.checksum, "string");
assert.deepEqual(payload.snapshot, currentSnapshot);

console.log("Save version OK: zápis v12, checksum a migrace uložené pozice M11.");
