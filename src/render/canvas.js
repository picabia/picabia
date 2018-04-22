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

class Canvas {
  constructor (container, config) {
    this._container = container;
    config = config || {};
    this.ratio = config.ratio || 4 / 3;
    this.scaleAxis = config.scaleAxis || 'width';
    this.mode = config.mode || Canvas.MODE_CONTAIN;
    this.maxPixels = config.maxPixels || 800 * 600;

    this.pixelRatio = null;
    this.width = null;
    this.height = null;
    this.scale = null;
    this.transform = null;
    this.center = null;

    if (!this.mode) {
      this.mode = VALID_MODES[0];
    } else if (VALID_MODES.indexOf(this.mode) === -1) {
      throw new Error('Invalid mode "' + this.mode + '"');
    }

    this._layers = [];
    this._layersByName = {};

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

  // - layers

  newLayer (name, size, position, zIndex, viewport, virtual) {
    const layer = new CanvasLayer(this, name, size, position, zIndex, viewport);
    this._layers.push(layer);
    if (!virtual) {
      this._scaler.appendChild(layer._element);
    }

    return layer;
  }

  newVirtualLayer (name, size, position, zIndex, viewport) {
    return this.newLayer(name, size, position, zIndex, viewport, true);
  }

  purgeLayer (layer) {
    const index = this._layers.indexOf(layer);
    if (index !== -1) {
      this._layers.splice(index, 1);
    }
  }

  // -- size

  // 800 / 450 = 1.7777
  // 800 / 600 = 1.3333

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
    const horizontallyBound = clientRatio < this.ratio;

    let cWidth;
    let cHeight;
    let width;
    let height;
    let transform;

    const applyMaxPixels = (width, height, maxPixels, ratio) => {
      const numPixels = width * height;
      if (numPixels > maxPixels) {
        width = Math.ceil(Math.sqrt(maxPixels * ratio));
        height = Math.ceil(width / ratio);
      }
      return {
        width, height
      };
    };

    if (this.mode === MODE_CONTAIN) {
      if (horizontallyBound) {
        // extra space top/bottom
        cWidth = clientWidth;
        cHeight = Math.round(cWidth / this.ratio);
      } else {
        // extra space left/right
        cHeight = clientHeight;
        cWidth = Math.round(cHeight * this.ratio);
      }
    } else {
      cWidth = clientWidth;
      cHeight = clientHeight;
      this.ratio = cWidth / cHeight;
    }

    ({width, height} = applyMaxPixels(cWidth * this.pixelRatio, cHeight * this.pixelRatio, this.maxPixels, this.ratio));
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
    // this.center = {x: Math.round(max.x / 2), y: Math.round(max.y / 2)};

    for (var ix = 0; ix < this._layers.length; ix++) {
      this._layers[ix].resize();
    }
  }

  appendChild (node) {
    this._scaler.appendChild(node);
  }

  render (delta, timestamp) {
    for (var ix = 0; ix < this._layers.length; ix++) {
      this._layers[ix].render(delta, timestamp);
    }
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
