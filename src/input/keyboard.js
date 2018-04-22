import { Emitter } from '../core/emitter';

class KeyboardInput {
  constructor (keys, config) {
    this._config = config;

    this._groups = [];
    this._maps = {};
    this._keys = {};
    this._onKeys = {};
    this._idle = {};

    this._emitter = new Emitter();
    Emitter.mixin(this, this._emitter);

    this._keydown = (event) => {
      let key = event.key.toLowerCase();
      this._groups.forEach((group) => this._handleGroupKeyDown(group, key));
    };

    this._keyup = (event) => {
      let key = event.key.toLowerCase();
      this._groups.forEach((group) => this._handleGroupKeyUp(group, key));
    };

    document.addEventListener('keydown', this._keydown);
    document.addEventListener('keyup', this._keyup);
  }

  _getGroupControl (group) {
    const groupOnKeys = this._onKeys[group];
    const keys = [...groupOnKeys].sort();
    const lastKey = groupOnKeys[groupOnKeys.length - 1];
    const combo = keys.join('+');
    if (this._maps[group][combo]) {
      return combo;
    }
    return lastKey;
  }

  _handleGroupKeyDown (group, key) {
    const onKeys = this._onKeys[group];
    if (this._keys[group].includes(key) && !onKeys.includes(key)) {
      onKeys.push(key);
      const groupControl = this._getGroupControl(group);
      if (groupControl) {
        this._emitter.emit(group + ':' + this._maps[group][groupControl]);
      }
    }
  }

  _handleGroupKeyUp (group, key) {
    const onKeys = this._onKeys[group];
    if (this._keys[group].includes(key) && onKeys.includes(key)) {
      const index = onKeys.indexOf(key);
      onKeys.splice(index, 1);
      if (!onKeys.length) {
        return this._emitter.emit(group + ':' + this._idle[group]);
      }
      const groupControl = this._getGroupControl(group);
      if (groupControl) {
        this._emitter.emit(group + ':' + this._maps[group][groupControl]);
      }
    }
  }

  // -- public

  addGroup (group, map, idle) {
    this._groups.push(group);
    this._maps[group] = map;
    this._keys[group] = Object.keys(map);
    this._idle[group] = idle || 'default';
    this._onKeys[group] = [];
  }

  destroy () {
    this._emitter.destroy();
    document.removeEventListener('keydown', this._keydown);
    document.removeEventListener('keyup', this._keyup);
  }
}

export {
  KeyboardInput
};
