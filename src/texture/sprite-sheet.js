
class SpriteSheet {
  constructor (source, frames, index) {
    this._source = source;
    this._frames = frames;
    this._index = index;
  }

  getFrame (name) {
    const frame = this._frames[name];
    return {
      source: this._source,
      pos: {
        x: frame.pos.x,
        y: frame.pos.y
      },
      size: {
        w: frame.size.w,
        h: frame.size.h
      }
    };
  }

  getAnimationFrame (row, ix) {
    const frame = this._index[row][ix];
    return this.getFrame(frame);
  }
}

export {
  SpriteSheet
};
