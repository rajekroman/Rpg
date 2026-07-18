import assert from "node:assert/strict";
import { getDeathTransitionFrame, getEffectFrame, getEnemyFrame, getWorldFrame } from "../src/render/AnimationState.js";

const definition = { speed: 1 };
assert.equal(getEnemyFrame({ state: { dead: false, hitFlash: 0 }, brain: { mode: "idle", intent: "idle" }, definition, worldTime: 0 }), 0);
assert.ok(getEnemyFrame({ state: { dead: false, hitFlash: 0, alerted: true, cooldown: 0 }, brain: { mode: "combat", intent: "advance" }, definition, worldTime: 0.4 }) >= 4);
assert.ok(getEnemyFrame({ state: { dead: false, hitFlash: 0, alerted: true, cooldown: 1 }, brain: { mode: "combat", intent: "attack" }, definition, worldTime: 0.4 }) >= 8);
assert.equal(getEnemyFrame({ state: { dead: false, hitFlash: 0.1 }, brain: {}, definition, worldTime: 0 }), 10);
assert.equal(getEnemyFrame({ state: { dead: true, hitFlash: 0 }, brain: {}, definition, worldTime: 0 }), 11);
assert.equal(getDeathTransitionFrame({ dead: true, deathStartedAt: 10 }, 10.1), 10);
assert.equal(getDeathTransitionFrame({ dead: true, deathStartedAt: 10 }, 10.6), 11);
assert.equal(getDeathTransitionFrame({ dead: true, deathStartedAt: 10 }, 11), null);
assert.equal(getWorldFrame({ kind: "lever", interaction: { flag: "lever:on" } }, 2, { "lever:on": true }), 3);
assert.ok(getWorldFrame({ kind: "torch" }, 0.5, {}) >= 0);
assert.equal(getEffectFrame(0.9, 0.9), 0);
assert.equal(getEffectFrame(0.01, 0.9), 5);

console.log("Animation state OK: idle, pohyb, útok, zásah, smrt, mechanismy a efekty.");
