import { Geometry } from '../maths/geometry';
import { Emitter } from '../core/emitter';

class Viewport {
  // @todo do not round scaled values
  constructor (id, options, constraints) {
    this._ = 'viewport';
    this._id = id;
    options = options || {};
    this._pos = options.pos || { x: 0, y: 0 };
    this._size = options.size || { w: 0, h: 0 };
    this._rotation = options.rotation || 0;
    this._angle = options.angle || 0;
    this._scale = options.scale || 1;
    this._zoom = options.zoom || 1;

    constraints = constraints || {};
    this._c = constraints;
    constraints.pos = constraints.pos || {};
    constraints.pos.min = constraints.pos.min || { x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER };
    constraints.pos.max = constraints.pos.max || { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER };
    constraints.size = constraints.size || {};
    constraints.size.min = constraints.size.min || { w: 0, h: 0 };
    constraints.size.max = constraints.size.max || { w: Number.MAX_SAFE_INTEGER, h: Number.MAX_SAFE_INTEGER };
    constraints.rotation = constraints.rotation || {};
    constraints.rotation.min = constraints.rotation.min || -Math.PI * 2;
    constraints.rotation.max = constraints.rotation.max || Math.PI * 2;
    constraints.angle = constraints.angle || {};
    constraints.angle.min = constraints.angle.min || -Math.PI * 2;
    constraints.angle.max = constraints.angle.max || Math.PI * 2;
    constraints.scale = constraints.scale || {};
    constraints.scale.min = constraints.scale.min || 0.1;
    constraints.scale.max = constraints.scale.max || 1000;
    constraints.zoom = constraints.zoom || {};
    constraints.zoom.min = constraints.zoom.min || 0.1;
    constraints.zoom.max = constraints.zoom.max || 1000;

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);
  }

  get id () {
    return this._id;
  }

  setPos (pos) {
    if (Number.isNaN(pos.x) || Number.isNaN(pos.y)) {
      throw new Error();
    }
    this._pos = {
      x: Math.min(Math.max(pos.x, this._c.pos.min.x), this._c.pos.max.x),
      y: Math.min(Math.max(pos.y, this._c.pos.min.y), this._c.pos.max.y)
    };
    this._emitter.emit('change');
  }

  get pos () {
    return {
      x: this._pos.x,
      y: this._pos.y
    };
  }

  setSize (size) {
    this._size = {
      w: Math.min(Math.max(size.w, this._c.size.min.w), this._c.size.max.w),
      h: Math.min(Math.max(size.h, this._c.size.min.h), this._c.size.max.h)
    };
    this._emitter.emit('change');
  }

  get size () {
    return {
      w: this._size.w,
      h: this._size.h
    };
  }

  setRotation (rotation) {
    if (Math.abs(rotation) >= Math.PI * 2) {
      rotation %= (Math.PI * 2);
    }
    this._rotation = Math.min(Math.max(rotation, this._c.rotation.min), this._c.rotation.max);
    this._emitter.emit('change');
  }

  get rotation () {
    return this._rotation;
  }

  setAngle (angle) {
    if (Math.abs(angle) >= Math.PI * 2) {
      angle %= (Math.PI * 2);
    }
    this._angle = Math.min(Math.max(angle, this._c.angle.min), this._c.angle.max);
    this._emitter.emit('change');
  }

  get angle () {
    return this._angle;
  }

  setScale (scale) {
    this._scale = Math.min(Math.max(scale, this._c.scale.min), this._c.scale.max);
    this._emitter.emit('change');
  }

  get scale () {
    return this._scale;
  }

  setZoom (zoom) {
    this._zoom = Math.min(Math.max(zoom, this._c.zoom.min), this._c.zoom.max);
    this._emitter.emit('change');
  }

  get zoom () {
    return this._zoom;
  }

  // @todo use Shapes.polygon
  getShape () {
    const halfWidth = this._size.w / (2 * this._scale * this._zoom);
    const halfHeight = this._size.h / (2 * this._scale * this._zoom);
    const shape = [
      { x: this._pos.x - halfWidth, y: this._pos.y - halfHeight },
      { x: this._pos.x + halfWidth, y: this._pos.y - halfHeight },
      { x: this._pos.x + halfWidth, y: this._pos.y + halfHeight },
      { x: this._pos.x - halfWidth, y: this._pos.y + halfHeight }
    ];
    // @todo use for instead of map
    return shape.map(point => Geometry.rotateVector(point, this._angle + this._rotation, this._pos));
  }

  scaleValue (val) {
    return Math.round(this._scale * this._zoom * val);
  }

  scaleArray (arr) {
    // @todo use for instead of map
    return arr.map((val) => Math.round(this._scale * this._zoom * val));
  }

  scaleSize (size) {
    return {
      w: Math.round(this._scale * this._zoom * size.w),
      h: Math.round(this._scale * this._zoom * size.h)
    };
  }

  scalePoint (point) {
    const origin = {
      x: this._pos.x - this._size.w / (2 * this._scale * this._zoom),
      y: this._pos.y - this._size.h / (2 * this._scale * this._zoom)
    };
    const rotated = Geometry.rotateVector(point, -this._angle - this._rotation, this._pos);
    const scaled = {
      x: Math.round(this._scale * this._zoom * (rotated.x - origin.x)),
      y: Math.round(this._scale * this._zoom * (rotated.y - origin.y))
    };
    return scaled;
  }

  scalePoints (points) {
    // @todo use for instead of map
    return points.map((point) => this.scalePoint(point));
  }

  scaleAngle (angle) {
    return angle - this._angle - this._rotation;
  }

  scaleText (pixels) {
    return this.scaleValue(pixels);
  }

  destroy () {
    this._emitter.destroy();
  }
}

export {
  Viewport
};
