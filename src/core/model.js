class Model {
  constructor () {
    this._children = [];
    this._childIndex = 0;
    this._timestamp = undefined;
  }

  _each (fn) {
    this._children.forEach(fn);
  }

  _map (fn) {
    return this._children.map(fn);
  }

  _filter (fn) {
    return this._children.filter(fn);
  }

  _find (fn) {
    return this._children.find(fn);
  }

  _addChild (child, zIndex, meta) {
    zIndex = zIndex || 0;
    meta = meta || {};
    const index = this._childIndex++;
    this._children.push({ obj: child, zIndex: zIndex || 0, index, meta });
    this._children.sort((a, b) => a.zIndex - b.zIndex || a.index - b.index);
  }

  _init () {}

  _postInit () {}

  _update () {}

  _postUpdate () {}

  _removeChild (child) {
    for (let ix = 0; ix < this._children.length; ix++) {
      if (this._children[ix].obj === child) {
        return this._children.splice(ix, 1);
      }
    }
  }

  _destroyChild (child) {
    this._removeChild(child);
    child.destroy();
  }

  // -- public

  init (timestamp) {
    this._init(timestamp);
    for (let ix = 0; ix < this._children.length; ix++) {
      this._children[ix].obj.init(timestamp);
    }
    this._postInit(timestamp);
    this._timestamp = timestamp;
  }

  update (delta, timestamp) {
    if (this._timestamp === undefined) {
      this.init(timestamp);
    }
    this._update(delta, timestamp);
    for (let ix = 0; ix < this._children.length; ix++) {
      this._children[ix].obj.update(delta, timestamp);
    }
    this._postUpdate(delta, timestamp);
  }

  destroy () {
    this._destroy();
    for (let ix = 0; ix < this._children.length; ix++) {
      const child = this._children[ix].obj;
      child.destroy();
      if (!child._destroyed) {
        console.error(child);
        throw new Error(`child was not properly destroyed.`);
      }
    }
    this._children.splice(0);
    this._destroyed = true;
  }

  dump () {
    const _ = this._dump ? this._dump() : child;
    const __ = this._children.map((child) => {
      return child.obj.dump ? child.obj.dump() : child.obj;
    });
    return { _, __ };
  }
};

export {
  Model
};
