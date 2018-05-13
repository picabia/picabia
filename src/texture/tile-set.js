class TileSet {
  constructor (source, size, tiles, props) {
    this._source = source;
    this._size = size;
    this._tiles = {};
    this._props = props;

    this._pixelRatio = source.pixelRatio || 1;

    for (let ix = 0; ix < tiles.length; ix++) {
      for (let ox = 0; ox < tiles[ix].length; ox++) {
        let key = tiles[ix][ox];
        this._tiles[key] = {
          x: ox * this._size.w * this._pixelRatio,
          y: ix * this._size.h * this._pixelRatio
        };
      }
    }
  }

  get size () {
    return {
      w: this._size.w,
      h: this._size.h
    };
  }

  get ratio () {
    return this._pixelRatio;
  }
}

export {
  TileSet
};
