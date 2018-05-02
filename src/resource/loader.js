import { loadImage } from './loaders/image';
import { loadJson } from './loaders/json';
// import { loadFont } from './loaders/loadFont';

const loaders = [{
//   test: /\.woff$/,
//   method: loadFont
// }, {
  test: (resource) => /\.json$/.test(resource.url),
  method: loadJson
}, {
  test: (resource) => /\.png$/.test(resource.url),
  method: loadImage
}];

class Loader {
  constructor () {
    this._cache = {};
    this._loaders = [...loaders];
  }

  addLoader (test, method) {
    this._loaders.push({ test, method });
  }

  _load (resource) {
    if (this._cache[resource.url]) {
      return this._cache[resource.url];
    }
    const loader = this._loaders.find((item) => {
      return item.test(resource);
    });
    if (!loader) {
      throw new Error(`Could not find a loader for ${resource.url}.`);
    }
    const promise = loader.method(resource)
      .then((result) => {
        return Object.assign({}, resource, result);
      });
    this._cache[resource.url] = promise;
    return promise;
  }

  _normalizeResources (resources) {
    if (!Array.isArray(resources)) {
      resources = [resources];
    }
    return resources.map((resource) => {
      if (typeof resource === 'string') {
        return {
          url: resource,
          name: resource
        };
      } else {
        return resource;
      }
    });
  }

  // @todo concurrency
  load (resources) {
    resources = this._normalizeResources(resources);
    const promises = resources.map((resource) => this._load(resource));
    return Promise.all(promises);
  }
};

export {
  Loader
};
