
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

  renderAnimationFrame (row, index, renderer, pos, anchor) {
    anchor = anchor || { x: 0.5, y: 0.5 };
    const frame = this.getAnimationFrame(row, index);
    const dx = pos.x + frame.size.w * (0 - anchor.x);
    const dy = pos.y + frame.size.h * (0 - anchor.y);
    const dWidth = frame.size.w;
    const dHeight = frame.size.h;
    renderer.drawImage(frame.source, frame.pos.x, frame.pos.y, frame.size.w, frame.size.h, dx, dy, dWidth, dHeight);
  }
}

export {
  SpriteSheet
};
