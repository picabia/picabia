
class TileMap {
  constructor (tileSet) {
    this._tileSet = tileSet;

    this._regions = [];
    this._pos = {};
    this._currentRegion = null;
  }

  _setCurrentRegion (region) {
    this._currentRegion = region;
  }

  // -- api

  get tileSize () {
    return this._tileSet.size;
  }

  get tileRatio () {
    return this._tileSet.ratio;
  }

  addRegion (region) {
    this._regions.push(region);
    this._setCurrentRegion(region);
  }

  // setPos (x, y) {
  //   if (x !== this._pos.x || y !== this._pos.y) {
  //     this._pos = {
  //       x,
  //       y
  //     };
  //     this._setCurrentRegion(region);
  //   }
  // }

  getTileAt (pos) {
    if (!pos.x && !pos.y) {
      return null;
    }
    const withinX = pos.x >= this._regions[0].pos.x && pos.x < this._regions[0].pos.x + this._regions[0].size.w;
    const withinY = pos.y >= this._regions[0].pos.y && pos.y < this._regions[0].pos.y + this._regions[0].size.h;
    if (withinX && withinY) {
      let x = pos.x - this._regions[0].pos.x;
      let y = pos.y - this._regions[0].pos.y;
      let texture = this._regions[0].tiles[x][y];
      return {
        source: this._tileSet._source,
        x: this._tileSet._tiles[texture].x,
        y: this._tileSet._tiles[texture].y
      };
    }
  }
}

export {
  TileMap
};
