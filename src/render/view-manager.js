import { Emitter } from '../core/emitter';

class ViewManager {
  constructor (container) {
    this._container = container;

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);

    this._containers = {};
    this._viewports = {};
    this._renderers = {};
    this._layers = {};

    this._views = [];
    this._viewIndex = 0;

    this.resize();
  }

  // - containers

  addContainer (container) {
    if (this._containers[container.name]) {
      throw new Error(`Duplicate container: "${container.name}".`);
    }
    this._containers[container.name] = container;
  }

  getContainer (name) {
    if (!this._containers[name]) {
      throw new Error(`Unknown container: "${name}".`);
    }
    return this._containers[name];
  }

  removeContainer (name) {
    delete this._containers[name];
  }

  // - viewports

  addViewport (viewport) {
    if (this._viewports[viewport.name]) {
      throw new Error(`Duplicate viewport: "${viewport.name}".`);
    }
    this._viewports[viewport.name] = viewport;
  }

  getViewport (name) {
    if (!this._viewports[name]) {
      throw new Error(`Unknown viewport: "${name}".`);
    }
    return this._viewports[name];
  }

  removeViewport (name) {
    delete this._viewports[name];
  }

  // - renderers

  addRenderer (renderer) {
    if (this._renderers[renderer.name]) {
      throw new Error(`Duplicate renderer: "${renderer.name}".`);
    }
    this._renderers[renderer.name] = renderer;
  }

  getRenderer (name) {
    if (!this._renderers[name]) {
      throw new Error(`Unknown renderer: "${name}".`);
    }
    return this._renderers[name];
  }

  removeRenderer (name) {
    delete this._renderers[name];
  }

  // - layers

  addLayer (containerName, layer) {
    if (!this._containers[containerName]) {
      throw new Error(`Unknown container: "${containerName}".`);
    }
    if (this._layers[layer.name]) {
      throw new Error(`Duplicate name: "${layer.name}".`);
    }
    this._layers[layer.name] = layer;
    this._containers[containerName].appendChild(layer.element);
    layer.resize(this._containers[containerName].size);
  }

  getLayer (name) {
    if (!this._layers[name]) {
      throw new Error(`Unknown name: "${name}".`);
    }
    return this._layers[name];
  }

  removeLayer (name) {
    delete this._layers[name];
  }

  // -- views

  addView (view) {
    this._views.push(view);
  }

  createView (Constructor, args, renderer, layer, viewport) {
    const view = new Constructor(this, renderer, layer, viewport);
    view._constructor(...args);
    this._views.push(view);
  }

  removeView (obj) {
    const index = this._views.indexOf(obj);
    if (index !== -1) {
      this._views.splice(index, 1);
    }
  }

  // --

  render (delta, timestamp) {
    // ??? clear? for (let ix = 0; ix < this._layers.length; ix++) {
    //   this._layers[ix].render(delta, timestamp);
    // }

    const views = [];
    this._views.forEach((view) => {
      views.push(view);
      views.push(...view.getChildren());
    });

    views.sort((a, b) => {
      if (a.layer === b.layer) {
        return a.zIndex - b.zIndex;
      } else {
        const aLayerIndex = this._layers[a.layer] ? this._layers[a.layer].zIndex : 0;
        const bLayerIndex = this._layers[b.layer] ? this._layers[b.layer].zIndex : 0;
        return aLayerIndex - bLayerIndex;
      }
    });

    for (let name in this._layers) {
      this._layers[name].preRender(delta, timestamp);
    }
    for (let ox = 0; ox < this._views.length; ox++) {
      const view = this._views[ox];
      if (view.renderer) {
        view.renderer.setTarget(view.layer, view.viewport);
        view.preRender(delta, timestamp);
      }
    }
    for (let ux = 0; ux < this._views.length; ux++) {
      const view = this._views[ux];
      if (view.renderer) {
        view.renderer.setTarget(view.layer, view.viewport);
        view.render(delta, timestamp);
      }
    }
  }

  resize () {
    for (let ix = 0; ix < this._layers.length; ix++) {
      this._layers[ix].resize();
    }

    for (let ox = 0; ox < this._views.length; ox++) {
      this._views[ox].resize();
    }
  }

  destroy () {
    // for (let layerName in this._layers.length; ix++) {
    //   this._layers[ix].destroy();
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
