class ViewportGroup {
  constructor (id, viewports) {
    this._ = 'viewport-group';
    this._id = id;
    this._viewports = viewports;
  }

  get id () {
    return this._id;
  }

  setSize (size) {
    for (let ix = 0; ix < this._viewports.length; ix++) {
      this._viewports[ix].setSize(size);
    }
  }

  setRotation (rotation) {
    for (let ix = 0; ix < this._viewports.length; ix++) {
      this._viewports[ix].setRotation(rotation);
    }
  }

  setScale (scale) {
    for (let ix = 0; ix < this._viewports.length; ix++) {
      this._viewports[ix].setScale(scale);
    }
  }
}

export {
  ViewportGroup
};
