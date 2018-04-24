const CANVAS = 'canvas';
const ABSOLUTE = 'absolute';
const CLASS_NAME = 'x-canvas-layer';
const DATA_NAME = 'data-x-layer';
const PX = 'px';

const EXPOSED_CANVAS_METHODS = ['addLayer', 'addVirtualLayer', 'removeLayer'];

class CanvasLayer {
  constructor (canvas, name, size, position, zIndex, viewport) {
    this._canvas = canvas;

    this._name = name;
    this._size = size = size || {};
    this._pos = position;
    this._zIndex = zIndex;
    this._viewport = viewport;

    this._views = [];
    this._viewIndex = 0;

    this._size.w = canvas.width;
    this._size.h = canvas.height;

    this._element = document.createElement(CANVAS);
    this._element.classList.add(CLASS_NAME);
    this._element.setAttribute(DATA_NAME, name);
    this.ctx = this._element.getContext('2d');

    EXPOSED_CANVAS_METHODS.forEach((method) => {
      this[method] = canvas[method].bind(canvas);
    });

    this.resize();
  }

  // -- api

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

  resize () {
    this._size.w = this._canvas.width;
    this._size.h = this._canvas.height;
    let position = this._pos || {x: 0, y: 0};
    let zIndex = this._zIndex;
    this._element.width = this._size.w;
    this._element.height = this._size.h;
    this._element.style.position = ABSOLUTE;
    this._element.style.left = position.x + PX;
    this._element.style.top = position.y + PX;

    if (zIndex) {
      this._element.style.zIndex = zIndex;
    }

    for (var ix = 0; ix < this._views.length; ix++) {
      if (this._views[ix].view.resize) {
        this._views[ix].view.resize();
      }
    }
  }

  render (delta, timestamp) {
    for (var ix = 0; ix < this._views.length; ix++) {
      if (this._views[ix].view.render) {
        this._views[ix].view.render(this, delta, timestamp);
      }
    }
  }

  destroy () {
    this._canvas.purgeLayer(this);
    this._element.remove();
    this._canvas = null;
    this._viewport = null;
  }

  // -- drawing

  setFillStyle (style) {
    this.ctx.fillStyle = style;
  };

  setStrokeWidth (width) {
    this.ctx.lineWidth = width;
  };

  setStrokeStyle (style) {
    this.ctx.strokeStyle = style;
  };

  clear () {
    this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  beginPath () {
    this.ctx.beginPath();
  }

  moveTo (x, y) {
    const pos = this._viewport.scalePoint({
      x,
      y
    });
    this.ctx.moveTo(pos.x, pos.y);
  }

  lineTo (x, y) {
    const pos = this._viewport.scalePoint({
      x,
      y
    });
    this.ctx.lineTo(pos.x, pos.y);
  }

  fill () {
    this.ctx.fill();
  }

  stroke () {
    this.ctx.stroke();
  }

  fillRect (x, y, w, h) {
    const pos = this._viewport.scalePoint({
      x,
      y
    });
    const size = this._viewport.scaleSize({
      w,
      h
    });
    this.ctx.fillRect(pos.x, pos.y, size.w, size.h);
  }
}

export {
  CanvasLayer
};
