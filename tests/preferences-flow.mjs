import assert from "node:assert/strict";
import { PreferencesManager } from "../src/core/PreferencesManager.js";

const storage = new Map();
const fakeStorage = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
const classes = new Set();
const styles = new Map();
const root = {
  classList: { toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); } },
  style: { setProperty(name, value) { styles.set(name, value); } },
  dataset: {},
};
const manager = new PreferencesManager({ storage: fakeStorage });
manager.setSetting("quality", "low");
manager.setSetting("highContrast", true);
manager.setSetting("crosshair", false);
manager.setSetting("touchOpacity", 0.55);
manager.apply(root);
assert.equal(manager.getRenderWidth(1200), 400);
assert.ok(classes.has("pref-high-contrast"));
assert.ok(classes.has("pref-hide-crosshair"));
assert.equal(styles.get("--touch-opacity"), "0.55");
assert.equal(root.dataset.quality, "low");
const restored = new PreferencesManager({ storage: fakeStorage });
assert.equal(restored.getSettings().highContrast, true);
assert.equal(restored.getSettings().touchOpacity, 0.55);
console.log("Preferences OK: výkon, kontrast, kříž, dotyková viditelnost a persistence.");
