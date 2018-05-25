
const DIV = 'div';
const CLASS_NAME = 'x-dom-layer';
const DATA_NAME = 'data-x-layer';
const ABSOLUTE = 'absolute';

class DomLayer {
  constructor (id, container, options) {
    this._ = 'layer';
    this._id = id;

    options = options || {};
    this._autoResize = 'autoResize' in options || true;
    this._autoClear = 'autoClear' in options || true;
    this._pos = options.position || { x: 0, y: 0 };
    this._size = options.size || { w: 1, h: 1 };
    this._zIndex = options.zIndex;

    this._size = null;
    this._requiresResize = false;

    this._element = document.createElement(DIV);
    this._element.classList.add(CLASS_NAME);
    this._element.setAttribute(DATA_NAME, this._id);

    if (container) {
      this._setContainer(container);
    }
  }

  _containerResize () {
    this._requiresResize = true;
  };

  _setContainer (container) {
    if (this._container) {
      this._container.off('resize', this._containerResize);
    }
    this._container = container;
    if (container) {
      container.appendChild(this._element);
      if (this._autoResize) {
        this._requiresResize = true;
        this._container.on('resize', this._containerResize, this);
      }
    }
  }

  _resize () {
    this._size = {
      w: this._container.size.w,
      h: this._container.size.h
    };
    let position = this._pos || { x: 0, y: 0 };
    let size = this._size || { w: 1, h: 1 };
    let zIndex = this._zIndex;
    this._element.width = this._size.w;
    this._element.height = this._size.h;
    this._element.style.position = ABSOLUTE;
    this._element.style.left = `${position.x}px`;
    this._element.style.top = `${position.y}px`;
    this._element.style.width = `${size.w}px`;
    this._element.style.height = `${size.h}px`;

    if (zIndex) {
      this._element.style.zIndex = zIndex;
    }
  }

  // -- api

  get size () {
    return this._size;
  }

  get id () {
    return this._id;
  }

  get zIndex () {
    return this._zIndex;
  }

  get element () {
    return this._element;
  }

  setContainer (container) {
    this._setContainer(container);
  }

  setIndex (zIndex) {
    this._zIndex = zIndex;
    this._element.style.zIndex = zIndex;
  }

  appendChild (dom) {
    this._element.appendChild(dom);
  }

  // - view manager

  preRender () {
    if (this._requiresResize && this._container) {
      this._resize();
      this._requiresResize = false;
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
  DomLayer
};
