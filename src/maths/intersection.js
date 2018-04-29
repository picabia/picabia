import { Granular } from './granular';
import { Shape } from '../shape/index';

const lineWithLine = (lineA, lineB) => {
  const [a1, b1, c1] = Shape.Line.getStandard(lineA);
  const [a2, b2, c2] = Shape.Line.getStandard(lineB);
  /* Cramer's rule */ // @todo check documentation, what's Cramer rule?
  const det = a1 * b2 - b1 * a2;
  if (!Granular.zero(det)) { // @todo use Maths.Precision.eq0
    const detX = c1 * b2 - b1 * c2;
    const detY = a1 * c2 - c1 * a2;
    // @todo check for cases where det is zero (results in NaN and Infinities)
    return [{ x: -detX / det, y: -detY / det }]; // @todo: why do we need the minus? https://alexbol99.github.io/flatten-js/classes_line.js.html#line133
  }
  return [];
};

const segmentWithSegment = (segmentA, segmentB) => {
  const lineA = Shape.Line.fromSegment(segmentA);
  const lineB = Shape.Line.fromSegment(segmentB);
  const intersections = lineWithLine(lineA, lineB);
  if (intersections.length && Shape.Segment.containsPoint(segmentA, intersections[0]) && Shape.Segment.containsPoint(segmentB, intersections[0])) {
    return intersections;
  }
};

const segmentWithPolygon = (segment, polygon) => {
  const segments = Shape.Polygon.getSegments(polygon);
  const intersections = [];
  let point;
  for (let ix = 0; ix < segments.length; ix++) {
    point = segmentWithSegment(segment, segments[ix]);
    if (point) {
      intersections.push(point);
    }
  }
  return intersections;
};

const polygonWithSegment = (polygon, segment) => {
  return segmentWithPolygon(segment, polygon);
};

const between = (shapeA, shapeB) => {
  const type = shapeA._ + '+' + shapeB._;
  switch (type) {
    case 'segment+polygon':
      return segmentWithPolygon(shapeA, shapeB);
    case 'polygon+segment':
      return segmentWithPolygon(shapeB, shapeA);
  }
};

const Intersection = {
  lineWithLine,
  segmentWithSegment,
  segmentWithPolygon,
  polygonWithSegment,
  between
};

export {
  Intersection
};
