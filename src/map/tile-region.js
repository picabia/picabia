
const textureDistribution = (textures) => {
  const ret = [];
  for (var ix = 0; ix < textures.length; ix++) {
    for (var ox = 0; ox < textures[ix].weight; ox++) {
      ret.push(textures[ix].type);
    }
  }
  return ret;
};

const populateRect = (tiles, pos, size, distribution) => {
  for (let x = 0; x < size.w; x++) {
    for (let y = 0; y < size.h; y++) {
      let tile = distribution[Math.floor(Math.random() * distribution.length)];
      if (tile) {
        tiles[x][y] = tile;
      }
    }
  }
};

const populateCircle = (tiles, pos, radius, distribution) => {

};

const populateMatrix = (tiles, pos, distribution) => {

};

const fromSize = (size) => {
  const tiles = [];
  for (var ix = 0; ix < size.w; ix++) {
    tiles.push(new Array(size.h));
  }
  return tiles;
};

const fromSets = (pos, size, sets) => {
  const tiles = fromSize(size);
  for (let ix = 0; ix < sets.length; ix++) {
    const set = sets[ix];
    const distribution = textureDistribution(set.textures);
    switch (set.type) {
      case 'rect':
        populateRect(tiles, set.pos, set.size, distribution);
        break;
      case 'circle':
        populateCircle(tiles, set.pos, set.radius, distribution);
        break;
      case 'matrix':
        populateMatrix(tiles, set.pos, distribution);
        break;
    }
  }
  return {
    pos,
    size,
    tiles
  };
};

const TileRegion = {
  fromSets
};

export {
  TileRegion
};
