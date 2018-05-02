class Cache {
  constructor (resources) {
    this._resources = {};
    this._add(resources);
  }

  _add (resources) {
    if (!Array.isArray(resources)) {
      resources = [resources];
    }

    for (let ix = 0; ix < resources.length; ix++) {
      let resource = resources[ix];
      let id = resource.id || resource.url;
      this._resources[id] = resource;
    }
  }

  add (id, resource) {
    this._resources[id] = resource;
  }

  remove (id) {
    return this._resources[id];
  }

  get (id, silent = true) {
    if (!silent && !this._resources.hasOwnProperty(id)) {
      throw new Error(`Unknown resource ${id}`);
    }
    return this._resources[id];
  }
};

export {
  Cache
};
