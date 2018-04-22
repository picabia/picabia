import { Emitter } from '../core/emitter';

const FREEZE = true;
const MAX_DELTA = 10;
const INTERVAL = false;
const INTERVAL_MS = 50;

class Frame {
  constructor (config) {
    config = config || {};

    config.freeze = typeof config.freeze !== 'undefined' ? config.freeze : FREEZE;
    config.maxDelta = config.maxDelta || MAX_DELTA;
    config.interval = typeof config.interval !== 'undefined' ? config.interval : INTERVAL;
    config.intervalMs = config.intervalMs || INTERVAL_MS;

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);

    this._config = config;

    this._intervalId = null;
    this._frameId = null;
    this._paused = false;

    this._lastTs = null;
  }

  // -- private

  _resume () {
    this._paused = false;
    if (this._config.interval) {
      this._setInterval();
    } else {
      this._animationFrame();
    }
  }

  _pause () {
    this._paused = true;
    if (this._config.interval) {
      window.clearInterval(this._intervalId);
    }
  }

  _frame (timestamp) {
    let delta = this._lastTs ? timestamp - this._lastTs : 0;
    const maxDelta = this._config.maxDelta;
    this._lastTs = timestamp;
    if (delta <= maxDelta || this._config.freeze) {
      delta = this._config.freeze ? Math.min(delta, maxDelta) : delta;
      this._emitter.emit('update', delta, timestamp);
    } else {
      const updates = Math.floor(delta / maxDelta);
      const remainder = delta / maxDelta;
      for (let ix = 0; ix < updates; ix++) {
        this._emitter.emit('update', maxDelta, this._lastTs + maxDelta * ix);
      }
      if (remainder) {
        this._emitter.emit('update', remainder, timestamp);
      }
    }
    this._emitter.emit('render', delta, timestamp);
  }

  _animationFrame () {
    window.requestAnimationFrame((timestamp) => {
      if (this._paused) {
        return;
      }
      this._frame(timestamp);
      this._animationFrame();
    });
  }

  _setInterval () {
    this._intervalId = window.setInterval(() => {
      const timestamp = new Date();
      this._frame(timestamp);
    }, this._config.intervalMs);
  }

  // -- public

  start () {
    this._resume();
  }

  pause () {
    this._pause();
  }

  resume () {
    this._resume();
  }

  destroy () {
    this._pause();
    this._emitter.destroy();
  }
}

export {
  Frame
};
