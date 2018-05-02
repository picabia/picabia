const _filterFrames = (frames, pattern) => {
  const ret = {};
  for (let key in frames) {
    if (!pattern || pattern.test(key)) {
      ret[key] = frames[key];
    }
  }
  return ret;
};

const _measure = (frames) => {
  let width = 0;
  let height = 0;
  Object.values(frames).forEach(element => {
    width = Math.max(width, element.frame.w);
    height = Math.max(height, element.frame.h);
  });
  return { w: width, h: height };
};

const _copy = (source, sourceFrames, target, size) => {
  const frames = {};
  const ctx = target.getContext('2d');
  let x = 0;
  for (let key in sourceFrames) {
    let element = sourceFrames[key];
    ctx.drawImage(source, element.frame.x, element.frame.y, element.frame.w, element.frame.h, x, 0, element.frame.w, element.frame.h);
    frames[key] = {
      pos: {
        x: x,
        y: 0
      },
      size: {
        w: element.frame.w,
        h: element.frame.h
      }
    };
    x += size.w;
  }
  return frames;
};

const convert = (source, data, pattern) => {
  const sourceFrames = _filterFrames(data.frames, pattern);
  const size = _measure(sourceFrames);
  const target = document.createElement('canvas');
  target.width = size.w * Object.keys(sourceFrames).length;
  target.height = size.h;
  const frames = _copy(source, sourceFrames, target, size);
  return {
    source: target,
    frames
  };
};

const SpriteConverterTexturePackerPixiJs = {
  convert
};

export {
  SpriteConverterTexturePackerPixiJs
};
