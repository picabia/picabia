import { Emitter } from '../core/emitter';

class ViewManager {
  constructor () {
    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);

    this._containers = {};
    this._viewports = {};
    this._renderers = {};
    this._layers = {};

    this._views = [];
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

  getViewports () {
    return Object.values(this._viewports);
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
      throw new Error(`Duplicate layer: "${layer.name}".`);
    }
    const container = this._containers[containerName];
    this._layers[layer.name] = layer;
    layer.setContainer(container);
  }

  getLayer (name) {
    if (!this._layers[name]) {
      throw new Error(`Unknown layer: "${name}".`);
    }
    return this._layers[name];
  }

  removeLayer (name) {
    if (!this._layers[name]) {
      throw new Error(`Unknown layer: "${name}".`);
    }
    this._layers[name].setContainer();
    delete this._layers[name];
  }

  // -- views

  addView (view) {
    this._views.push(view);
  }

  createView (Constructor, args, renderer, viewport, layer, zIndex) {
    const view = new Constructor(this, args, renderer, viewport, layer, zIndex);
    this._views.push(view);
    return view;
  }

  removeView (obj) {
    const index = this._views.indexOf(obj);
    if (index !== -1) {
      this._views.splice(index, 1);
    }
  }

  // -- render

  render (rootView, delta, timestamp) {
    const views = [...this._views];

    // @todo view filtering/sleeping

    // @todo cache sorting, re-sort on events
    views.sort((a, b) => {
      if (a.layer === b.layer) {
        return a.zIndex - b.zIndex;
      } else {
        const aIndex = a.layer ? a.layer.zIndex : 0;
        const bIndex = b.layer ? b.layer.zIndex : 0;
        return aIndex - bIndex;
      }
    });

    // @todo order+cache by layer zIndex
    for (let name in this._layers) {
      this._layers[name].preRender(delta, timestamp);
    }

    rootView.preRender(delta, timestamp);

    for (let ux = 0; ux < this._views.length; ux++) {
      const view = this._views[ux];
      if (view.renderer) {
        view.renderer.setTarget(view.viewport, view.layer);
      }
      view.render(delta, timestamp);
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
