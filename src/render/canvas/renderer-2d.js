class CanvasRenderer2d {
  constructor (name) {
    this._name = name;
  }

  _getRectPoints (x, y, w, h) {
    const points = [];
    points[0] = this._viewport.scalePoint({ x, y });
    points[1] = this._viewport.scalePoint({ x: x + w, y });
    points[2] = this._viewport.scalePoint({ x: x + w, y: y + h });
    points[3] = this._viewport.scalePoint({ x, y: y + h });
    return points;
  }

  // -- api
  get name () {
    return this._name;
  }

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

  strokeRect (x, y, w, h) {
    // @todo optimize if viewport at 0, PI/2, PI, ...
    const points = this._getRectPoints(x, y, w, h);
    this._ctx.beginPath();
    this._ctx.moveTo(points[0].x, points[0].y);
    this._ctx.lineTo(points[1].x, points[1].y);
    this._ctx.lineTo(points[2].x, points[2].y);
    this._ctx.lineTo(points[3].x, points[3].y);
    this._ctx.lineTo(points[0].x, points[0].y);
    this._ctx.stroke();
  }

  fillRect (x, y, w, h) {
    // @todo optimize if viewport at 0, PI/2, PI, ...
    const points = this._getRectPoints(x, y, w, h);
    this._ctx.beginPath();
    this._ctx.moveTo(points[0].x, points[0].y);
    this._ctx.lineTo(points[1].x, points[1].y);
    this._ctx.lineTo(points[2].x, points[2].y);
    this._ctx.lineTo(points[3].x, points[3].y);
    this._ctx.fill();
  }
}

export {
  CanvasRenderer2d
};
