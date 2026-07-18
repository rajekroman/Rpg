import { Raycaster } from "./Raycaster.js";
import { CinematicRenderer } from "./CinematicRenderer.js";

export class HybridRenderer {
  constructor(canvas, assets = null) {
    this.canvas = canvas;
    this.assets = assets;
    this.mode = "webgl";
    try {
      this.renderer = new CinematicRenderer(canvas, assets);
    } catch (error) {
      console.warn("WebGL renderer unavailable; using compatibility renderer.", error);
      this.mode = "canvas";
      this.renderer = new Raycaster(canvas, assets);
    }
  }

  setAssets(assets) {
    this.assets = assets;
    this.renderer.setAssets?.(assets);
  }

  resize(width, height) {
    this.renderer.resize(width, height);
  }

  render(world, interpolation = 0) {
    this.renderer.render(world, interpolation);
  }
}
