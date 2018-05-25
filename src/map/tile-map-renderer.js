import { Geometry } from '../maths/geometry';

class TileMapPreRenderer {
  constructor (tileMap, padding, buffer) {
    this._tileMap = tileMap;
    this._tiles = null;
    this._padding = padding || 1;
    this._buffer = buffer || 3;

    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');

    this._canvas.style.position = 'absolute';
    this._canvas.style.top = '0px';
    this._canvas.style.left = '0px';
    this._canvas.style.opacity = '0.3';

    this._requiresResize = false;
    this._requiresRender = false;

    this._rerender = 0;
  }

  _drawAt (x, y, tile) {
    const tileSize = this._tileMap.tileSize;
    const pixelRatio = this._tileMap.tileRatio;
    this._ctx.drawImage(
      tile.source,
      tile.x,
      tile.y,
      tileSize.w * pixelRatio,
      tileSize.h * pixelRatio,
      x * tileSize.w,
      y * tileSize.h,
      tileSize.w * pixelRatio,
      tileSize.h * pixelRatio
    );
  }

  _resize () {
    const tileSize = this._tileMap.tileSize;
    const padding = this._padding;
    const buffer = this._buffer;
    const rect = Geometry.getAABBRect(this._nextShape);

    rect[0] -= padding * tileSize.w;
    rect[1] -= padding * tileSize.h;
    rect[2] += padding * tileSize.w * 2;
    rect[3] += padding * tileSize.h * 2;

    const tiles = [0, 0, 0, 0];
    tiles[0] = Math.floor(rect[0] / tileSize.w);
    tiles[1] = Math.floor(rect[1] / tileSize.h);
    tiles[2] = Math.ceil(rect[2] / tileSize.w);
    tiles[3] = Math.ceil(rect[3] / tileSize.h);

    let cTiles = this._tiles;

    if (!cTiles || tiles[0] !== cTiles[0] || tiles[1] !== cTiles[1] || tiles[2] !== cTiles[2] || tiles[3] !== cTiles[3]) {
      const cropLeft = cTiles && tiles[0] - cTiles[0];
      const cropTop = cTiles && tiles[1] - cTiles[1];
      const cropRight = cTiles && cTiles[0] + cTiles[2] - tiles[0] - tiles[2];
      const cropBottom = cTiles && cTiles[1] + cTiles[3] - tiles[1] - tiles[3];

      this._requiresRender = !cTiles || cropLeft < 0 || cropTop < 0 || cropRight < 0 || cropBottom < 0;
      if (!this._tiles) {
        this._tiles = tiles;
        this._tiles[0] -= buffer;
        this._tiles[1] -= buffer;
        this._tiles[2] += buffer * 2;
        this._tiles[3] += buffer * 2;
        cTiles = this._tiles;
      } else if (this._requiresRender) {
        if (cropLeft < 0) {
          cTiles[0] += cropLeft - buffer;
          cTiles[2] += buffer;
        } else if (cropLeft > buffer) {
          cTiles[0] += cropLeft;
          cTiles[2] -= cropLeft;
        }
        if (cropTop < 0) {
          cTiles[1] += cropTop - buffer;
          cTiles[3] += buffer;
        } else if (cropTop > buffer) {
          cTiles[1] += cropTop;
          cTiles[3] -= cropTop;
        }
        if (cropRight < 0) {
          cTiles[2] -= cropRight - buffer;
        } else if (cropRight > buffer) {
          cTiles[2] -= buffer;
        }
        if (cropBottom < 0) {
          cTiles[3] -= cropBottom - buffer;
        } else if (cropBottom > buffer) {
          cTiles[3] -= buffer;
        }
      }

      this._size = {
        w: rect[2],
        h: rect[3]
      };
      this._offset = {
        x: rect[0] - cTiles[0] * tileSize.w,
        y: rect[1] - cTiles[1] * tileSize.h
      };
    }
    this._pos = this._nextPos;
  }
  // -- api

  get source () {
    return this._canvas;
  }

  get offset () {
    return this._offset;
  }

  get pos () {
    return this._pos;
  }

  get size () {
    return this._size;
  }

  resize (pos, shape) {
    this._requiresResize = true;
    this._nextPos = pos;
    this._nextShape = shape;
  }

  render () {
    if (!this._requiresResize) {
      return;
    }
    this._requiresResize = false;
    this._resize();

    if (!this._requiresRender) {
      return;
    }
    this._requiresRender = false;

    const tileSize = this._tileMap.tileSize;
    const pixelRatio = this._tileMap.tileRatio;
    this._canvas.width = this._tiles[2] * tileSize.w * pixelRatio;
    this._canvas.height = this._tiles[3] * tileSize.h * pixelRatio;
    this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);

    for (let x = 0; x < this._tiles[2]; x++) {
      for (let y = 0; y < this._tiles[3]; y++) {
        let tile = this._tileMap.getTileAt({ x: x + this._tiles[0], y: y + this._tiles[1] });
        if (tile) {
          this._drawAt(x, y, tile);
        }
      }
    }
  }
}

export {
  TileMapPreRenderer
};
