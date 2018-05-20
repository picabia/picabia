class CameraZoomControl {
  constructor (constraints) {
    constraints = constraints || {};
    this._c = constraints;

    constraints.min = constraints.min || 0.1;
    constraints.max = constraints.max || 1000;
  }

  setValue (time, value) {
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
  CameraZoomControl
};
