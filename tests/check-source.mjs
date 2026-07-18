import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (entry.name.endsWith(".js")) files.push(fullPath);
  }
  return files;
}

const files = await walk(new URL("../src", import.meta.url).pathname);
assert.ok(files.length >= 8, "Projekt nemá očekávanou modulární strukturu.");

for (const file of files) {
  const source = await readFile(file, "utf8");
  assert.ok(!source.includes("eval("), `${file}: eval není povolen`);
  assert.ok(!source.includes("innerHTML +="), `${file}: nekontrolované přidávání HTML není povoleno`);
  assert.ok(source.trim().length > 0, `${file}: prázdný zdrojový soubor`);
}

console.log(`Source validation OK: ${files.length} JavaScript modulů.`);
