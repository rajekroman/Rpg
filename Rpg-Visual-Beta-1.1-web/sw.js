const CACHE_VERSION = "ksb-1.1.0-beta1";
const CORE_CACHE = `${CACHE_VERSION}-core`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const CORE_ASSETS = [
  "./",
  "./assets/effects/spells.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./assets/sprites/enemies.png",
  "./assets/sprites/weapons.png",
  "./assets/sprites/world.png",
  "./assets/textures/floors.png",
  "./assets/textures/walls.png",
  "./assets/ui/icons.png",
  "./assets/ui/portrait-daren.png",
  "./assets/ui/portrait-lyra.png",
  "./assets/ui/portrait-orin.png",
  "./assets/ui/portrait-saela.png",
  "./index.html",
  "./manifest.webmanifest",
  "./src/core/AssetManager.js",
  "./src/core/AudioManager.js",
  "./src/core/Clock.js",
  "./src/core/Game.js",
  "./src/core/InputManager.js",
  "./src/core/PreferencesManager.js",
  "./src/core/SaveManager.js",
  "./src/data/abilities.js",
  "./src/data/assets.js",
  "./src/data/audio.js",
  "./src/data/campaignBoards.js",
  "./src/data/campaignDialogues.js",
  "./src/data/campaignEnemies.js",
  "./src/data/campaignItems.js",
  "./src/data/campaignQuests.js",
  "./src/data/classes.js",
  "./src/data/dialogues.js",
  "./src/data/endings.js",
  "./src/data/enemies.js",
  "./src/data/enemyAbilities.js",
  "./src/data/factions.js",
  "./src/data/items.js",
  "./src/data/lootTables.js",
  "./src/data/party.js",
  "./src/data/quests.js",
  "./src/data/skills.js",
  "./src/data/vendors.js",
  "./src/main.js",
  "./src/render/AnimationState.js",
  "./src/render/CinematicRenderer.js",
  "./src/render/HybridRenderer.js",
  "./src/render/Raycaster.js",
  "./src/systems/CombatSystem.js",
  "./src/systems/ConditionEvaluator.js",
  "./src/systems/DialogueManager.js",
  "./src/systems/EnemyAI.js",
  "./src/systems/InventoryManager.js",
  "./src/systems/LootManager.js",
  "./src/systems/MagicSystem.js",
  "./src/systems/PartyManager.js",
  "./src/systems/Pathfinder.js",
  "./src/systems/QuestManager.js",
  "./src/systems/VendorManager.js",
  "./src/ui/Hud.js",
  "./src/utils/math.js",
  "./src/world/EnvironmentSystem.js",
  "./src/world/World.js",
  "./src/world/campaignZones.js",
  "./src/world/maps.js",
  "./src/world/willowVale.js",
  "./styles.css",
  "./vendor/three.module.min.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CORE_CACHE).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
      return response;
    }).catch(async () => (await caches.match(request)) || caches.match("./index.html")));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => {
    if (cached) return cached;
    return fetch(request).then((response) => {
      if (response.ok && response.type === "basic") {
        const copy = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    });
  }));
});
