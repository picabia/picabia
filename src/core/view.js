class View {
  constructor (vm, args, renderer, viewport, layer, zIndex) {
    this._ = 'view';
    this._vm = vm;

    this._renderer = renderer && this._vm.get(renderer, 'renderer');
    this._viewport = viewport && this._vm.get(viewport, 'viewport');
    this._layer = layer && this._vm.get(layer, 'layer');
    this._zIndex = zIndex || 0;

    this._children = [];
    this._childIndex = 0;

    this._requiresResize = false;

    this._time = {
      i: undefined,
      t: undefined,
      d: undefined
    };

    this._constructor(...args);
  }

  setRenderer (name) {
    this._renderer = this._vm.getRenderer(name);
  }

  get renderer () {
    return this._renderer;
  }

  setViewport (name) {
    this._viewport = this._vm.getViewport(name);
  }

  get viewport () {
    return this._viewport;
  }

  setLayer (name) {
    this._layer = this._vm.getLayer(name);
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

  _init (time) {
    this._preInit();
    for (let ix = 0; ix < this._children.length; ix++) {
      this._children[ix]._init(time);
    }
    this._postInit();
  }

  // -- private

  _createChild (Constructor, args, renderer, viewport, layer, zIndex) {
    const child = new Constructor(this._vm, args, renderer, viewport, layer, zIndex);
    this._children.push(child);
    this._vm.add(child);
  }

  _removeChild (child) {
    const index = this._children.indexOf(child);
    if (index !== -1) {
      this._vm.remove(child);
      this._children.splice(index, 1);
    }
  }

  _destroyChild (child) {
    this._removeChild(child);
    child.destroy();
  }

  // -- overridable

  _constructor () {}

  _preInit () {}

  _postInit () {}

  _preResize () {}

  _postResize () {}

  _preUpdate () {}

  _postUpdate () {}

  _render () {}

  _destroy () {}

  // -- public

  get time () {
    return {
      t: this._time.t,
      d: this._time.d || 0
    };
  }

  resize () {
    this._requiresResize = true;
  }

  update (time) {
    if (this._time.i === undefined) {
      this._time.i = time.t;
      this._time.t = time.t;
      this._init(time);
    }
    this._time.t = time.t;
    this._time.d = time.d;

    if (this._requiresResize) {
      this._requiresResize = false;
      this._preResize();
      for (let ix = 0; ix < this._children.length; ix++) {
        this._children[ix].resize();
      }
      this._postResize();
    }

    this._preUpdate();
    for (let ix = 0; ix < this._children.length; ix++) {
      this._children[ix].update(time);
    }
    this._postUpdate();
  }

  render () {
    this._render();
  }

  destroy () {
    for (let ix = 0; ix < this._children.length; ix++) {
      const child = this._children[ix];
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
