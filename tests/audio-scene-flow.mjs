import assert from "node:assert/strict";
import { resolveSceneAudio, ENEMY_AUDIO_ARCHETYPE } from "../src/data/audio.js";

assert.deepEqual(resolveSceneAudio({ screen: "menu" }), { musicId: "menu", ambienceId: null });
assert.deepEqual(resolveSceneAudio({ zoneId: "willowVale", isNight: false }), { musicId: "valeDay", ambienceId: "forest" });
assert.deepEqual(resolveSceneAudio({ zoneId: "willowVale", isNight: true }), { musicId: "valeNight", ambienceId: "forest" });
assert.deepEqual(resolveSceneAudio({ zoneId: "silverPass", isNight: false }), { musicId: "passDay", ambienceId: "mountainWind" });
assert.deepEqual(resolveSceneAudio({ zoneId: "silverPass", isNight: true }), { musicId: "passNight", ambienceId: "mountainWind" });
assert.deepEqual(resolveSceneAudio({ zoneId: "echoCrypt" }), { musicId: "crypt", ambienceId: "cryptDepths" });
assert.equal(resolveSceneAudio({ zoneId: "echoCrypt", inCombat: true }).musicId, "combat");
assert.equal(resolveSceneAudio({ zoneId: "echoCrypt", inCombat: true, bossActive: true }).musicId, "boss");
assert.equal(ENEMY_AUDIO_ARCHETYPE.echoWarden, "boss");
console.log("Audio scene flow OK: menu, den/noc, tři oblasti, boj a boss.");
