const ABSOLUTE = 'absolute';
const CLASS_NAME = 'x-canvas-layer';

const EXPOSED_CANVAS_METHODS = ['newLayer', 'newVirtualLayer', 'purgeLayer'];
const EXPOSED_CANVAS_PROPS = ['surface', 'pixelRatio', 'scale', 'transform', 'center', 'offset', 'min', 'max'];

class CanvasLayer {
  constructor (canvas, name, size, position, zIndex, viewport) {
    this._canvas = canvas;

    this.name = name;
    this.size = size = size || {};
    this.position = position;
    this.zIndex = zIndex;
    this.viewport = viewport;

    this._views = [];
    this._viewIndex = 0;

    this.size.w = canvas.width;
    this.size.h = canvas.height;

    this._element = document.createElement('canvas');
    this._element.classList.add(CLASS_NAME);
    this._element.setAttribute('data-x-layer', name);
    this.ctx = this._element.getContext('2d');

    EXPOSED_CANVAS_METHODS.forEach((method) => {
      this[method] = canvas[method].bind(canvas);
    });
    EXPOSED_CANVAS_PROPS.forEach((prop) => {
      Object.defineProperty(this, prop, { get: () => canvas[prop] });
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

  resize () {
    this.size.w = this._canvas.width;
    this.size.h = this._canvas.height;
    let position = this.position || {x: 0, y: 0};
    let zIndex = this.zIndex;
    this._element.width = this.size.w;
    this._element.height = this.size.h;
    this._element.style.position = ABSOLUTE;
    this._element.style.left = position.x + 'px';
    this._element.style.top = position.y + 'px';

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

  lineTo (x, y) {
    const pos = this.viewport.scalePoint({
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
    const pos = this.viewport.scalePoint({
      x,
      y
    });
    const size = this.viewport.scaleSize({
      w,
      h
    });
    this.ctx.fillRect(pos.x, pos.y, size.w, size.h);
  }
}

export {
  CanvasLayer
};
