class CanvasRenderer2d {
  // @todo round values before painting? research performance/visual impact of sub-pixel rendering - maybe make this optional
  constructor (id) {
    this._ = 'renderer';
    this._id = id;
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
  get id () {
    return this._id;
  }

  setTarget (viewport, layer) {
    this._viewport = viewport;
    this._layer = layer;
    this._ctx = layer.ctx;
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

  arc (x, y, radius, startAngle, endAngle) {
    const pos = this._viewport.scalePoint({
      x,
      y
    });
    radius = this._viewport.scaleValue(radius);
    // startAngle = this._viewport.scaleAngle(startAngle);
    // endAngle = this._viewport.scaleAngle(endAngle);
    this._ctx.arc(pos.x, pos.y, radius, startAngle, endAngle);
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

  drawImage (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    if (!(this._viewport.angle + this._viewport.rotation)) {
      const destination = this._viewport.scalePoint({ x: dx, y: dy });
      const opposite = this._viewport.scalePoint({ x: dx + dWidth, y: dy + dHeight });
      const size = { w: opposite.x - destination.x, h: opposite.y - destination.y };
      this._ctx.drawImage(image, sx, sy, sWidth, sHeight, destination.x, destination.y, size.w, size.h);
      return;
    }

    const center = this._viewport.scalePoint({ x: dx + dWidth / 2, y: dy + dHeight / 2 });
    const size = this._viewport.scaleSize({ w: dWidth, h: dHeight });
    const angleInRadians = this._viewport.angle + this._viewport.rotation;
    this._ctx.translate(center.x, center.y);
    this._ctx.rotate(angleInRadians);
    this._ctx.drawImage(image, sx, sy, sWidth, sHeight, -size.w / 2, -size.h / 2, size.w, size.h);
    this._ctx.rotate(-angleInRadians);
    this._ctx.translate(-center.x, -center.y);
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

  setFont (pixels, font) {
    this._ctx.font = this._viewport.scaleText(pixels) + 'px ' + (font || '');
  }

  setTextAlign (align) {
    this._ctx.textAlign = align;
  }

  setTextBaseline (baseline) {
    this._ctx.textBaseline = baseline;
  }

  measureText (text) {
    return this._ctx.measureText(text);
  }

  fillText (text, x, y) {
    const point = this._viewport.scalePoint({ x, y });
    this._ctx.fillText(text, point.x, point.y);
  }
}

export {
  CanvasRenderer2d
};
