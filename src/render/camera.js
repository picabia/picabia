import { Emitter } from '../core/emitter';

import { CameraPosControl } from './camera/pos-control';
import { CameraAngleControl } from './camera/angle-control';
import { CameraZoomControl } from './camera/zoom-control';

const METHODS = {
  pos: 'setPos',
  angle: 'setAngle',
  zoom: 'setZoom'
};

const reducers = {
  pos: (values) => {
    return values.reduce((acc, item) => {
      return !item ? acc : {
        x: acc.x + item.x,
        y: acc.y + item.y
      };
    }, { x: 0, y: 0 });
  },
  angle: (values) => {
    return values.reduce((acc, item) => item ? acc + item : acc);
  },
  zoom: (values) => {
    return values.reduce((acc, item) => item ? acc * item : acc, 1);
  }
};

class Camera {
  constructor (id) {
    this._ = 'camera';
    this._id = id;

    this._controls = [];
    this._controlIndex = {};

    this._values = {};
    this._viewports = {};

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);
  }

  _addControl (type, name, viewports, control) {
    const id = `${type}:${name}`;
    const obj = { id, type, name, viewports, control };
    this._controls.push(obj);
    this._controlIndex[id] = obj;
    this._indexViewports(viewports, obj);
  }

  _indexViewports (viewports, control) {
    for (let ix = 0; ix < viewports.length; ix++) {
      const viewport = viewports[ix];
      this._viewports[viewport.id] = this._viewports[viewport.id] || { viewport, controls: {} };
      this._viewports[viewport.id].controls[control.type] = this._viewports[viewport.id].controls[control.type] || [];
      this._viewports[viewport.id].controls[control.type].push(control);
    }
  }

  _getControl (type, name) {
    const id = `${type}:${name}`;
    const control = this._controlIndex[id];
    if (!control) {
      throw new Error(`Unknown control: "${id}".`);
    }
    return control;
  }

  _updateViewport (changedControls, viewport, controlsByType) {
    for (let type in controlsByType) {
      const controls = controlsByType[type];
      const isChanged = controls.reduce((acc, item) => acc || changedControls.indexOf(item.id) !== -1, false);
      if (isChanged) {
        const values = controls.map(control => this._values[control.id]);
        const value = reducers[type](values);
        const method = METHODS[type];
        viewport[method](value);
      }
    }
  }

  _updateViewports (changedControls) {
    for (let id in this._viewports) {
      const viewport = this._viewports[id].viewport;
      const controlsByType = this._viewports[id].controls;
      this._updateViewport(changedControls, viewport, controlsByType);
    }
  }

  get id () {
    return this._id;
  }

  addPosControl (name, viewports, control) {
    control = control || new CameraPosControl();
    const type = 'pos';
    this._addControl(type, name, viewports, control);
  }

  addAngleControl (name, viewports, control) {
    control = control || new CameraAngleControl();
    const type = 'angle';
    this._addControl(type, name, viewports, control);
  }

  addZoomControl (name, viewports, control) {
    control = control || new CameraZoomControl();
    const type = 'zoom';
    this._addControl(type, name, viewports, control);
  }

  setPos (name, time, pos) {
    const control = this._getControl('pos', name);
    control.control.setValue(time, pos);
  }

  getPos (name) {
    return this._getControl('pos', name).control.value;
  }

  setAngle (name, time, angle) {
    const control = this._getControl('angle', name);
    control.control.setValue(time, angle);
  }

  getAngle (name) {
    return this._getControl('angle', name).control.value;
  }

  setZoom (name, time, zoom) {
    const control = this._getControl('zoom', name);
    control.control.setValue(time, zoom);
  }

  getZoom (name) {
    return this._getControl('angle', name).control.value;
  }

  // - view manager

  preRender (time) {
    const changedControls = [];
    for (let ix = 0; ix < this._controls.length; ix++) {
      const control = this._controls[ix];
      if (control.control.updateRequired) {
        const changed = control.control.preRender(time);
        if (changed) {
          this._values[control.id] = control.control.getValue();
          changedControls.push(control.id);
        }
      }
    }
    if (changedControls.length) {
      this._updateViewports(changedControls);
    }
  }

  destroy () {
    this._emitter.destroy();
  }
}

export {
  Camera
};
