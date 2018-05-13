class Emitter {
  constructor () {
    this._listeners = {};
  }

  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} listenerFn
   * @param {Object?} context
   * @return {Emitter}
   */
  on (event, listenerFn, context) {
    if (typeof listenerFn !== 'function') {
      throw new Error('Invalid callback function.');
    }
    this._listeners[event] = this._listeners[event] || [];
    this._listeners[event].push({ fn: listenerFn, context });
    return this;
  };

  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} listenerFn
   * @param {Object?} context
   * @return {Emitter}
   */
  once (event, listenerFn, context) {
    const on = function () {
      this.off(event, on);
      listenerFn.apply(context || this, arguments);
    };
    this.on(event, on);
    return this;
  };

  /**
   * Remove the given listeners for `event` or all registered listeners.
   *
   * @param {String} event
   * @param {Function} listenerFn
   * @return {Emitter}
   */
  off (event, listenerFn) {
    // specific event
    const eventListeners = this._listeners[event];
    if (!eventListeners) {
      return this;
    }

    // remove specific handler
    let fn;
    for (let ix = 0; ix < eventListeners.length; ix++) {
      fn = eventListeners[ix].fn; ;
      if (listenerFn === fn) {
        eventListeners.splice(ix, 1);
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
    let eventListeners = this._listeners[event];

    if (eventListeners) {
      eventListeners = eventListeners.slice(0);
      let listenerFn;
      let context;
      for (let ix = 0, len = eventListeners.length; ix < len; ++ix) {
        listenerFn = eventListeners[ix].fn;
        context = eventListeners[ix].context;
        listenerFn.apply(context || this, args);
      }
    }

    return this;
  }

  destroy () {
    for (let event in this._listeners) {
      let eventListeners = this._listeners[event];
      eventListeners.splice(0, eventListeners.length);
    }
  };
}

Emitter.mixin = (object, emitter, methods) => {
  methods = methods || ['on', 'once', 'off'];
  // @todo use for instead of forEach
  methods.forEach((method) => {
    object[method] = (event, listenerFn, context) => {
      emitter[method](event, listenerFn, context);
    };
  });
};

export {
  Emitter
};
