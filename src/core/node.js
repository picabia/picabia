const mixin = (object) => {

  object._children = [];
  object._childIndex = 0;

  object._each = (fn) => {
    object._children.forEach(fn);
  };

  object._map = (fn) => {
    return object._children.map(fn);
  };

  object._filter = (fn) => {
    return object._children.filter(fn);
  };

  object._find = (fn) => {
    return object._children.find(fn);
  };

  object._addChild = (child, zIndex, meta) => {
    zIndex = zIndex || 0;
    meta = meta || {};
    const index = object._childIndex++;
    object._children.push({ obj: child, zIndex: zIndex || 0, index, meta });
    object._children.sort((a, b) => a.zIndex - b.zIndex || a.index - b.index);
  };

  object.update = (delta, timestamp) => {
    if (object._update) {
      object._update(delta, timestamp);
    }
    for (let ix = 0; ix < object._children.length; ix++) {
      const child = object._children[ix].obj;
      if (child.update) {
        child.update(delta, timestamp);
      }
    }
  };

  object.removeOne = (object) => {
    let index = -1;
    for (let ix = 0; ix < object._children.length; ix++) {
      if (object._children[ix].obj === object) {
        index = ix;
        break;
      }
    }
    if (index !== -1) {
      object._children.splice(index, 1);
    }
  };

  object.destroyOne = (object) => {
    this.removeOne(object);
    if (object.destroy) {
      object.destroy();
    }
    if (object.children) {
      object.children.destroyAll();
    }
  };

  object.destroy = () => {
    if (object._destroy) {
      object._destroy();
    }
    for (let ix = 0; ix < object._children.length; ix++) {
      const child = object._children[ix].obj;
      if (child.destroy) {
        child.destroy();
      }
    }
    object._children.splice(0);
  };

  object.dump = () => {
    const _ = object._dump ? object._dump() : object;
    const __ = object._children.map((child) => {
      return child.obj.dump ? child.obj.dump() : child.obj;
    });
    return { _, __ };
  };
};

const Node = function () {};
Node.mixin = mixin;

export {
  Node
};
