import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = { getItem: (k) => store.get(k) || null, setItem: (k, v) => store.set(k, v) };
let starts = 0, stops = 0;
class Param { constructor(value = 1) { this.value = value; } setTargetAtTime(v) { this.value = v; } setValueAtTime(v) { this.value = v; } exponentialRampToValueAtTime(v) { this.value = v; } cancelScheduledValues() {} }
class Node { constructor() { this.gain = new Param(1); this.pan = new Param(0); } connect() { return this; } }
class Source extends Node { constructor() { super(); this.playbackRate = new Param(1); this.loop = false; } start() { starts++; } stop() { stops++; } }
class FakeContext {
  constructor() { this.currentTime = 1; this.state = "suspended"; this.destination = new Node(); }
  createGain() { return new Node(); }
  createDynamicsCompressor() { const n = new Node(); n.threshold = new Param(); n.knee = new Param(); n.ratio = new Param(); n.attack = new Param(); n.release = new Param(); return n; }
  createBufferSource() { return new Source(); }
  createStereoPanner() { return new Node(); }
  async decodeAudioData() { return { duration: 1 }; }
  async resume() { this.state = "running"; }
}
globalThis.AudioContext = FakeContext;
globalThis.fetch = async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(64) });
const { AudioManager } = await import("../src/core/AudioManager.js");
const audio = new AudioManager({ manifest: { "music:menu": "menu.wav", "music:valeDay": "vale.wav", "ambience:forest": "forest.wav", "sfx:ui-click": "click.wav", "sfx:step-grass-1": "step.wav", "sfx:weapon-sword": "sword.wav" } });
const loaded = await audio.loadAll(); assert.equal(loaded.loaded, 6);
const unlocked = await audio.unlock(); assert.equal(unlocked.ok, true); assert.equal(unlocked.decoded, 6);
audio.setScene({ zoneId: "willowVale" }); audio.playUi(); audio.playStep("grass"); audio.playAttack("melee", false, "sword");
audio.setSetting("music", 0.35); assert.equal(audio.getSettings().music, 0.35);
audio.setSetting("master", 5); assert.equal(audio.getSettings().master, 1);
assert.ok(starts >= 5, "Musí začít menu, nová scéna a tři samply."); assert.ok(stops >= 1, "Přechod scény musí zastavit předchozí smyčku.");
console.log("Audio manager OK: preload, decode, busy, crossfade, samply a nastavení.");
