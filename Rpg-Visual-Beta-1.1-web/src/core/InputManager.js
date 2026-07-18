import { clamp } from "../utils/math.js";

const PREVENTED_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Space",
  "Tab",
  "F1",
  "F2",
  "F3",
  "F4",
]);

export class InputManager {
  constructor({ canvas, moveStick, lookPad }) {
    this.canvas = canvas;
    this.moveStick = moveStick;
    this.lookPad = lookPad;
    this.keys = new Set();
    this.pressed = new Set();
    this.pointerLocked = false;
    this.lookDelta = 0;
    this.lookDeltaY = 0;
    this.touchMove = { x: 0, y: 0 };
    this.touchLookDelta = 0;
    this.touchLookDeltaY = 0;
    this.moveTouchId = null;
    this.lookTouchId = null;
    this.lookLastX = 0;
    this.lookLastY = 0;
    this.stickOrigin = { x: 0, y: 0 };
    this.enabled = true;
    this.bound = [];
    this.#bind();
  }

  destroy() {
    for (const [target, type, handler, options] of this.bound) {
      target.removeEventListener(type, handler, options);
    }
    this.bound = [];
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    if (!this.enabled) {
      this.keys.clear();
      this.pressed.clear();
      this.touchMove.x = 0;
      this.touchMove.y = 0;
      this.lookDelta = 0;
      this.lookDeltaY = 0;
      this.touchLookDelta = 0;
      this.touchLookDeltaY = 0;
      this.#resetStickVisual();
    }
  }

  consumePressed(code) {
    if (!this.pressed.has(code)) return false;
    this.pressed.delete(code);
    return true;
  }

  getAxes() {
    if (!this.enabled) return { forward: 0, strafe: 0, turn: 0 };

    let forward = 0;
    let strafe = 0;
    let turn = 0;

    if (this.#down("KeyW") || this.#down("ArrowUp")) forward += 1;
    if (this.#down("KeyS") || this.#down("ArrowDown")) forward -= 1;
    if (this.#down("KeyA")) strafe -= 1;
    if (this.#down("KeyD")) strafe += 1;
    if (this.#down("KeyQ") || this.#down("ArrowLeft")) turn -= 1;
    if (this.#down("KeyE") || this.#down("ArrowRight")) turn += 1;

    const curve = (value) => Math.abs(value) < 0.08 ? 0 : Math.sign(value) * Math.pow(Math.abs(value), 1.35);
    forward = clamp(forward - curve(this.touchMove.y), -1, 1);
    strafe = clamp(strafe + curve(this.touchMove.x), -1, 1);
    turn = clamp(turn + (this.lookDelta + this.touchLookDelta) * 0.0048, -2.1, 2.1);
    const pitch = clamp((this.lookDeltaY + this.touchLookDeltaY) * 0.0036, -1.25, 1.25);

    this.lookDelta = 0;
    this.lookDeltaY = 0;
    this.touchLookDelta = 0;
    this.touchLookDeltaY = 0;

    return { forward, strafe, turn, pitch };
  }

  #down(code) {
    return this.keys.has(code);
  }

  #listen(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    this.bound.push([target, type, handler, options]);
  }

  #bind() {
    this.#listen(window, "keydown", (event) => {
      if (PREVENTED_KEYS.has(event.code)) event.preventDefault();
      if (!this.enabled) return;
      if (!this.keys.has(event.code)) this.pressed.add(event.code);
      this.keys.add(event.code);
    });

    this.#listen(window, "keyup", (event) => {
      this.keys.delete(event.code);
    });

    this.#listen(window, "blur", () => {
      this.keys.clear();
      this.pressed.clear();
    });

    this.#listen(this.canvas, "click", () => {
      if (!this.enabled || !this.canvas.requestPointerLock || this.pointerLocked) return;
      this.canvas.requestPointerLock();
    });

    this.#listen(this.canvas, "pointerdown", (event) => {
      if (!this.enabled || event.button !== 0 || !this.pointerLocked) return;
      this.pressed.add("Mouse0");
    });

    this.#listen(document, "pointerlockchange", () => {
      this.pointerLocked = document.pointerLockElement === this.canvas;
    });

    this.#listen(document, "mousemove", (event) => {
      if (this.enabled && this.pointerLocked) { this.lookDelta += event.movementX; this.lookDeltaY += event.movementY; }
    });

    this.#bindMoveStick();
    this.#bindLookPad();
  }

  #bindMoveStick() {
    if (!this.moveStick) return;
    const knob = this.moveStick.querySelector(".touch-stick__knob");

    const start = (event) => {
      if (!this.enabled || this.moveTouchId !== null) return;
      event.preventDefault();
      this.moveTouchId = event.pointerId;
      this.moveStick.setPointerCapture?.(event.pointerId);
      const rect = this.moveStick.getBoundingClientRect();
      this.stickOrigin.x = rect.left + rect.width / 2;
      this.stickOrigin.y = rect.top + rect.height / 2;
      update(event);
    };

    const update = (event) => {
      if (event.pointerId !== this.moveTouchId) return;
      const dx = event.clientX - this.stickOrigin.x;
      const dy = event.clientY - this.stickOrigin.y;
      const maxRadius = Math.max(30, this.moveStick.clientWidth * 0.34);
      const length = Math.hypot(dx, dy) || 1;
      const scale = Math.min(1, maxRadius / length);
      const limitedX = dx * scale;
      const limitedY = dy * scale;
      this.touchMove.x = clamp(limitedX / maxRadius, -1, 1);
      this.touchMove.y = clamp(limitedY / maxRadius, -1, 1);
      if (knob) knob.style.transform = `translate(calc(-50% + ${limitedX}px), calc(-50% + ${limitedY}px))`;
    };

    const end = (event) => {
      if (event.pointerId !== this.moveTouchId) return;
      this.moveTouchId = null;
      this.touchMove.x = 0;
      this.touchMove.y = 0;
      this.#resetStickVisual();
    };

    this.#listen(this.moveStick, "pointerdown", start);
    this.#listen(this.moveStick, "pointermove", update);
    this.#listen(this.moveStick, "pointerup", end);
    this.#listen(this.moveStick, "pointercancel", end);
  }

  #bindLookPad() {
    if (!this.lookPad) return;

    this.#listen(this.lookPad, "pointerdown", (event) => {
      if (!this.enabled || this.lookTouchId !== null) return;
      event.preventDefault();
      this.lookTouchId = event.pointerId;
      this.lookLastX = event.clientX;
      this.lookLastY = event.clientY;
      this.lookPad.setPointerCapture?.(event.pointerId);
    });

    this.#listen(this.lookPad, "pointermove", (event) => {
      if (event.pointerId !== this.lookTouchId) return;
      const delta = event.clientX - this.lookLastX;
      const deltaY = event.clientY - this.lookLastY;
      this.lookLastX = event.clientX;
      this.lookLastY = event.clientY;
      this.touchLookDelta += delta;
      this.touchLookDeltaY += deltaY;    });

    const end = (event) => {
      if (event.pointerId === this.lookTouchId) this.lookTouchId = null;
    };
    this.#listen(this.lookPad, "pointerup", end);
    this.#listen(this.lookPad, "pointercancel", end);
  }

  #resetStickVisual() {
    const knob = this.moveStick?.querySelector(".touch-stick__knob");
    if (knob) knob.style.transform = "translate(-50%, -50%)";
  }
}
