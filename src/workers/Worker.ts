const TICK_INTERVAL_MILLIS = 1000;

export default abstract class Worker {
  private nextTick: number;

  constructor() {
    this.nextTick = new Date().getTime();
  }

  async startLoop() {
    this.doLoop();
  }

  private async doLoop() {
    while (this.nextTick <= new Date().getTime()) {
      this.nextTick += TICK_INTERVAL_MILLIS;
      try {
        await this.tick();
      } catch(e) {
        console.error('Unhandled error in worker tick: %o', e);
      }
    }

    const timeout = this.nextTick - new Date().getTime();
    setTimeout(this.doLoop.bind(this), timeout);
  }

  protected abstract tick(): void;
}
