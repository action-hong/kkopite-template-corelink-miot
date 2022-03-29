export class Task {
  constructor(time = 5000) {
    this.time = time;
    this.id = null;
    this.sending = false;
    this.identify = 0;
  }

  start(cb = () => {}, timeout) {
    clearTimeout(this.id);
    this.sending = true;
    this.id = setTimeout(() => {
      this.sending = false;
      cb();
    }, timeout || this.time);
  }

  stop() {
    this.identify++;
    clearTimeout(this.id);
    this.sending = false;
  }
}

export class IntervalTask {
  constructor(time = 3000) {
    this.time = time;
    this.id = 0;
    // 标识，stop后之前的回调就不会执行了
    this.identify = 0;
  }

  start(cb) {
    const identify = this.identify;
    this.id = setTimeout(async() => {
      try {
        await cb();
      } catch (error) {
      }
      if (this.identify === identify) {
        this.start(cb);
      }
    }, this.time);
  }

  stop() {
    this.identify++;
    clearTimeout(this.id);
  }
}