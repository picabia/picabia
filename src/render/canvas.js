import { Emitter } from '../core/emitter';
import { CanvasLayer } from './canvas-layer';

const MODE_CONTAIN = 'contain';
const MODE_COVER = 'cover';
const VALID_MODES = [MODE_CONTAIN, MODE_COVER];
const ROOT_CLASS_NAME = 'x-canvas';
const SIZER_CLASS_NAME = 'x-canvas-size';
const SCALER_CLASS_NAME = 'x-canvas-scale';
const PX = 'px';
const PC_100 = '100%';
const DIV = 'div';
const FLEX = 'flex';
const CENTER = 'center';
const RELATIVE = 'relative';
const NONE = 'none';
const BLOCK = 'block';
const MAX_PIXELS = 800 * 600;

class Canvas {
  constructor (container, config) {
    this._container = container;
    config = config || {};
    this._ratio = config.ratio || 4 / 3;
    this._mode = config.mode || MODE_CONTAIN;
    this._maxPixels = config._maxPixels || MAX_PIXELS;

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);

    this.pixelRatio = null;
    this.width = null;
    this.height = null;
    this.scale = null;
    this.transform = null;

    if (!this._mode) {
      this._mode = VALID_MODES[0];
    } else if (VALID_MODES.indexOf(this._mode) === -1) {
      throw new Error(`Invalid mode: ${this._mode}`);
    }

    this._views = [];
    this._viewIndex = 0;

    this._layers = [];

    container.style.width = PC_100;
    container.style.height = PC_100;

    const root = document.createElement(DIV);
    root.classList.add(ROOT_CLASS_NAME);
    root.style.display = FLEX;
    root.style.alignItems = CENTER;
    root.style.justifyContent = CENTER;
    root.style.width = PC_100;
    root.style.height = PC_100;
    container.appendChild(root);
    this._root = root;

    const sizer = document.createElement(DIV);
    sizer.classList.add(SIZER_CLASS_NAME);
    root.appendChild(sizer);
    this._sizer = sizer;

    const scaler = document.createElement(DIV);
    scaler.classList.add(SCALER_CLASS_NAME);
    sizer.appendChild(scaler);
    this._scaler = scaler;

    this.resize();
  }

  static get MODE_COVER () {
    return MODE_COVER;
  }

  static get MODE_CONTAIN () {
    return MODE_CONTAIN;
  }

  // -- size

  appendChild (node) {
    this._scaler.appendChild(node);
  }

  // - layers

  addLayer (name, size, position, zIndex, viewport, virtual) {
    const layer = new CanvasLayer(this, name, size, position, zIndex, viewport);
    this._layers.push(layer);
    this._scaler.appendChild(layer._element);

    return layer;
  }

  addVirtualLayer () {
    const layer = new CanvasLayer(this);
    this._layers.push(layer);
    return layer;
  }

  removeLayer (layer) {
    const index = this._layers.indexOf(layer);
    if (index !== -1) {
      this._layers.splice(index, 1);
    }
  }

  // -- views

  addView (view, zIndex) {
    zIndex = zIndex || 0;
    const index = this._viewIndex++;
    this._views.push({ view, zIndex: zIndex || 0, index });
    this._views.sort((a, b) => a.zIndex - b.zIndex || a.index - b.index);
  }

  removeView (view) {
    const index = this._views.findIndex((item) => item.view === view);
    if (index !== -1) {
      this._views.splice(index, 1);
    }
  }

  // --

  render (delta, timestamp) {
    for (var ix = 0; ix < this._views.length; ix++) {
      if (this._views[ix].view.render) {
        this._views[ix].view.render(delta, timestamp);
      }
    }
    for (var ux = 0; ux < this._layers.length; ux++) {
      this._layers[ux].render(delta, timestamp);
    }
  }

  resize () {
    const sizer = this._sizer;
    const scaler = this._scaler;

    sizer.style.width = '';
    sizer.style.height = '';
    scaler.style.display = NONE;
    scaler.style.width = '';
    scaler.style.height = '';
    scaler.style.transform = '';

    this.pixelRatio = window.devicePixelRatio || 1;

    const clientWidth = this._container.clientWidth;
    const clientHeight = this._container.clientHeight;

    const clientRatio = clientWidth / clientHeight;
    const horizontallyBound = clientRatio < this._ratio;

    let cWidth;
    let cHeight;
    let width;
    let height;
    let transform;

    const _applyMaxPixels = (width, height, _maxPixels, ratio) => {
      const numPixels = width * height;
      if (numPixels > _maxPixels) {
        width = Math.ceil(Math.sqrt(_maxPixels * ratio));
        height = Math.ceil(width / ratio);
      }
      return {
        width, height
      };
    };

    if (this._mode === MODE_CONTAIN) {
      if (horizontallyBound) {
        // extra space top/bottom
        cWidth = clientWidth;
        cHeight = Math.round(cWidth / this._ratio);
      } else {
        // extra space left/right
        cHeight = clientHeight;
        cWidth = Math.round(cHeight * this._ratio);
      }
    } else {
      cWidth = clientWidth;
      cHeight = clientHeight;
      this._ratio = cWidth / cHeight;
    }

    ({width, height} = _applyMaxPixels(cWidth * this.pixelRatio, cHeight * this.pixelRatio, this._maxPixels, this._ratio));
    // the if is irrelevant when mode is cover
    if (horizontallyBound) {
      transform = clientWidth / width;
    } else {
      transform = clientHeight / height;
    }

    sizer.style.width = cWidth + PX;
    sizer.style.height = cHeight + PX;

    scaler.style.display = BLOCK;
    scaler.style.width = width + PX;
    scaler.style.height = height + PX;
    scaler.style.position = RELATIVE;

    if (transform) {
      scaler.style.transform = 'scale(' + transform + ', ' + transform + ')';
      scaler.style.transformOrigin = 'top left';
    }

    this.width = width;
    this.height = height;
    this.transform = transform;

    for (var ix = 0; ix < this._views.length; ix++) {
      if (this._views[ix].view.resize) {
        this._views[ix].view.resize();
      }
    }

    for (var ox = 0; ox < this._layers.length; ox++) {
      this._layers[ox].resize();
    }

    this._emitter.emit('resize');
  }

  destroy () {
    for (var ix = 0; ix < this._layers.length; ix++) {
      this._layers[ix].destroy();
    }
    this._root.remove();
  }
}

export {
  Canvas
};
