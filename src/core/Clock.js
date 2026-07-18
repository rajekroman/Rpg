export class Clock {
  constructor({ fixedStep = 1 / 60, maxFrameTime = 0.25 } = {}) {
    this.fixedStep = fixedStep;
    this.maxFrameTime = maxFrameTime;
    this.accumulator = 0;
    this.lastTimestamp = 0;
    this.running = false;
    this.requestId = 0;
  }

  start(update, render) {
    if (this.running) return;
    this.running = true;
    this.lastTimestamp = performance.now();

    const frame = (timestamp) => {
      if (!this.running) return;

      const elapsed = Math.min(
        this.maxFrameTime,
        Math.max(0, (timestamp - this.lastTimestamp) / 1000),
      );
      this.lastTimestamp = timestamp;
      this.accumulator += elapsed;

      while (this.accumulator >= this.fixedStep) {
        update(this.fixedStep);
        this.accumulator -= this.fixedStep;
      }

      render(this.accumulator / this.fixedStep, elapsed);
      this.requestId = requestAnimationFrame(frame);
    };

    this.requestId = requestAnimationFrame(frame);
  }

  stop() {
    this.running = false;
    if (this.requestId) cancelAnimationFrame(this.requestId);
    this.requestId = 0;
    this.accumulator = 0;
  }
}
