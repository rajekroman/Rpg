import * as THREE from "../../vendor/three.module.min.js";
import { getEnemyDefinition } from "../data/enemies.js";

const WORLD_SCALE = 1;
const EYE_HEIGHT = 1.62;
const WALL_HEIGHT = 2.7;
const textureCache = new Map();

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const hash2 = (x, y, seed = 0) => {
  let n = Math.imul(x + seed * 17, 374761393) ^ Math.imul(y - seed * 31, 668265263);
  n = (n ^ (n >>> 13)) >>> 0;
  return ((Math.imul(n, 1274126177) ^ (n >>> 16)) >>> 0) / 4294967295;
};

function canvasTexture(key, colors, options = {}) {
  if (textureCache.has(key)) return textureCache.get(key);
  const size = options.size || 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(size, size);
  const palette = colors.map((hex) => new THREE.Color(hex));
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const grain = hash2(x, y, options.seed || 0);
      const coarse = hash2(Math.floor(x / (options.coarse || 12)), Math.floor(y / (options.coarse || 12)), (options.seed || 0) + 4);
      const color = palette[Math.floor(coarse * palette.length) % palette.length].clone();
      const light = (grain - 0.5) * (options.grain || 0.12);
      color.offsetHSL(0, 0, light);
      image.data[index] = Math.round(color.r * 255);
      image.data[index + 1] = Math.round(color.g * 255);
      image.data[index + 2] = Math.round(color.b * 255);
      image.data[index + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);

  if (options.stone) {
    ctx.globalAlpha = 0.34;
    ctx.strokeStyle = "#11100f";
    ctx.lineWidth = 3;
    const rowH = 42;
    for (let y = 0; y <= size; y += rowH) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke();
      const offset = (Math.floor(y / rowH) % 2) * 34;
      for (let x = offset; x < size; x += 68) {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, Math.min(size, y + rowH)); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }
  if (options.wood) {
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = "#22150d";
    for (let x = 20; x < size; x += 38) {
      ctx.lineWidth = 2 + (x % 3);
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.bezierCurveTo(x - 7, size * .35, x + 9, size * .7, x - 2, size); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  if (options.grass) {
    ctx.globalAlpha = 0.45;
    for (let i = 0; i < 600; i += 1) {
      const x = hash2(i, 9, 3) * size;
      const y = hash2(i, 17, 8) * size;
      const h = 2 + hash2(i, 21, 2) * 7;
      ctx.strokeStyle = i % 3 === 0 ? "#829253" : "#263a22";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (i % 2 ? 1 : -1), y - h); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  if (options.runes) {
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = "#8f70df";
    ctx.shadowColor = "#6d4ed7";
    ctx.shadowBlur = 10;
    ctx.lineWidth = 3;
    for (let y = 26; y < size; y += 58) {
      for (let x = 28; x < size; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, y + 16); ctx.lineTo(x + 9, y); ctx.lineTo(x + 18, y + 16); ctx.moveTo(x + 4, y + 9); ctx.lineTo(x + 15, y + 9);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  textureCache.set(key, texture);
  return texture;
}

function material(key, colors, options = {}) {
  const map = canvasTexture(key, colors, options);
  map.repeat.set(options.repeatX || 1, options.repeatY || 1);
  return new THREE.MeshStandardMaterial({
    map,
    color: options.tint || 0xffffff,
    roughness: options.roughness ?? 0.88,
    metalness: options.metalness ?? 0.02,
    emissive: options.emissive || 0x000000,
    emissiveIntensity: options.emissiveIntensity || 0,
  });
}

function addPart(group, geometry, mat, position, scale = [1, 1, 1], rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function createHumanoid({ armor = 0x505963, cloth = 0x283243, skin = 0x8f654d, spectral = false, crown = false } = {}) {
  const group = new THREE.Group();
  const armorMat = new THREE.MeshStandardMaterial({ color: armor, roughness: .42, metalness: .6, emissive: spectral ? 0x263c66 : 0, emissiveIntensity: spectral ? 1.2 : 0 });
  const clothMat = new THREE.MeshStandardMaterial({ color: cloth, roughness: .9, transparent: spectral, opacity: spectral ? .82 : 1, emissive: spectral ? 0x111e46 : 0, emissiveIntensity: spectral ? .8 : 0 });
  const skinMat = new THREE.MeshStandardMaterial({ color: skin, roughness: .82 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: spectral ? 0x8be8ff : 0xffc36a });

  addPart(group, new THREE.CapsuleGeometry(.27, .58, 5, 10), clothMat, [0, .95, 0], [1.12, 1, .78]);
  addPart(group, new THREE.SphereGeometry(.22, 12, 8), skinMat, [0, 1.58, 0]);
  addPart(group, new THREE.CylinderGeometry(.34, .28, .4, 8), armorMat, [0, 1.27, 0]);
  addPart(group, new THREE.CapsuleGeometry(.095, .52, 4, 8), armorMat, [-.38, 1.16, 0], [1, 1, 1], [0, 0, -.18]);
  addPart(group, new THREE.CapsuleGeometry(.095, .52, 4, 8), armorMat, [.38, 1.16, 0], [1, 1, 1], [0, 0, .18]);
  addPart(group, new THREE.CapsuleGeometry(.11, .56, 4, 8), clothMat, [-.16, .36, 0]);
  addPart(group, new THREE.CapsuleGeometry(.11, .56, 4, 8), clothMat, [.16, .36, 0]);
  addPart(group, new THREE.SphereGeometry(.035, 8, 6), eyeMat, [-.075, 1.62, -.195]);
  addPart(group, new THREE.SphereGeometry(.035, 8, 6), eyeMat, [.075, 1.62, -.195]);
  if (crown) {
    for (let i = -2; i <= 2; i += 1) addPart(group, new THREE.ConeGeometry(.055, .26 + Math.abs(i) * .025, 5), armorMat, [i * .09, 1.89, 0], [1, 1, 1], [0, 0, i * .08]);
  }
  return group;
}

function createHound() {
  const group = new THREE.Group();
  const hide = new THREE.MeshStandardMaterial({ color: 0x303c48, roughness: .72, metalness: .08 });
  const mane = new THREE.MeshStandardMaterial({ color: 0x17202a, roughness: .95 });
  const glow = new THREE.MeshBasicMaterial({ color: 0x6ee7ff });
  addPart(group, new THREE.SphereGeometry(.46, 14, 9), hide, [0, .58, 0], [1.35, .76, .72]);
  addPart(group, new THREE.SphereGeometry(.29, 12, 8), mane, [0, .72, -.53], [1.05, .9, 1.1]);
  addPart(group, new THREE.ConeGeometry(.19, .55, 8), hide, [0, .64, -.82], [1, 1, 1], [Math.PI / 2, 0, 0]);
  for (const x of [-.27, .27]) {
    for (const z of [-.28, .29]) addPart(group, new THREE.CapsuleGeometry(.065, .42, 4, 7), hide, [x, .25, z], [1, 1, 1], [0, 0, x > 0 ? -.08 : .08]);
  }
  addPart(group, new THREE.ConeGeometry(.08, .31, 5), mane, [-.17, 1.04, -.55], [1, 1, 1], [-.24, 0, -.18]);
  addPart(group, new THREE.ConeGeometry(.08, .31, 5), mane, [.17, 1.04, -.55], [1, 1, 1], [-.24, 0, .18]);
  addPart(group, new THREE.SphereGeometry(.045, 8, 6), glow, [-.105, .8, -.78]);
  addPart(group, new THREE.SphereGeometry(.045, 8, 6), glow, [.105, .8, -.78]);
  group.scale.setScalar(.86);
  return group;
}

function createCrawler() {
  const group = new THREE.Group();
  const shell = new THREE.MeshStandardMaterial({ color: 0x4f5c2c, roughness: .52, metalness: .15 });
  const belly = new THREE.MeshStandardMaterial({ color: 0x202616, roughness: .9 });
  const glow = new THREE.MeshBasicMaterial({ color: 0xb6f15c });
  addPart(group, new THREE.SphereGeometry(.48, 12, 8), shell, [0, .42, .18], [1.15, .65, 1.3]);
  addPart(group, new THREE.SphereGeometry(.34, 12, 8), belly, [0, .39, -.44], [1.12, .8, .9]);
  for (let i = 0; i < 4; i += 1) {
    const z = -.35 + i * .25;
    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      addPart(leg, new THREE.CylinderGeometry(.04, .065, .62, 6), shell, [side * .36, .36, z], [1, 1, 1], [0, 0, side * .95]);
      addPart(leg, new THREE.CylinderGeometry(.025, .04, .52, 6), belly, [side * .68, .12, z], [1, 1, 1], [0, 0, side * .38]);
      group.add(leg);
    }
  }
  for (const x of [-.13, 0, .13]) addPart(group, new THREE.SphereGeometry(.035, 8, 6), glow, [x, .53, -.75]);
  return group;
}

function createRaider() {
  const group = createHumanoid({ armor: 0x5d4637, cloth: 0x2a1c17, skin: 0x7d5843 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x5d351b, roughness: .82 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x9d9385, roughness: .35, metalness: .72 });
  addPart(group, new THREE.TorusGeometry(.34, .035, 6, 18, Math.PI * 1.55), wood, [.48, 1.08, -.08], [1, 1, 1], [0, .2, Math.PI / 2]);
  addPart(group, new THREE.CylinderGeometry(.012, .012, .66, 5), metal, [.58, 1.08, -.07], [1, 1, 1], [0, 0, -.18]);
  return group;
}

function createSentinel() {
  const group = createHumanoid({ armor: 0x626a71, cloth: 0x20252a, spectral: true });
  group.scale.set(1.18, 1.22, 1.18);
  const metal = new THREE.MeshStandardMaterial({ color: 0x7f8995, roughness: .28, metalness: .82, emissive: 0x162542, emissiveIntensity: .6 });
  addPart(group, new THREE.BoxGeometry(.12, 1.42, .11), metal, [.56, 1.05, 0], [1, 1, 1], [0, 0, -.14]);
  addPart(group, new THREE.ConeGeometry(.16, .42, 4), metal, [.66, 1.8, 0], [1, 1, 1], [0, 0, -.14]);
  return group;
}

function createShade() {
  const group = new THREE.Group();
  const smoke = new THREE.MeshStandardMaterial({ color: 0x332457, roughness: .5, transparent: true, opacity: .68, emissive: 0x261346, emissiveIntensity: 1.25, side: THREE.DoubleSide });
  const glow = new THREE.MeshBasicMaterial({ color: 0xd6a6ff });
  addPart(group, new THREE.ConeGeometry(.42, 1.3, 14, 1, true), smoke, [0, .65, 0], [1, 1, 1], [0, 0, Math.PI]);
  addPart(group, new THREE.SphereGeometry(.25, 12, 8), smoke, [0, 1.4, 0]);
  addPart(group, new THREE.SphereGeometry(.04, 8, 6), glow, [-.08, 1.46, -.21]);
  addPart(group, new THREE.SphereGeometry(.04, 8, 6), glow, [.08, 1.46, -.21]);
  return group;
}

function createWarden(boss = false) {
  const group = createHumanoid({ armor: boss ? 0x292d3b : 0x414b5c, cloth: 0x171824, spectral: true, crown: boss });
  group.scale.setScalar(boss ? 1.55 : 1.28);
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0xb8d5df, emissive: 0x347b9d, emissiveIntensity: 1.5, roughness: .15, metalness: .85 });
  addPart(group, new THREE.BoxGeometry(.1, 1.55, .09), bladeMat, [.57, 1.15, -.08], [1, 1, 1], [0, 0, -.18]);
  addPart(group, new THREE.ConeGeometry(.16, .5, 4), bladeMat, [.72, 2.03, -.08], [1, 1, 1], [0, 0, -.18]);
  return group;
}

function createEnemyMesh(enemyId) {
  switch (enemyId) {
    case "echoHound": return createHound();
    case "mireCrawler": return createCrawler();
    case "ashRaider": return createRaider();
    case "hollowSentinel": return createSentinel();
    case "echoShade": return createShade();
    case "morKharr": return createWarden(true);
    default: return createWarden(false);
  }
}

function createTree(seed = 0) {
  const group = new THREE.Group();
  const trunk = new THREE.MeshStandardMaterial({ color: 0x4b3424, roughness: 1 });
  const leafA = new THREE.MeshStandardMaterial({ color: seed % 2 ? 0x294d2c : 0x315d35, roughness: .92 });
  addPart(group, new THREE.CylinderGeometry(.1, .16, 1.3, 7), trunk, [0, .65, 0]);
  addPart(group, new THREE.ConeGeometry(.65, 1.4, 9), leafA, [0, 1.45, 0]);
  addPart(group, new THREE.ConeGeometry(.52, 1.1, 9), leafA, [0, 2.05, 0]);
  group.scale.setScalar(.85 + (seed % 5) * .07);
  return group;
}

function createWorldObject(entity) {
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x5f3b22, roughness: .85 });
  const iron = new THREE.MeshStandardMaterial({ color: 0x555b61, roughness: .42, metalness: .65 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6d6b66, roughness: .92 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xb78a3a, roughness: .35, metalness: .72 });
  const glow = new THREE.MeshStandardMaterial({ color: 0x86d9ff, emissive: 0x2d8bbb, emissiveIntensity: 2.2, roughness: .2 });
  switch (entity.kind) {
    case "npc": return createHumanoid({ armor: 0x4f5965, cloth: 0x26364b, skin: 0x9a7058 });
    case "torch": {
      addPart(group, new THREE.CylinderGeometry(.035, .05, 1.1, 7), wood, [0, .55, 0]);
      const flame = addPart(group, new THREE.ConeGeometry(.11, .34, 8), glow, [0, 1.24, 0]);
      flame.userData.flame = true;
      const light = new THREE.PointLight(0xffa74a, 2.1, 7.5, 2);
      light.position.set(0, 1.35, 0);
      light.castShadow = false;
      light.userData.flameLight = true;
      group.add(light);
      return group;
    }
    case "chest": case "satchel": {
      addPart(group, new THREE.BoxGeometry(.75, .36, .48), wood, [0, .18, 0]);
      addPart(group, new THREE.CylinderGeometry(.24, .24, .75, 12, 1, false, 0, Math.PI), wood, [0, .39, 0], [1, 1, 1], [0, 0, Math.PI / 2]);
      addPart(group, new THREE.BoxGeometry(.1, .2, .04), gold, [0, .33, -.255]);
      return group;
    }
    case "crate": case "stall": {
      addPart(group, new THREE.BoxGeometry(.72, .72, .72), wood, [0, .36, 0]);
      addPart(group, new THREE.BoxGeometry(.06, .75, .75), iron, [0, .36, 0]);
      return group;
    }
    case "sign": {
      addPart(group, new THREE.CylinderGeometry(.04, .06, 1.25, 7), wood, [0, .62, 0]);
      addPart(group, new THREE.BoxGeometry(.92, .32, .08), wood, [0, 1.18, 0]);
      return group;
    }
    case "lever": case "mechanism": {
      addPart(group, new THREE.CylinderGeometry(.18, .24, .18, 8), stone, [0, .09, 0]);
      addPart(group, new THREE.CylinderGeometry(.035, .05, .68, 7), iron, [0, .48, 0], [1, 1, 1], [0, 0, -.42]);
      addPart(group, new THREE.SphereGeometry(.09, 8, 6), gold, [-.16, .78, 0]);
      return group;
    }
    case "obelisk": case "portal": {
      addPart(group, new THREE.CylinderGeometry(.22, .4, 1.65, 6), stone, [0, .82, 0]);
      addPart(group, new THREE.OctahedronGeometry(.18), glow, [0, 1.75, 0]);
      return group;
    }
    case "fragment": case "key": case "herb": {
      if (entity.kind === "herb") {
        for (let i = 0; i < 5; i += 1) addPart(group, new THREE.ConeGeometry(.05, .35, 5), new THREE.MeshStandardMaterial({ color: 0x4e8c4e, roughness: .9 }), [(i - 2) * .07, .18, 0], [1, 1, 1], [0, 0, (i - 2) * .18]);
      } else if (entity.kind === "key") {
        addPart(group, new THREE.TorusGeometry(.14, .035, 6, 14), gold, [0, .22, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
        addPart(group, new THREE.BoxGeometry(.06, .06, .38), gold, [0, .22, .26]);
      } else addPart(group, new THREE.OctahedronGeometry(.24), glow, [0, .32, 0]);
      return group;
    }
    case "trap": {
      addPart(group, new THREE.RingGeometry(.18, .42, 8), glow, [0, .012, 0], [1, 1, 1], [-Math.PI / 2, 0, 0]);
      return group;
    }
    default:
      addPart(group, new THREE.DodecahedronGeometry(.28), stone, [0, .28, 0]);
      return group;
  }
}

export class CinematicRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(68, 16 / 9, .05, 70);
    this.camera.rotation.order = "YXZ";
    this.scene.add(this.camera);
    this.clock = new THREE.Clock();
    this.zoneGroup = new THREE.Group();
    this.entityGroup = new THREE.Group();
    this.projectileGroup = new THREE.Group();
    this.scene.add(this.zoneGroup, this.entityGroup, this.projectileGroup);
    this.entityMeshes = new Map();
    this.projectileMeshes = new Map();
    this.zoneId = null;
    this.mapSignature = "";
    this.lastMapCheck = 0;
    this.weapon = this.#createWeapon();
    this.camera.add(this.weapon);
    this.#installLights();
  }

  setAssets() {}

  #installLights() {
    this.hemi = new THREE.HemisphereLight(0x9cc8ff, 0x29301f, 1.75);
    this.sun = new THREE.DirectionalLight(0xffe2b4, 2.4);
    this.sun.position.set(-8, 14, -5);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.camera.left = -18;
    this.sun.shadow.camera.right = 18;
    this.sun.shadow.camera.top = 18;
    this.sun.shadow.camera.bottom = -18;
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 44;
    this.scene.add(this.hemi, this.sun);
    this.ambient = new THREE.AmbientLight(0x40384f, .18);
    this.scene.add(this.ambient);
  }

  #createWeapon() {
    const group = new THREE.Group();
    const blade = new THREE.MeshStandardMaterial({ color: 0xcbd5da, roughness: .23, metalness: .88 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x241b16, roughness: .75 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xb28b3b, roughness: .36, metalness: .65 });
    addPart(group, new THREE.BoxGeometry(.075, .86, .035), blade, [0, .35, 0]);
    addPart(group, new THREE.ConeGeometry(.068, .25, 4), blade, [0, .9, 0]);
    addPart(group, new THREE.BoxGeometry(.4, .055, .075), gold, [0, -.1, 0]);
    addPart(group, new THREE.CylinderGeometry(.045, .055, .35, 8), dark, [0, -.29, 0]);
    addPart(group, new THREE.SphereGeometry(.075, 10, 8), gold, [0, -.5, 0]);
    group.position.set(.52, -.42, -.86);
    group.rotation.set(-.12, -.2, .16);
    group.scale.setScalar(.82);
    return group;
  }

  resize(width, height) {
    const w = Math.max(320, Math.floor(width));
    const h = Math.max(180, Math.floor(height));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  render(world) {
    const elapsed = world.time || this.clock.getElapsedTime();
    this.#updateEnvironment(world);
    this.#syncMap(world, elapsed);
    this.#syncEntities(world, elapsed);
    this.#syncProjectiles(world, elapsed);
    this.#updateCamera(world, elapsed);
    this.renderer.render(this.scene, this.camera);
  }

  #updateEnvironment(world) {
    const dungeon = world.zone.environment === "dungeon";
    const daylight = clamp(world.daylight ?? 1, .12, 1);
    const sky = new THREE.Color(world.zone.skyTop || (dungeon ? 0x0b0c12 : 0x6384a6));
    sky.multiplyScalar(dungeon ? .35 : .6 + daylight * .55);
    this.scene.background = sky;
    const fogColor = new THREE.Color(world.zone.fog || (dungeon ? 0x10121a : 0x667267));
    this.scene.fog = new THREE.FogExp2(fogColor, dungeon ? .095 : .025);
    this.hemi.intensity = dungeon ? .25 : .85 + daylight * 1.2;
    this.sun.intensity = dungeon ? .06 : .45 + daylight * 2.2;
    this.ambient.intensity = dungeon ? .32 : .12;
    this.sun.color.set(daylight < .35 ? 0x9ab6ff : 0xffe0ad);
  }

  #makeMapSignature(world) {
    return world.zone.map.map((row, y) => [...row].map((_, x) => world.getTile(x, y)).join("")).join("|");
  }

  #syncMap(world, elapsed) {
    const due = elapsed - this.lastMapCheck > .35;
    if (!due && this.zoneId === world.zoneId) return;
    this.lastMapCheck = elapsed;
    const signature = this.#makeMapSignature(world);
    if (this.zoneId === world.zoneId && signature === this.mapSignature) return;
    this.zoneId = world.zoneId;
    this.mapSignature = signature;
    this.#buildZone(world);
  }

  #buildZone(world) {
    this.zoneGroup.clear();
    const rows = world.zone.map.length;
    const cols = Math.max(...world.zone.map.map((row) => row.length));
    const dungeon = world.zone.environment === "dungeon";
    const mats = {
      grass: material("ground-grass", ["#263a25", "#344b2c", "#425833", "#1f2f20"], { grass: true, coarse: 16, grain: .16, repeatX: 1.4, repeatY: 1.4 }),
      stone: material("ground-stone", ["#5a574f", "#6b665b", "#3f403c", "#777064"], { stone: true, coarse: 22, grain: .13 }),
      crypt: material("ground-crypt", ["#262629", "#313139", "#18191e", "#3b383a"], { stone: true, coarse: 20, grain: .1 }),
    };
    const floorByMaterial = new Map();
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        if (world.getTile(x, y) !== 0) continue;
        const floorKind = world.getFloorMaterial(x + .5, y + .5);
        if (!floorByMaterial.has(floorKind)) floorByMaterial.set(floorKind, []);
        floorByMaterial.get(floorKind).push([x, y]);
      }
    }
    for (const [kind, tiles] of floorByMaterial) {
      const geo = new THREE.PlaneGeometry(1.02, 1.02);
      const mesh = new THREE.InstancedMesh(geo, mats[kind] || mats.grass, tiles.length);
      const dummy = new THREE.Object3D();
      tiles.forEach(([x, y], i) => {
        dummy.position.set(x + .5, 0, y + .5);
        dummy.rotation.set(-Math.PI / 2, 0, hash2(x, y, 4) * Math.PI * 2);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.receiveShadow = true;
      this.zoneGroup.add(mesh);
    }

    const wallMaterials = {
      1: material("wall-stone", ["#77736c", "#5a5752", "#89847a", "#464643"], { stone: true, coarse: 20, grain: .12 }),
      2: material("wall-door", ["#63401f", "#7b512a", "#4a2c18", "#8a6033"], { wood: true, coarse: 18, grain: .13, roughness: .72 }),
      3: material("wall-hedge", ["#203b20", "#2e5529", "#3c6535", "#182f1a"], { grass: true, coarse: 12, grain: .18 }),
      4: material("wall-crypt", ["#38383e", "#4a474c", "#26272d", "#575158"], { stone: true, coarse: 18, grain: .11 }),
      5: material("wall-rune", ["#303039", "#40384c", "#242531", "#554866"], { stone: true, runes: true, coarse: 18, grain: .1, emissive: 0x20113a, emissiveIntensity: .42 }),
    };
    for (let tile = 1; tile <= 5; tile += 1) {
      const positions = [];
      for (let y = 0; y < rows; y += 1) for (let x = 0; x < cols; x += 1) if (world.getTile(x, y) === tile) positions.push([x, y]);
      if (!positions.length) continue;
      const geometry = new THREE.BoxGeometry(1, WALL_HEIGHT, 1);
      const mesh = new THREE.InstancedMesh(geometry, wallMaterials[tile], positions.length);
      const dummy = new THREE.Object3D();
      positions.forEach(([x, y], i) => {
        dummy.position.set(x + .5, WALL_HEIGHT / 2, y + .5);
        dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.castShadow = tile !== 3;
      mesh.receiveShadow = true;
      this.zoneGroup.add(mesh);
    }

    if (dungeon) {
      const ceilingMat = material("crypt-ceiling", ["#19191e", "#25252b", "#111217"], { stone: true, coarse: 18, grain: .08 });
      const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(cols, rows), ceilingMat);
      ceiling.position.set(cols / 2, WALL_HEIGHT, rows / 2);
      ceiling.rotation.x = Math.PI / 2;
      ceiling.receiveShadow = true;
      this.zoneGroup.add(ceiling);
    } else {
      this.#scatterOutdoorProps(world, rows, cols);
      this.#buildOutdoorBackdrop(world, rows, cols);
    }
  }

  #scatterOutdoorProps(world, rows, cols) {
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x575a53, roughness: .98 });
    for (let y = 1; y < rows - 1; y += 1) {
      for (let x = 1; x < cols - 1; x += 1) {
        if (world.getTile(x, y) !== 0) continue;
        const materialKind = world.getFloorMaterial(x + .5, y + .5);
        const r = hash2(x, y, world.zoneId.length);
        if (materialKind === "grass" && r > .91) {
          const tree = createTree(Math.floor(r * 100));
          tree.position.set(x + .2 + hash2(x, y, 10) * .6, 0, y + .2 + hash2(x, y, 11) * .6);
          tree.rotation.y = r * Math.PI * 2;
          this.zoneGroup.add(tree);
        } else if (r > .84 && r < .875) {
          const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(.18 + r * .22, 0), rockMat);
          rock.position.set(x + hash2(x, y, 7), .12, y + hash2(x, y, 8));
          rock.scale.y = .55 + hash2(x, y, 9) * .55;
          rock.rotation.set(r * 2, r * 4, r);
          rock.castShadow = true;
          rock.receiveShadow = true;
          this.zoneGroup.add(rock);
        }
      }
    }
  }

  #buildOutdoorBackdrop(world, rows, cols) {
    const mountainMat = new THREE.MeshStandardMaterial({ color: 0x4f5960, roughness: 1, flatShading: true });
    const farMat = new THREE.MeshStandardMaterial({ color: 0x38434b, roughness: 1, flatShading: true });
    const centerX = cols / 2;
    const centerZ = rows / 2;
    for (let i = 0; i < 22; i += 1) {
      const angle = (i / 22) * Math.PI * 2;
      const radius = Math.max(cols, rows) * (1.05 + hash2(i, 3, world.zoneId.length) * .38);
      const height = 4.5 + hash2(i, 8, 5) * 8.5;
      const width = 2.8 + hash2(i, 12, 7) * 4.5;
      const mountain = new THREE.Mesh(new THREE.ConeGeometry(width, height, 7), i % 3 === 0 ? farMat : mountainMat);
      mountain.position.set(centerX + Math.cos(angle) * radius, height / 2 - .35, centerZ + Math.sin(angle) * radius);
      mountain.rotation.y = hash2(i, 6, 9) * Math.PI;
      mountain.scale.z = .7 + hash2(i, 10, 4) * .7;
      mountain.receiveShadow = true;
      this.zoneGroup.add(mountain);
    }
    const cloudMat = new THREE.MeshBasicMaterial({ color: 0xe4e6e1, transparent: true, opacity: .13, depthWrite: false });
    for (let i = 0; i < 12; i += 1) {
      const cloud = new THREE.Group();
      for (let j = 0; j < 4; j += 1) addPart(cloud, new THREE.SphereGeometry(.8 + j * .13, 10, 7), cloudMat, [(j - 1.5) * .8, Math.sin(j) * .16, 0], [1.5, .55, .75]);
      const angle = hash2(i, 20, 3) * Math.PI * 2;
      const radius = 12 + hash2(i, 21, 6) * 11;
      cloud.position.set(centerX + Math.cos(angle) * radius, 7 + hash2(i, 23, 7) * 5, centerZ + Math.sin(angle) * radius);
      cloud.rotation.y = angle + Math.PI / 2;
      this.zoneGroup.add(cloud);
    }
  }

  #syncEntities(world, elapsed) {
    const visibleIds = new Set();
    for (const entity of world.entities) {
      if (!world.isEntityVisible(entity) || entity.render === false) continue;
      const state = entity.enemyId ? world.combat.getEnemyState(entity.id) : null;
      if (state?.dead && state.deathTimer <= 0) continue;
      visibleIds.add(entity.id);
      let mesh = this.entityMeshes.get(entity.id);
      if (!mesh) {
        mesh = entity.enemyId ? createEnemyMesh(entity.enemyId) : createWorldObject(entity);
        mesh.userData.baseScale = mesh.scale.clone();
        mesh.userData.seed = hash2(Math.floor(entity.x * 11), Math.floor(entity.y * 17), entity.id.length);
        this.entityMeshes.set(entity.id, mesh);
        this.entityGroup.add(mesh);
      }
      mesh.position.set(entity.x, 0, entity.y);
      const dx = world.player.x - entity.x;
      const dz = world.player.y - entity.y;
      mesh.rotation.y = Math.atan2(-dx, -dz);
      const phase = elapsed * (1.4 + mesh.userData.seed);
      const definition = entity.enemyId ? getEnemyDefinition(entity.enemyId) : null;
      const brain = entity.enemyId ? world.combat.getEnemyBrain(entity.id) : null;
      const active = Boolean(brain?.state && brain.state !== "idle");
      const bob = entity.kind === "torch" ? Math.sin(phase * 5) * .03 : Math.sin(phase * (active ? 5 : 2)) * (active ? .045 : .018);
      mesh.position.y = bob;
      mesh.rotation.z = 0;
      mesh.visible = true;
      if (entity.enemyId) {
        const hpRatio = state && definition ? state.hp / definition.maxHp : 1;
        const attackPulse = state?.attackTimer > 0 ? Math.sin((1 - state.attackTimer) * Math.PI) : 0;
        mesh.position.y += attackPulse * .09;
        mesh.rotation.x = attackPulse * -.16;
        if (state?.hitFlash > 0) mesh.rotation.z = Math.sin(elapsed * 28) * .08;
        if (state?.dead) {
          const death = clamp(1 - (state.deathTimer || 0), 0, 1);
          mesh.rotation.z = death * Math.PI / 2;
          mesh.position.y = -death * .55;
          mesh.scale.copy(mesh.userData.baseScale).multiplyScalar(1 - death * .18);
        } else {
          const breath = 1 + Math.sin(phase * 2.4) * .018;
          mesh.scale.copy(mesh.userData.baseScale).multiplyScalar(breath * (hpRatio < .25 ? .97 : 1));
        }
      } else {
        mesh.scale.copy(mesh.userData.baseScale);
        mesh.traverse((child) => {
          if (child.userData.flame) {
            const s = .84 + Math.sin(elapsed * 13 + mesh.userData.seed * 9) * .2;
            child.scale.set(s, 1.05 + Math.sin(elapsed * 17) * .18, s);
          }
          if (child.userData.flameLight) child.intensity = 1.7 + Math.sin(elapsed * 15 + mesh.userData.seed * 7) * .35;
        });
      }
    }
    for (const [id, mesh] of this.entityMeshes) {
      if (!visibleIds.has(id)) {
        this.entityGroup.remove(mesh);
        this.entityMeshes.delete(id);
      }
    }
  }

  #syncProjectiles(world, elapsed) {
    const seen = new Set();
    for (const projectile of world.combat.projectiles || []) {
      seen.add(projectile.id);
      let mesh = this.projectileMeshes.get(projectile.id);
      if (!mesh) {
        const hostile = projectile.owner === "enemy";
        const color = projectile.kind?.toLowerCase().includes("fire") ? 0xff7a32 : hostile ? 0xb873ff : 0x76dcff;
        const mat = new THREE.MeshBasicMaterial({ color });
        mesh = new THREE.Mesh(projectile.kind?.includes("Arrow") ? new THREE.ConeGeometry(.035, .42, 6) : new THREE.IcosahedronGeometry(.1, 1), mat);
        this.projectileMeshes.set(projectile.id, mesh);
        this.projectileGroup.add(mesh);
      }
      mesh.position.set(projectile.x, .95 + Math.sin(elapsed * 12) * .04, projectile.y);
      mesh.rotation.z += .16;
      mesh.rotation.x += .12;
    }
    for (const [id, mesh] of this.projectileMeshes) if (!seen.has(id)) {
      this.projectileGroup.remove(mesh);
      this.projectileMeshes.delete(id);
    }
  }

  #updateCamera(world, elapsed) {
    const player = world.player;
    const moving = Math.abs(world.stepAccumulator || 0) > .01;
    const walkBob = moving ? Math.sin(elapsed * 8.5) * .018 : Math.sin(elapsed * 1.8) * .006;
    this.camera.position.set(player.x, EYE_HEIGHT + walkBob, player.y);
    this.camera.rotation.y = -player.direction - Math.PI / 2;
    this.camera.rotation.x = clamp(player.pitch || 0, -.65, .65);
    const view = world.getCombatView();
    const cooldown = view.cooldown || 0;
    const swing = cooldown > 0 ? clamp(cooldown / .75, 0, 1) : 0;
    this.weapon.rotation.z = .16 - Math.sin((1 - swing) * Math.PI) * .85;
    this.weapon.rotation.x = -.12 - Math.sin((1 - swing) * Math.PI) * .32;
    this.weapon.position.y = -.42 + Math.sin(elapsed * 1.7) * .008;
  }
}
