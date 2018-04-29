const pointToPointSquare = (pointA, pointB) => {
  return Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2);
};

const pointToPoint = (pointA, pointB) => {
  return Math.sqrt(pointToPointSquare(pointA, pointB));
};

const pointToSegmentSquare = (point, segment) => {
  const start = segment.start;
  const end = segment.end;
  const lengthSquare = pointToPointSquare(start, end);

  if (lengthSquare === 0) return pointToPointSquare(point, start);

  const region = ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / lengthSquare;

  if (region < 0) return pointToPointSquare(point, start);
  if (region > 1) return pointToPointSquare(point, end);

  const intersection = {
    x: start.x + region * (end.x - start.x),
    y: start.y + region * (end.y - start.y)
  };

  return pointToPointSquare(point, intersection);
};

const pointToSegment = (point, segment) => {
  return Math.sqrt(pointToSegmentSquare(point, segment));
};

const Distance = {
  pointToPointSquare,
  pointToPoint,
  pointToSegmentSquare,
  pointToSegment
};

export {
  Distance
};
