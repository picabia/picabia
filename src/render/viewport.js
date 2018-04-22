import { Geometry } from '../maths/geometry';

class Viewport {
  constructor (pos, size, angle, scale) {
    this._pos = pos || { x: 0, y: 0 };
    this._size = size || { w: 0, h: 0 };
    this._angle = angle || 0;
    this._scale = 1;
  }

  // -- public

  setPos (pos) {
    this._pos = pos;
  }

  setSize (size) {
    this._size = size;
  }

  setAngle (radians) {
    this._angle = radians;
  }

  setScale (scale) {
    this._scale = scale;
  }

  scaleValue (val) {
    return Math.round(this._scale * val);
  }

  scaleArray (arr) {
    return arr.map((val) => Math.round(this._scale * val));
  }

  scaleSize (size) {
    return {
      w: Math.round(this._scale * (size.w + 1)),
      h: Math.round(this._scale * (size.h + 1))
    };
  }

  _scalePoint (point, origin) {
    const rotated = Geometry.rotateVector(point, this._angle, this._pos);
    return {
      x: Math.round(this._scale * (rotated.x - origin.x)),
      y: Math.round(this._scale * (rotated.y - origin.y))
    };
  }

  scalePoint (point) {
    const origin = {
      x: this._pos.x - this._size.w / 2,
      y: this._pos.y - this._size.h / 2
    };
    return this._scalePoint(point, origin);
  }

  scalePoints (points) {
    const origin = {
      x: this._pos.x - this._size.w / 2,
      y: this._pos.y - this._size.h / 2
    };
    return points.map((point) => this.scalePoint(point, origin));
  }
}

export {
  Viewport
};
