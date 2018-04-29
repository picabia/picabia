import { Arc } from './arc';
import { Box } from './box';
import { Circle } from './circle';
import { Line } from './line';
import { Polygon } from './polygon';
import { Segment } from './segment';

const map = {
  arc: Arc,
  box: Box,
  circle: Circle,
  line: Line,
  polygon: Polygon,
  segment: Segment
};

const getPoints = (shape) => {
  return map[shape._].getPoints(shape);
};

const getSegments = (shape) => {
  return map[shape._].getSegments(shape);
};

const Shape = {
  Arc,
  Box,
  Circle,
  Line,
  Polygon,
  Segment,
  //
  getPoints,
  getSegments
};

export {
  Shape
};
