import assert from "node:assert/strict";
import { SaveManager } from "../src/core/SaveManager.js";

const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
};
const manager = new SaveManager();
const first = { zoneId: "willowVale", value: 1 };
const second = { zoneId: "silverHarbor", value: 2 };
assert.ok(manager.save(first));
assert.ok(manager.save(second));
assert.ok(storage.has("kroniky-stribrne-brany-m12-backup"));
storage.set("kroniky-stribrne-brany-m12-save", '{"version":12,"snapshot":{"broken":true},"checksum":"deadbeef"}');
assert.deepEqual(manager.load(), first, "Poškozený hlavní save se musí obnovit ze zálohy.");
storage.set("kroniky-stribrne-brany-m12-save", "{malformed");
assert.deepEqual(manager.load(), first, "Neplatný JSON se musí obnovit ze zálohy.");
const exported = JSON.stringify({ version: 11, snapshot: { zoneId: "crypt", imported: true } });
assert.ok(manager.importSave(exported));
assert.equal(manager.load().imported, true);
assert.ok(manager.exportSave().includes('"checksum"'));
console.log("Save recovery OK: rotační backup, kontrola integrity, import a export.");
