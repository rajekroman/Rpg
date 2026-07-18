import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { AUDIO_MANIFEST, AUDIO_COUNTS } from "../src/data/audio.js";

const root = fileURLToPath(new URL("../assets/audio/", import.meta.url));
async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(full));
    else output.push(full);
  }
  return output;
}

const index = JSON.parse(await readFile(path.join(root, "audio-index.json"), "utf8"));
const files = (await walk(root)).filter((file) => file.endsWith(".mp3"));
assert.equal(files.length, AUDIO_COUNTS.music + AUDIO_COUNTS.ambience + AUDIO_COUNTS.sfx);
assert.equal(Object.keys(AUDIO_MANIFEST).length, files.length);
assert.equal(Object.keys(index).length, files.length);
let totalBytes = 0;
for (const [id, url] of Object.entries(AUDIO_MANIFEST)) {
  const file = fileURLToPath(url);
  const relative = path.relative(root, file).split(path.sep).join("/");
  const metadata = index[relative];
  assert.ok(metadata, `Chybí audio index pro ${relative}`);
  const data = await readFile(file);
  assert.ok(data.slice(0, 3).toString("ascii") === "ID3" || (data[0] === 0xff && (data[1] & 0xe0) === 0xe0), `${id} není MP3.`);
  assert.equal(metadata.codec, "mp3");
  assert.equal(metadata.sampleRate, 22050);
  assert.ok([1, 2].includes(metadata.channels));
  assert.equal(metadata.bytes, (await stat(file)).size);
  assert.equal(metadata.sha256, createHash("sha256").update(data).digest("hex"));
  totalBytes += metadata.bytes;
  if (id.startsWith("music:")) assert.ok(metadata.duration >= 20, `${id} musí být plnohodnotná smyčka.`);
  if (id.startsWith("ambience:")) assert.ok(metadata.duration >= 10, `${id} musí být dlouhá ambientní smyčka.`);
  if (id.startsWith("sfx:")) assert.ok(metadata.duration < 5, `${id} musí být krátký sample.`);
}
assert.ok(totalBytes < 4 * 1024 * 1024, "Komprimovaná zvuková banka překročila 4 MiB.");
console.log(`Audio validation OK: ${AUDIO_COUNTS.music} hudebních témat, ${AUDIO_COUNTS.ambience} ambienty, ${AUDIO_COUNTS.sfx} samply, ${(totalBytes / 1024 / 1024).toFixed(1)} MiB MP3.`);
