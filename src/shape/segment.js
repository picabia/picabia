import { Granular } from '../maths/granular';
import { Distance } from '../maths/distance';
import { Vector } from '../maths/vector';

const fromSegment = (segment) => {
  return {
    _: 'segment',
    __: null,
    start: Vector.copy(segment.start),
    end: Vector.copy(segment.end)
  };
};

const fromPoints = (points) => {
  return {
    _: 'segment',
    __: null,
    start: Vector.copy(points[0]),
    end: Vector.copy(points[1])
  };
};

const containsPoint = (segment, point) => {
  return Granular.zero(Distance.pointToSegmentSquare(point, segment));
};

const getPoints = (segment) => {
  return [segment.start, segment.end];
};

const getSegments = (segment) => {
  return [Segment.fromPoints([segment.start, segment.end])];
};

const Segment = {
  fromSegment,
  fromPoints,
  //
  containsPoint,
  getPoints,
  getSegments
};

export {
  Segment
};
