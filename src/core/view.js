class View {
  constructor (vm, args, renderer, viewport, layer, zIndex) {
    this._vm = vm;

    this._renderer = renderer && this._vm.getRenderer(renderer);
    this._viewport = viewport && this._vm.getViewport(viewport);
    this._layer = layer && this._vm.getLayer(layer);
    this._zIndex = zIndex || 0;

    this._children = [];
    this._childIndex = 0;

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

  // -- overridable

  _constructor () {}

  _resize () {}

  _postResize () {}

  _preRender (delta, timestamp) {}

  _render (delta, timestamp) {}

  // -- private

  _createChild (Constructor, args, renderer, viewport, layer, zIndex) {
    const child = this._vm.createView(Constructor, args, renderer, viewport, layer, zIndex);
    this._children.push(child);
  }

  _removeChild (child) {
    const index = this._children.indexOf(child);
    if (index !== -1) {
      this._vm.removeView(child);
      this._children.splice(index, 1);
    }
  }

  _destroyChild (child) {
    this._removeChild(child);
    child.destroy();
  }

  // -- public

  resize () {
    this._resize();
    for (let ix = 0; ix < this._children.length; ix++) {
      this._children[ix].resize();
    }
    this._postResize();
  }

  preRender (delta, timestamp) {
    this._preRender(delta, timestamp);
    for (let ix = 0; ix < this._children.length; ix++) {
      this._children[ix].preRender(delta, timestamp);
    }
  }

  render (delta, timestamp) {
    this._render(delta, timestamp);
  }

  destroy () {
    this._destroy();
    for (let ix = 0; ix < this._children.length; ix++) {
      const child = this._children[ix];
      child.destroy();
      if (!child._destroyed) {
        console.error(child);
        throw new Error(`child was not properly destroyed.`);
      }
    }
    this._children.splice(0);
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
