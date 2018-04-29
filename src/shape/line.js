import { Vector } from '../maths/vector';
import { Segment } from './segment';

const fromSegment = (segment) => {
  return {
    _: 'line',
    __: null,
    start: Vector.copy(segment.start),
    end: Vector.copy(segment.end)
  };
};

const fromPoints = (points) => {
  return {
    _: 'line',
    __: null,
    start: Vector.copy(points[0]),
    end: Vector.copy(points[1])
  };
};

const getStandard = (line) => {
  const a = line.start.y - line.end.y;
  const b = line.end.x - line.start.x;
  const c = (line.start.x - line.end.x) * line.start.y + (line.end.y - line.start.y) * line.start.x;
  return [a, b, c];
};

const getPoints = (line) => {
  return [line.start, line.end];
};

const getSegments = (line) => {
  return [Segment.fromPoints([line.start, line.end])];
};

const Line = {
  fromSegment,
  fromPoints,
  //
  getStandard,
  getPoints,
  getSegments
};

export {
  Line
};
