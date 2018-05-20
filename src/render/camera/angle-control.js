class CameraAngleControl {
  constructor (constraints) {
    constraints = constraints || {};
    this._c = constraints;

    constraints.min = constraints.min || Math.PI * -2;
    constraints.max = constraints.max || Math.PI * 2;
  }

  setValue (time, value) {
    if (Math.abs(value) >= Math.PI * 2) {
      value %= (Math.PI * 2);
    }
    this._nextValue = Math.min(Math.max(value, this._c.min), this._c.max);
    this._updateRequired = !this._value || this._value !== this._nextValue;
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
  CameraAngleControl
};
