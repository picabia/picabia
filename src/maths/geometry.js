
const radiansToVector = (radians) => ({
  x: Math.cos(radians),
  y: Math.sin(radians)
});

const rotateVector = (vector, radians, origin) => {
  origin = origin || {x: 0, y: 0};
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = (cos * (vector.x - origin.x)) + (sin * (vector.y - origin.y)) + origin.x;
  const ny = (cos * (vector.y - origin.y)) - (sin * (vector.x - origin.x)) + origin.y;
  return { x: nx, y: ny };
};

export {
  radiansToVector,
  rotateVector
};
