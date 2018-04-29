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
  return polygon.points.map((vector) => ({ x: vector.x + polygon.pos.x, y: vector.y + polygon.pos.y }));
};

const getSegments = (polygon) => {
  const vertices = polygon.points.map((vector) => ({ x: vector.x + polygon.pos.x, y: vector.y + polygon.pos.y }));
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
