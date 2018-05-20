class ViewportGroup {
  constructor (viewports) {
    this._viewports = viewports;
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
