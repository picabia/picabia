import { Emitter } from '../core/emitter';

class Interactive {
  constructor (surface, collisionFn, cursorStyle, cursorFn) {
    this._surface = surface;

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);

    this._down = (event) => {
      this._emitter.emit('down', event);
    };

    this._up = (event) => {
      this._emitter.emit('up', event);
    };

    this._tap = (event) => {
      this._emitter.emit('tap', event);
    };

    this._over = (event) => {
      this._emitter.emit('over', event);
    };

    this._out = (event) => {
      this._emitter.emit('out', event);
    };

    this._bindings = [];

    this._bindings.push(this._.surface.on('down', this._down, collisionFn));
    this._bindings.push(this._.surface.on('up', this._up, collisionFn));
    this._bindings.push(this._.surface.on('tap', this._tap, collisionFn));
    this._bindings.push(this._.surface.on('over', this._over, collisionFn));
    this._bindings.push(this._.surface.on('out', this._out, collisionFn));

    if (cursorStyle || cursorFn) {
      cursorFn = cursorFn || collisionFn;
      this._bindings.push(this._surface.cursor('pointer', cursorFn));
    }
  }

  // -- AppObject API

  destroy () {
    this._emitter.destroy();

    this._bindings.forEach((binding) => binding.unbind());
  }
}

export {
  Interactive
};
