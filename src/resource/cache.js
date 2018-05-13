class Cache {
  constructor (resources) {
    this._resources = {};
  }

  add (id, resource) {
    this._resources[id] = resource;
  }

  remove (id) {
    return this._resources[id];
  }

  get (id, silent) {
    if (!silent && !this._resources.hasOwnProperty(id)) {
      throw new Error(`Unknown resource ${id}`);
    }
    return this._resources[id];
  }
};

export {
  Cache
};
