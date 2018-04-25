class CanvasRenderer2d {
  constructor (name) {
    this._name = name;
  }

  get name () {
    return this._name;
  }

  // -- api

  setTarget (layer, viewport) {
    this._layer = layer;
    this._ctx = layer.ctx;
    this._viewport = viewport;
  }

  setFillStyle (style) {
    this._ctx.fillStyle = style;
  };

  setStrokeWidth (width) {
    this._ctx.lineWidth = width;
  };

  setStrokeStyle (style) {
    this._ctx.strokeStyle = style;
  };

  clear () {
    this._ctx.clearRect(0, 0, this._canvasLayer.size.w, this._canvasLayer.size.h);
  }

  beginPath () {
    this._ctx.beginPath();
  }

  moveTo (x, y) {
    const pos = this._viewport.scalePoint({
      x,
      y
    });
    this._ctx.moveTo(pos.x, pos.y);
  }

  lineTo (x, y) {
    const pos = this._viewport.scalePoint({
      x,
      y
    });
    this._ctx.lineTo(pos.x, pos.y);
  }

  fill () {
    this._ctx.fill();
  }

  stroke () {
    this._ctx.stroke();
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
    this._ctx.fillRect(pos.x, pos.y, size.w, size.h);
  }
}

export {
  CanvasRenderer2d
};
