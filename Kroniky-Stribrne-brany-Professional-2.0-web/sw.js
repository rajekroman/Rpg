const CACHE_VERSION = "ksb-2.0.0-professional";
const CORE_CACHE = `${CACHE_VERSION}-core`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const CORE_ASSETS = [
  "./",
  "./assets/audio/ambience/crypt-depths.mp3",
  "./assets/audio/ambience/forest.mp3",
  "./assets/audio/ambience/mountain-wind.mp3",
  "./assets/audio/audio-index.json",
  "./assets/audio/music/boss.mp3",
  "./assets/audio/music/combat.mp3",
  "./assets/audio/music/crypt.mp3",
  "./assets/audio/music/menu.mp3",
  "./assets/audio/music/pass-day.mp3",
  "./assets/audio/music/pass-night.mp3",
  "./assets/audio/music/vale-day.mp3",
  "./assets/audio/music/vale-night.mp3",
  "./assets/audio/sfx/collect.mp3",
  "./assets/audio/sfx/discovery.mp3",
  "./assets/audio/sfx/door-close.mp3",
  "./assets/audio/sfx/door-locked.mp3",
  "./assets/audio/sfx/door-open.mp3",
  "./assets/audio/sfx/hit-armor.mp3",
  "./assets/audio/sfx/hit-critical.mp3",
  "./assets/audio/sfx/hit-flesh.mp3",
  "./assets/audio/sfx/lever.mp3",
  "./assets/audio/sfx/magic-fail.mp3",
  "./assets/audio/sfx/magic-fire.mp3",
  "./assets/audio/sfx/magic-frost.mp3",
  "./assets/audio/sfx/magic-heal.mp3",
  "./assets/audio/sfx/magic-lightning.mp3",
  "./assets/audio/sfx/magic-poison.mp3",
  "./assets/audio/sfx/magic-spirit.mp3",
  "./assets/audio/sfx/miss.mp3",
  "./assets/audio/sfx/monster-boss-attack.mp3",
  "./assets/audio/sfx/monster-boss-death.mp3",
  "./assets/audio/sfx/monster-crawler-attack.mp3",
  "./assets/audio/sfx/monster-crawler-death.mp3",
  "./assets/audio/sfx/monster-hound-attack.mp3",
  "./assets/audio/sfx/monster-hound-death.mp3",
  "./assets/audio/sfx/monster-raider-attack.mp3",
  "./assets/audio/sfx/monster-raider-death.mp3",
  "./assets/audio/sfx/monster-sentinel-attack.mp3",
  "./assets/audio/sfx/monster-sentinel-death.mp3",
  "./assets/audio/sfx/monster-shade-attack.mp3",
  "./assets/audio/sfx/monster-shade-death.mp3",
  "./assets/audio/sfx/quest-complete.mp3",
  "./assets/audio/sfx/quest-update.mp3",
  "./assets/audio/sfx/step-crypt-1.mp3",
  "./assets/audio/sfx/step-crypt-2.mp3",
  "./assets/audio/sfx/step-crypt-3.mp3",
  "./assets/audio/sfx/step-grass-1.mp3",
  "./assets/audio/sfx/step-grass-2.mp3",
  "./assets/audio/sfx/step-grass-3.mp3",
  "./assets/audio/sfx/step-stone-1.mp3",
  "./assets/audio/sfx/step-stone-2.mp3",
  "./assets/audio/sfx/step-stone-3.mp3",
  "./assets/audio/sfx/tactical-pause.mp3",
  "./assets/audio/sfx/tactical-resume.mp3",
  "./assets/audio/sfx/trap-disarm.mp3",
  "./assets/audio/sfx/trap-trigger.mp3",
  "./assets/audio/sfx/ui-click.mp3",
  "./assets/audio/sfx/ui-confirm.mp3",
  "./assets/audio/sfx/ui-error.mp3",
  "./assets/audio/sfx/ui-page.mp3",
  "./assets/audio/sfx/weapon-bow.mp3",
  "./assets/audio/sfx/weapon-mace.mp3",
  "./assets/audio/sfx/weapon-staff.mp3",
  "./assets/audio/sfx/weapon-sword.mp3",
  "./assets/audio/sfx/zone-transition.mp3",
  "./assets/effects/spells.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./assets/sprites/enemies.png",
  "./assets/sprites/weapons.png",
  "./assets/sprites/world.png",
  "./assets/textures/floors.png",
  "./assets/textures/professional/crypt-floor.png",
  "./assets/textures/professional/crypt-wall.png",
  "./assets/textures/professional/grass.png",
  "./assets/textures/professional/hedge.png",
  "./assets/textures/professional/rune-wall.png",
  "./assets/textures/professional/stone-floor.png",
  "./assets/textures/professional/stone-wall.png",
  "./assets/textures/professional/wood-door.png",
  "./assets/textures/walls.png",
  "./assets/ui/icons.png",
  "./assets/ui/professional/button.png",
  "./assets/ui/professional/frame-slot.png",
  "./assets/ui/professional/frame-stone.png",
  "./assets/ui/professional/panel-obsidian.png",
  "./assets/ui/professional/portrait-daren.png",
  "./assets/ui/professional/portrait-lyra.png",
  "./assets/ui/professional/portrait-orin.png",
  "./assets/ui/professional/portrait-saela.png",
  "./assets/ui/professional/title-background.jpg",
  "./assets/ui/professional/utility-icons.png",
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
