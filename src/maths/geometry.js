const radiansToVector = (radians) => ({
  x: Math.cos(radians),
  y: Math.sin(radians)
});

const modulo = (dividend, divisor) => {
  return (dividend % divisor + divisor) % divisor;
};

const normalizeHalfAngle = (angle) => {
  return modulo(angle + Math.PI, Math.PI * 2) - Math.PI;
};

const normalizeAngle = (angle) => {
  return modulo(angle, Math.PI * 2);
};

const getAABBRect = (points) => {
  const length = points.length;
  const min = {
    x: points[0].x,
    y: points[0].y
  };
  const max = {
    x: points[0].x,
    y: points[0].y
  };
  for (let ix = 1; ix < length; ix++) {
    var point = points[ix];
    if (point.x < min.x) {
      min.x = point.x;
    } else if (point.x > max.x) {
      max.x = point.x;
    }
    if (point.y < min.y) {
      min.y = point.y;
    } else if (point.y > max.y) {
      max.y = point.y;
    }
  }
  return [min.x, min.y, max.x - min.x, max.y - min.y];
};

const radiansDelta = (radiansA, radiansB) => {
  const diff = radiansA - radiansB;
  return modulo(diff + Math.PI, Math.PI * 2) - Math.PI;
};

const rotateVector = (vector, radians, origin) => {
  origin = origin || {x: 0, y: 0};
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = (cos * (vector.x - origin.x)) + (sin * (vector.y - origin.y)) + origin.x;
  const ny = (cos * (vector.y - origin.y)) - (sin * (vector.x - origin.x)) + origin.y;
  return { x: nx, y: ny };
};

const Geometry = {
  getAABBRect,
  radiansToVector,
  radiansDelta,
  normalizeHalfAngle,
  normalizeAngle,
  rotateVector
};

export {
  Geometry
};
