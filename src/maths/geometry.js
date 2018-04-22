const radiansToVector = (radians) => ({
  x: Math.cos(radians),
  y: Math.sin(radians)
});

const modulo = (dividend, divisor) => {
  return (dividend % divisor + divisor) % divisor;
};

const normalizeHalfAngle = function (angle) {
  return modulo(angle + Math.PI, Math.PI * 2) - Math.PI;
};

const normalizeAngle = function (angle) {
  return modulo(angle, Math.PI * 2);
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
  radiansToVector,
  radiansDelta,
  normalizeHalfAngle,
  normalizeAngle,
  rotateVector
};

export {
  Geometry
};
