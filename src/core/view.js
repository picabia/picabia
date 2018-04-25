class View {
  constructor (vm, renderer, layer, viewport) {
    this._vm = vm;

    this._renderer = renderer && this._vm.getRenderer(renderer);
    this._layer = layer && this._vm.getLayer(layer);
    this._viewport = viewport && this._vm.getViewport(viewport);

    this._children = [];
    this._childIndex = 0;
  }

  set renderer (renderer) {
    this._renderer = this._vm.getRenderer(renderer);
  }

  get renderer () {
    return this._renderer;
  }

  set layer (layer) {
    this._layer = this._vm.getLayer(layer);
  }

  get layer () {
    return this._layer;
  }

  set zIndex (zIndex) {
    this._zIndex = zIndex;
  }

  get zIndex () {
    return this._zIndex;
  }

  set viewport (viewport) {
    this._viewport = this._vm.getViewport(viewport);
  }

  get viewport () {
    return this._viewport;
  }

  _constructor () {}

  _addChild (child) {
    this._children.push(child);
  }

  _removeChild (child) {
    const index = this._children.indexOf(child);
    if (index !== -1) {
      this._children.splice(index, 1);
    }
  }

  _destroyChild (child) {
    this._removeChild(child);
    child.destroy();
  }

  // -- public

  getChildren () {
    return this._children;
  }

  resize () {
    this._resize();
    for (let ix = 0; ix < this._children.length; ix++) {
      this._children[ix].obj.resize();
    }
    this._postResize();
  }

  preRender () {}

  render () {}

  destroy () {
    this._destroy();
    for (let ix = 0; ix < this._children.length; ix++) {
      const child = this._children[ix].obj;
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
      return child.obj.dump ? child.obj.dump() : child.obj;
    });
    return { _, __ };
  }
};

export {
  View
};
