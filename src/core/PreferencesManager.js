const SETTINGS_KEY = "kroniky-stribrne-brany-preferences-m12";

export const DEFAULT_PREFERENCES = Object.freeze({
  quality: "auto",
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  crosshair: true,
  autosave: true,
  touchOpacity: 0.9,
});

const QUALITY_VALUES = new Set(["low", "balanced", "high", "auto"]);
const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value)));

function normalize(raw = {}) {
  const prefersReduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  return {
    quality: QUALITY_VALUES.has(raw.quality) ? raw.quality : DEFAULT_PREFERENCES.quality,
    highContrast: Boolean(raw.highContrast),
    reducedMotion: raw.reducedMotion == null ? prefersReduced : Boolean(raw.reducedMotion),
    largeText: Boolean(raw.largeText),
    crosshair: raw.crosshair == null ? true : Boolean(raw.crosshair),
    autosave: raw.autosave == null ? true : Boolean(raw.autosave),
    touchOpacity: clamp(raw.touchOpacity ?? DEFAULT_PREFERENCES.touchOpacity, 0.45, 1),
  };
}

export class PreferencesManager {
  constructor({ storage = globalThis.localStorage } = {}) {
    this.storage = storage;
    this.settings = this.#load();
  }

  getSettings() { return { ...this.settings }; }

  setSetting(name, value) {
    if (!(name in DEFAULT_PREFERENCES)) return this.getSettings();
    const next = normalize({ ...this.settings, [name]: value });
    this.settings = next;
    this.#save();
    return this.getSettings();
  }

  apply(root = globalThis.document?.documentElement) {
    if (!root?.classList) return;
    root.classList.toggle("pref-high-contrast", this.settings.highContrast);
    root.classList.toggle("pref-reduced-motion", this.settings.reducedMotion);
    root.classList.toggle("pref-large-text", this.settings.largeText);
    root.classList.toggle("pref-hide-crosshair", !this.settings.crosshair);
    root.style?.setProperty?.("--touch-opacity", String(this.settings.touchOpacity));
    root.dataset.quality = this.settings.quality;
  }

  getRenderWidth(viewportWidth = 640) {
    const quality = this.settings.quality;
    if (quality === "low") return 400;
    if (quality === "balanced") return 520;
    if (quality === "high") return viewportWidth < 700 ? 640 : 800;
    const memory = Number(globalThis.navigator?.deviceMemory || 0);
    const cores = Number(globalThis.navigator?.hardwareConcurrency || 0);
    const constrained = (memory && memory <= 4) || (cores && cores <= 4);
    if (constrained) return viewportWidth < 700 ? 400 : 520;
    return viewportWidth < 700 ? 480 : 640;
  }

  #load() {
    try {
      const raw = this.storage?.getItem?.(SETTINGS_KEY);
      return normalize(raw ? JSON.parse(raw) : {});
    } catch {
      return normalize({});
    }
  }

  #save() {
    try { this.storage?.setItem?.(SETTINGS_KEY, JSON.stringify(this.settings)); } catch { /* storage unavailable */ }
  }
}
