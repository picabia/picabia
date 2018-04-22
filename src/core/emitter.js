class Emitter {
  constructor () {
    this._callbacks = {};
  }

  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   */
  on (event, fn) {
    if (typeof fn !== 'function') {
      throw new Error('Invalid callback function.');
    }
    (this._callbacks[event] = this._callbacks[event] || []).push(fn);
    return this;
  };

  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   */
  once (event, fn) {
    const on = () => {
      this.off(event, on);
      fn.apply(this, arguments);
    };
    this.on(event, on);
    return this;
  };

  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   */
  off (event, fn) {
    // specific event
    const eventCallbacks = this._callbacks[event];
    if (!eventCallbacks) {
      return this;
    }

    // remove specific handler
    let callback;
    for (let ix = 0; ix < eventCallbacks.length; ix++) {
      callback = eventCallbacks[ix];
      if (callback === fn) {
        eventCallbacks.splice(ix, 1);
        break;
      }
    }
    return this;
  };

  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   * @return {Emitter}
   */
  emit (event) {
    const args = [].slice.call(arguments, 1);
    let eventCallbacks = this._callbacks[event];

    if (eventCallbacks) {
      eventCallbacks = eventCallbacks.slice(0);
      for (let ix = 0, len = eventCallbacks.length; ix < len; ++ix) {
        eventCallbacks[ix].apply(this, args);
      }
    }

    return this;
  }

  destroy () {
    for (let event in this._callbacks) {
      let eventCallbacks = this._callbacks[event];
      eventCallbacks.splice(0, eventCallbacks.length);
    }
  };
}

Emitter.mixin = (object, emitter, methods) => {
  methods = methods || ['on', 'once', 'off'];
  methods.forEach((method) => {
    object[method] = (event, callback, context) => {
      if (context) {
        emitter[method].call(context, event, callback);
      } else {
        emitter[method](event, callback);
      }
    };
  });
};

export {
  Emitter
};
