class Model {
  constructor () {
    this._children = [];
    this._childIndex = 0;
    this._time = {
      i: undefined,
      t: undefined,
      d: undefined
    };
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

  _addChild (child) {
    this._children.push(child);
  }

  _removeChild (child) {
    for (let ix = 0; ix < this._children.length; ix++) {
      if (this._children[ix] === child) {
        return this._children.splice(ix, 1);
      }
    }
  }

  _destroyChild (child) {
    this._removeChild(child);
    child.destroy();
  }

  _init (time) {
    this._preInit();
    for (let ix = 0; ix < this._children.length; ix++) {
      this._children[ix]._init(time);
    }
    this._postInit();
  }

  // -- overridable

  _preInit () {}

  _postInit () {}

  _preUpdate () {}

  _postUpdate () {}

  _destroy () {}

  // -- public

  get time () {
    return {
      t: this._time.t || this._time.i,
      d: this._time.d || 0
    };
  }

  update (time) {
    if (this._time.i === undefined) {
      this._time.i = time.t;
      this._init(time);
    }
    this._time.t = time.t;
    this._time.d = time.d;
    this._preUpdate();
    for (let ix = 0; ix < this._children.length; ix++) {
      this._children[ix].update(time);
    }
    this._postUpdate();
  }

  destroy () {
    for (let ix = 0; ix < this._children.length; ix++) {
      const child = this._children[ix];
      child.destroy();
      if (!child._destroyed) {
        console.error(child);
        throw new Error(`child was not properly destroyed.`);
      }
    }
    this._children.splice(0);
    this._destroy();
    this._destroyed = true;
  }

  dump () {
    const _ = this._dump ? this._dump() : this;
    const __ = this._children.map((child) => {
      return child.dump ? child.dump() : child;
    });
    return { _, __ };
  }
};

export {
  Model
};
