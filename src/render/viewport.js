import { rotateVector } from '../maths/geometry';

class Viewport {
  constructor (x, y, w, h) {
    this._pos = {
      x,
      y
    };
    this._size = {
      w,
      h
    };
    this._angle = 0;
    this._scale = 1;
  }

  // -- public

  setPos (pos) {
    this._pos = pos;
  }

  setScale (scale) {
    this._scale = scale;
  }

  setAngle (radians) {
    this._angle = radians;
  }

  getOrigin () {
    return {
      x: this._pos.x - this._size.w / 2,
      y: this._pos.y - this._size.h / 2
    };
  }

  scaleValue (val) {
    return Math.round(this._scale * val);
  }

  scaleArray (arr) {
    return arr.map((val) => Math.round(this._scale * val));
  }

  scalePoint (point) {
    const rotated = rotateVector(point, this._angle, this._pos);
    const origin = this.getOrigin();
    const scaled = {
      x: Math.round(this._scale * (rotated.x - origin.x)),
      y: Math.round(this._scale * (rotated.y - origin.y))
    };
    return scaled;
  }

  scalePath (path) {
    return path.map((point) => this.scalePoint(point));
  }

  scaleSize (size) {
    return {
      w: Math.round(this._scale * (size.w + 1)),
      h: Math.round(this._scale * (size.h + 1))
    };
  }
}

export {
  Viewport
};
