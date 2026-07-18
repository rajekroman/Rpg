import assert from "node:assert/strict";
import { resolveCampaignEnding } from "../src/data/endings.js";

const alliances = ["silverWatch", "freeCaravans", "obsidianArchive"];
const relics = ["destroy", "preserve", "claim"];
const ids = new Set();
for (const alliance of alliances) {
  for (const relic of relics) {
    const ending = resolveCampaignEnding({
      flags: { "campaign:finalAlliance": alliance, "campaign:relicChoice": relic },
      factions: { silverWatch: 2, freeCaravans: 2, obsidianArchive: 2, [alliance]: 7 },
    });
    assert.equal(ending.id, `${alliance}-${relic}`);
    assert.ok(ending.title.length > 8);
    assert.ok(ending.text.length > 80);
    assert.equal(ending.epilogue.length, 3);
    ids.add(ending.id);
  }
}
assert.equal(ids.size, 9, "Každá kombinace aliance a osudu relikviáře musí mít vlastní epilog.");
console.log("Ending variants OK: 9 unikátních kombinací epilogu.");
