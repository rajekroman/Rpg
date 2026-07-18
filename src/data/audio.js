const audioUrl = (path) => new URL(`../../assets/audio/${path}`, import.meta.url).href;

const music = {
  menu: "music/menu.mp3",
  valeDay: "music/vale-day.mp3",
  valeNight: "music/vale-night.mp3",
  passDay: "music/pass-day.mp3",
  passNight: "music/pass-night.mp3",
  crypt: "music/crypt.mp3",
  combat: "music/combat.mp3",
  boss: "music/boss.mp3",
};

const ambience = {
  forest: "ambience/forest.mp3",
  mountainWind: "ambience/mountain-wind.mp3",
  cryptDepths: "ambience/crypt-depths.mp3",
};

const sfxNames = [
  "ui-click", "ui-confirm", "ui-error", "ui-page",
  "step-grass-1", "step-grass-2", "step-grass-3",
  "step-stone-1", "step-stone-2", "step-stone-3",
  "step-crypt-1", "step-crypt-2", "step-crypt-3",
  "weapon-sword", "weapon-mace", "weapon-bow", "weapon-staff",
  "hit-flesh", "hit-armor", "hit-critical", "miss",
  "door-open", "door-close", "door-locked", "lever", "collect",
  "quest-update", "quest-complete", "trap-trigger", "trap-disarm",
  "zone-transition", "discovery",
  "magic-fire", "magic-frost", "magic-lightning", "magic-heal",
  "magic-spirit", "magic-poison", "magic-fail",
  "tactical-pause", "tactical-resume",
  "monster-hound-attack", "monster-hound-death",
  "monster-crawler-attack", "monster-crawler-death",
  "monster-raider-attack", "monster-raider-death",
  "monster-sentinel-attack", "monster-sentinel-death",
  "monster-shade-attack", "monster-shade-death",
  "monster-boss-attack", "monster-boss-death",
];

const sfx = Object.fromEntries(sfxNames.map((name) => [name, `sfx/${name}.mp3`]));

export const AUDIO_MANIFEST = Object.freeze({
  ...Object.fromEntries(Object.entries(music).map(([id, path]) => [`music:${id}`, audioUrl(path)])),
  ...Object.fromEntries(Object.entries(ambience).map(([id, path]) => [`ambience:${id}`, audioUrl(path)])),
  ...Object.fromEntries(Object.entries(sfx).map(([id, path]) => [`sfx:${id}`, audioUrl(path)])),
});

export const AUDIO_COUNTS = Object.freeze({ music: Object.keys(music).length, ambience: Object.keys(ambience).length, sfx: Object.keys(sfx).length });

export const ENEMY_AUDIO_ARCHETYPE = Object.freeze({
  echoHound: "hound",
  mireCrawler: "crawler",
  ashRaider: "raider",
  hollowSentinel: "sentinel",
  echoShade: "shade",
  echoWarden: "boss",
  morKharr: "boss",
});

export function resolveSceneAudio(scene = {}) {
  if (scene.screen === "menu" || !scene.zoneId) return { musicId: "menu", ambienceId: null };
  const dungeon = scene.environment === "dungeon" || ["echoCrypt", "drownedAbbey", "obsidianArchive", "hollowThrone"].includes(scene.zoneId);
  const mountain = ["silverPass", "crownCitadel"].includes(scene.zoneId);
  const ambienceId = dungeon ? "cryptDepths" : mountain ? "mountainWind" : "forest";
  if (scene.inCombat) return { musicId: scene.bossActive ? "boss" : "combat", ambienceId };
  if (dungeon) return { musicId: "crypt", ambienceId };
  if (mountain || scene.zoneId === "ashenMarch") return { musicId: scene.isNight ? "passNight" : "passDay", ambienceId };
  return { musicId: scene.isNight ? "valeNight" : "valeDay", ambienceId };
}
