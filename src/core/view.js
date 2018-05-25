import { Random } from '../random/random';

class View {
  constructor (v, target) {
    this._ = 'view';
    this._v = v;
    this._id = Random.id();

    this._renderer = target && target.renderer;
    this._viewport = target && target.viewport;
    this._layer = target && target.layer;
    this._zIndex = (target && target.zIndex) || 0;

    this._children = [];
    this._childIndex = 0;

    this._active = true;
    this._requiresResize = false;

    this._time = {
      i: undefined,
      t: undefined,
      d: undefined
    };
  }

  get id () {
    return this._id;
  }

  setActive (active) {
    this._active = active;
  }

  get active () {
    return this._active;
  }

  setRenderer (renderer) {
    this._renderer = renderer;
  }

  get renderer () {
    return this._renderer;
  }

  setViewport (viewport) {
    this._viewport = viewport;
  }

  get viewport () {
    return this._viewport;
  }

  setLayer (layer) {
    this._layer = layer;
  }

  get layer () {
    return this._layer;
  }

  setZIndex (zIndex) {
    this._zIndex = zIndex;
  }

  get zIndex () {
    return this._zIndex;
  }

  // -- private

  _createChild (Constructor, target, ...args) {
    let child;
    if (target) {
      if (target.renderer && typeof target.renderer === 'string') {
        target.renderer = this._v.get(`renderer:${target.renderer}`);
      } else if (!target.renderer) {
        target.renderer = this._renderer;
      }
      if (target.viewport && typeof target.viewport === 'string') {
        target.viewport = this._v.get(`viewport:${target.viewport}`);
      } else if (!target.viewport) {
        target.viewport = this._viewport;
      }
      if (target.layer && typeof target.layer === 'string') {
        target.layer = this._v.get(`layer:${target.layer}`);
      } else if (!target.layer) {
        target.layer = this._layer;
      }
      if (target.zIndex && typeof target.layer === 'string') {
        target.layer = this._v.get(`layer:${target.layer}`);
      } else if (!target.zIndex) {
        target.zIndex = this._zIndex + (1 + this._childIndex) / 1000;
      }
      child = new Constructor(this._v, target, ...args);
      this._v.addView(child);
    } else {
      child = new Constructor(this._v, ...args);
    }
    this._addChild(child);
    return child;
  }

  _addChild (child) {
    this._children.push(child);
    this._childIndex++;
  }

  _removeChild (child) {
    this._v.removeView(child);
    const index = this._children.indexOf(child);
    if (index !== -1) {
      this._children.splice(index, 1);
    }
  }

  _destroyChild (child) {
    this._removeChild(child);
    child.destroy();
  }

  _init () {
    this._preInit();
    for (let ix = 0; ix < this._children.length; ix++) {
      this._children[ix]._init();
    }
    this._postInit();
  }

  // -- overridable

  _preInit () {}

  _postInit () {}

  _preUpdate () {}

  _preResize () {}

  _postResize () {}

  _postUpdate () {}

  _destroy () {}

  // -- api

  get time () {
    return {
      t: this._time.t || 0,
      d: this._time.d || 0
    };
  }

  resize () {
    this._requiresResize = true;
    for (let ix = 0; ix < this._children.length; ix++) {
      this._children[ix].resize();
    }
  }

  update (time) {
    if (this._time.i === undefined) {
      this._time.i = time.t;
      this._time.t = time.t;
      this._init();
    }
    this._time.t = time.t;
    this._time.d = time.d;

    this._preUpdate();
    if (this._requiresResize) {
      this._preResize();
    }

    for (let ix = 0; ix < this._children.length; ix++) {
      this._children[ix].update(time);
    }

    if (this._requiresResize) {
      this._postResize();
    }
    this._postUpdate();
    this._requiresResize = false;
  }

  destroy () {
    for (let ix = 0; ix < this._children.length; ix++) {
      const child = this._children[ix];
      this._v.remove(child);
      child.destroy();
      if (!child._destroyed) {
        console.error(child);
        throw new Error(`child was not properly destroyed.`);
      }
    }
    this._children.splice(0);
    this._destroy();
    this._destroyed = true;
  }

  dump () {
    const _ = this._dump ? this._dump() : this;
    const __ = this._children.map((child) => {
      return child.dump ? child.dump() : child;
    });
    return { _, __ };
  }
};

export {
  View
};
