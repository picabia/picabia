import { Segment } from './segment';

const fromPoints = (pos, points) => {
  return {
    _: 'polygon',
    __: null,
    pos: pos,
    points: points
  };
};

const getPoints = (polygon) => {
  // @todo use for instead of map
  return polygon.points.map((vector) => ({ x: vector.x + polygon.pos.x, y: vector.y + polygon.pos.y }));
};

const getSegments = (polygon) => {
  // @todo use for instead of map
  const vertices = polygon.points.map((vector) => ({ x: vector.x + polygon.pos.x, y: vector.y + polygon.pos.y }));
  // @todo use for instead of map
  return vertices.map((point, index) => {
    const nextPoint = vertices[(index + 1) % vertices.length];
    return Segment.fromPoints([point, nextPoint]);
  });
};

const Polygon = {
  fromPoints,
  //
  getPoints,
  getSegments
};

export {
  Polygon
};
