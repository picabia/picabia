class CameraPosControl {
  constructor (constraints) {
    constraints = constraints || {};
    this._c = constraints;

    constraints.min = constraints.min || { x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER };
    constraints.max = constraints.max || { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER };
  }

  setValue (time, value) {
    this._nextValue = {
      x: Math.min(Math.max(value.x, this._c.min.x), this._c.max.x),
      y: Math.min(Math.max(value.y, this._c.min.y), this._c.max.y)
    };
    this._updateRequired = !this._value || this._value.x !== this._nextValue.x || this._value.y !== this._nextValue.y;
  }

  getValue () {
    return this._value;
  }

  get updateRequired () {
    return this._updateRequired;
  }

  preRender () {
    this._value = this._nextValue;
    this._updateRequired = false;
    return true;
  }
}

export {
  CameraPosControl
};
