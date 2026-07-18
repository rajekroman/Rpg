import assert from "node:assert/strict";

function gradient() {
  return { addColorStop() {} };
}

function makeContext() {
  const target = {
    createLinearGradient: gradient,
    createRadialGradient: gradient,
    measureText: () => ({ width: 10 }),
  };
  return new Proxy(target, {
    get(object, property) {
      if (property in object) return object[property];
      return () => {};
    },
    set(object, property, value) {
      object[property] = value;
      return true;
    },
  });
}

function makeCanvas(width = 640, height = 360) {
  const context = makeContext();
  return {
    width,
    height,
    getContext() { return context; },
  };
}

globalThis.document = {
  createElement(tag) {
    assert.equal(tag, "canvas");
    return makeCanvas(64, 64);
  },
};

const { Raycaster } = await import("../src/render/Raycaster.js");
const { World } = await import("../src/world/World.js");

const canvas = makeCanvas();
const renderer = new Raycaster(canvas);
const world = new World("willowVale");
renderer.render(world, 0);
world.changeZone("silverPass", "fromVale");
renderer.render(world, 0);
world.changeZone("echoCrypt", "entrance");
renderer.render(world, 0);

const entryDoor = world.entities.find((entity) => entity.id === "crypt-entry-door");
world.useDoor(entryDoor);
renderer.render(world, 0);
assert.equal(renderer.zBuffer.length, canvas.width);

console.log("Renderer smoke OK: všechny tři oblasti a dynamická mapa se vykreslí bez runtime výjimky.");
