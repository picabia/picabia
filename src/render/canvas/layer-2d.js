
const CANVAS = 'canvas';
const CLASS_NAME = 'x-canvas-layer';
const DATA_NAME = 'data-x-layer';
const ABSOLUTE = 'absolute';
const PX = 'px';

class CanvasLayer2d {
  constructor (name, options) {
    this._size = null;
    this._name = name;

    options = options || {};
    this._autoResize = 'autoResize' in options || true;
    this._autoClear = 'autoClear' in options || true;
    this._pos = options.position || { x: 0, y: 0 };
    this._zIndex = options.zIndex;

    this._element = document.createElement(CANVAS);
    this._element.classList.add(CLASS_NAME);
    this._element.setAttribute(DATA_NAME, this._name);
    this._ctx = this._element.getContext('2d');

    this._containerResize = (size) => {
      this.setSize(size);
    };
  }

  get size () {
    return this._size;
  }

  get name () {
    return this._name;
  }

  get zIndex () {
    return this._zIndex;
  }

  get element () {
    return this._element;
  }

  get ctx () {
    return this._ctx;
  }

  setContainer (container) {
    if (this._container) {
      this._container.off('resize', this._containerResize);
    }
    this._container = container;
    if (container) {
      container.appendChild(this._element);
      if (this._autoResize) {
        this.setSize(container.size);
        this._container.on('resize', this._containerResize);
      }
    }
  }

  setName (name) {
    this._element.setAttribute(DATA_NAME, this._name);
  }

  setIndex (name) {
    this._element.setAttribute(DATA_NAME, this._name);
  }

  addView (view, zIndex) {
    zIndex = zIndex || 0;
    const index = this._viewIndex++;
    this._views.push({ view, zIndex: zIndex || 0, index });
    this._views.sort((a, b) => a.zIndex - b.zIndex || a.index - b.index);
  }

  removeView (view) {
    // @todo use for instead of findIndex
    const index = this._views.findIndex((item) => item.view === view);
    if (index !== -1) {
      this._views.splice(index, 1);
    }
  }

  preRender () {
    if (this._autoClear) {
      this._ctx.clearRect(0, 0, this._size.w, this._size.h);
    }
  }

  setSize (size) {
    this._size = size;
    let position = this._pos || { x: 0, y: 0 };
    let zIndex = this._zIndex;
    this._element.width = this._size.w;
    this._element.height = this._size.h;
    this._element.style.position = ABSOLUTE;
    this._element.style.left = position.x + PX;
    this._element.style.top = position.y + PX;

    if (zIndex) {
      this._element.style.zIndex = zIndex;
    }
  }

  destroy () {
    this._element.remove();
    if (this._container) {
      this._container.off('resize', this._containerResize);
    }
  }
}

export {
  CanvasLayer2d
};
