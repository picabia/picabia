import { Emitter } from '../core/emitter';

class ViewManager {
  constructor () {
    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);

    this._objects = {};

    this._collections = {
      container: [],
      viewport: [],
      camera: [],
      renderer: [],
      layer: [],
      view: []
    };
  }

  _newView (view) {
    // @todo sort by layer
    // @todo view filtering/sleeping
    // @todo bind view z-index / layer changes and re-sort
    this._collections.view.sort((a, b) => {
      if (a.layer === b.layer) {
        return a.zIndex - b.zIndex;
      } else {
        const aIndex = a.layer ? a.layer.zIndex : 0;
        const bIndex = b.layer ? b.layer.zIndex : 0;
        return aIndex - bIndex;
      }
    });
  }

  // -- api

  // - objects

  add (obj) {
    if (this._objects[obj.name]) {
      throw new Error(`Duplicate obj: "${obj._}:${obj.name}".`);
    }
    if (!obj.name && !obj._) {
      throw new Error(`Invalid obj: "${obj._}:${obj.name}".`);
    }
    if (obj.name) {
      this._objects[obj.name] = obj;
    }
    if (obj._) {
      this._collections[obj._].push(obj);
      if (obj._ === 'view') {
        this._newView(obj);
      }
    }
  }

  get (name) {
    if (!this._objects[name]) {
      throw new Error(`Unknown object: "${name}".`);
    }
    return this._objects[name];
  }

  remove (name) {
    let obj;
    if (typeof name === 'string') {
      obj = this._objects[name];
    } else {
      obj = name;
      name = obj && obj.name;
    }
    if (obj && obj._) {
      const index = this._collections[obj._].indexOf(obj);
      if (index !== -1) {
        this._collections[obj._].splice(index, 1);
      }
    }
    if (name) {
      delete this._objects[name];
    }
  }

  // - render

  render (rootView, time) {
    const containers = this._collections.container;
    const layers = this._collections.layer;
    const cameras = this._collections.camera;
    const views = this._collections.view;

    // @todo order+cache by container zIndex
    for (let ix = 0; ix < containers.length; ix++) {
      containers[ix].preRender(time);
    }

    // @todo order+cache by layer zIndex
    for (let ix = 0; ix < layers.length; ix++) {
      layers[ix].preRender(time);
    }

    // @todo order+cache by layer zIndex
    for (let ix = 0; ix < cameras.length; ix++) {
      cameras[ix].preRender(time);
    }

    rootView.update(time);

    for (let ux = 0; ux < views.length; ux++) {
      const view = views[ux];
      if (view.renderer) {
        view.renderer.setTarget(view.viewport, view.layer);
        view.render(time);
      }
    }
  }

  resize () {
    for (let ox = 0; ox < this._views.length; ox++) {
      this._views[ox].resize();
    }
  }

  destroy () {
    // @todo destroy
    // for (let name in this._layers) {
    //   this._layers[name].destroy();
    // }
    // for (let ox = 0; ox < this._views.length; ox++) {
    //   this._views[ox].destroy();
    // }
    // for (let ux = 0; ux < this._views.length; ux++) {
    //   this._views[ux].destroy();
    // }
    this._root.remove();
  }
}

export {
  ViewManager
};
