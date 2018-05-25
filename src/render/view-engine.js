import { Emitter } from '../core/emitter';

class ViewEngine {
  constructor (dom) {
    this._dom = dom;

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

    this._childViews = [];
  }

  _prepareViewList (view) {
    // @todo defer to render time to prevent multiple sorts within a frame
    // @todo sort by layer
    // @todo view filtering/sleeping
    // @todo bind view z-index / layer changes and re-sort
    this._childViews.sort((a, b) => {
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

  get dom () {
    return this._dom;
  }

  // - objects

  add (obj) {
    const id = obj && `${obj._}:${obj.id}`;
    if (!obj.id || !obj._) {
      throw new Error(`Invalid obj: "${id}".`);
    }
    if (this._objects[id]) {
      throw new Error(`Duplicate obj: "${id}".`);
    }
    if (id) {
      this._objects[id] = obj;
    }
    this._collections[obj._].push(obj);
    if (obj._ === 'view' && obj.render) {
      this.addView(obj);
    }
    return obj;
  }

  _get (id) {
    if (!this._objects[id]) {
      throw new Error(`Unknown object: "${id}".`);
    }
    return this._objects[id];
  }

  get (id) {
    if (Array.isArray(id)) {
      return id.map(id => this._get(id));
    } else {
      return this._get(id);
    }
  }

  remove (id) {
    let obj;
    if (typeof id === 'string') {
      obj = this._objects[id];
    } else {
      obj = id;
      id = obj && `${obj._}:${obj.id}`;
    }
    if (obj) {
      const index = this._collections[obj._].indexOf(obj);
      if (index !== -1) {
        this._collections[obj._].splice(index, 1);
      }
      delete this._objects[id];
      if (obj._ === 'view' && obj.render) {
        this.removeView(obj);
      }
    }
    return obj;
  }

  purge (id) {
    const obj = this.remove(id);
    if (obj && obj.destroy) {
      obj.destroy();
    }
  }

  // - child views

  addView (child) {
    this._childViews.push(child);
    this._prepareViewList(child);
    return child;
  }

  removeView (child) {
    const index = this._childViews.indexOf(child);
    if (index !== -1) {
      this._childViews.splice(index, 1);
    }
  }

  purgeView (child) {
    this.removeView(child);
    child.destroy();
  }

  // - render

  render (time) {
    const containers = this._collections.container;
    const layers = this._collections.layer;
    const cameras = this._collections.camera;
    const views = this._collections.view;
    const childViews = this._childViews;

    for (let ix = 0; ix < views.length; ix++) {
      views[ix].update(time);
    }

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

    for (let ix = 0; ix < childViews.length; ix++) {
      const child = childViews[ix];
      if (child.active) {
        child.renderer.setTarget(child.viewport, child.layer);
        child.render(child.renderer);
      }
    }
  }

  resize () {
    const views = this._collections.view;
    for (let ix = 0; ix < views.length; ix++) {
      views[ix].resize();
    }
  }

  reset () {
    const objects = Object.values(this._objects);
    for (let key in this._collections) {
      for (let ix = 0; ix < this._collections[key].length; ix++) {
        let object = this._collections[key][ix];
        if (objects.indexOf(object) === -1) {
          objects.push(object);
        }
      }
    }
    const childViews = this._childViews;
    if (objects.length + childViews.length) {
      console.log(objects, childViews);
      throw new Error(`Not clean, contains ${objects.length} objects and ${childViews.length} child views`);
    }
  }

  destroy () {
    // @todo destroy
    // for (let name in this._layers) {
    //   this._layers[name].destroy();
    // }
    // for (let ix = 0; ix < this.)rootViews.length; ix++) {
    //   this._childViews[ix].destroy();
    // }
  }
}

export {
  ViewEngine
};
