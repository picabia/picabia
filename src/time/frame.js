import { Emitter } from '../core/emitter';

const FREEZE = true;
const MAX_DELTA = false;
const MAX_UPDATE = 10;
const INTERVAL = false;
const INTERVAL_MS = 50;

class Frame {
  constructor (config) {
    config = config || {};

    config.freeze = typeof config.freeze !== 'undefined' ? config.freeze : FREEZE;
    config.maxDelta = config.maxDelta || MAX_DELTA;
    config.maxUpdate = config.maxUpdate || MAX_UPDATE;
    config.interval = typeof config.interval !== 'undefined' ? config.interval : INTERVAL;
    config.intervalMs = config.intervalMs || INTERVAL_MS;

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);

    this._config = config;

    this._intervalId = null;
    this._frameId = null;
    this._paused = false;

    this._elapsed = 0;
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
    const maxUpdate = this._config.maxUpdate;
    this._lastTs = timestamp;
    if (maxDelta && delta > maxDelta) {
      delta = maxDelta;
    }
    const updates = Math.floor(delta / maxUpdate);
    const remainder = delta % maxUpdate;
    for (let ix = 0; ix < updates; ix++) {
      this._elapsed += maxUpdate;
      this._emitter.emit('update', { d: maxUpdate, t: this._elapsed });
    }
    if (remainder || !updates) {
      this._elapsed += remainder;
      this._emitter.emit('update', { d: remainder, t: this._elapsed });
    }
    this._emitter.emit('render', { d: delta, t: this._elapsed });
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

  // -- api

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
