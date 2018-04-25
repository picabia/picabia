import { Emitter } from '../core/emitter';

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

class Container {
  constructor (name, dom, options) {
    this._name = name;
    this._dom = dom;
    options = options || {};
    this._ratio = options.ratio || 4 / 3;
    this._mode = options.mode || MODE_CONTAIN;
    this._maxPixels = options._maxPixels || MAX_PIXELS;

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);

    this.pixelRatio = null;
    this._size = {
      w: null,
      h: null
    };
    this._transform = null;

    if (!this._mode) {
      this._mode = VALID_MODES[0];
    } else if (VALID_MODES.indexOf(this._mode) === -1) {
      throw new Error(`Invalid mode: ${this._mode}`);
    }

    dom.style.width = PC_100;
    dom.style.height = PC_100;

    const root = document.createElement(DIV);
    root.classList.add(ROOT_CLASS_NAME);
    root.style.display = FLEX;
    root.style.alignItems = CENTER;
    root.style.justifyContent = CENTER;
    root.style.width = PC_100;
    root.style.height = PC_100;
    dom.appendChild(root);
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

  get name () {
    return this._name;
  }

  get size () {
    return this._size;
  }

  appendChild (node) {
    this._scaler.appendChild(node);
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

    const clientWidth = this._dom.clientWidth;
    const clientHeight = this._dom.clientHeight;

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

    this._size = { w: width, h: height };
    this._transform = transform;

    this._emitter.emit('resize', this._size);
  }

  destroy () {
    this._emitter.destroy();
    this._root.remove();
  }
}

export {
  Container
};
