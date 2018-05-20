const fromRadians = (radians) => ({
  x: Math.cos(radians),
  y: Math.sin(radians)
});

const fromPoints = (pointA, pointB) => {
  return {
    x: pointA.x - pointB.x,
    y: pointA.y - pointB.y
  };
};

const copy = (vector) => {
  return {
    x: vector.x,
    y: vector.y
  };
};

const normalize = (vector) => {
  const length = Math.sqrt(vector.x ** 2 + vector.y ** 2);
  return {
    x: vector.x / length,
    y: vector.y / length
  };
};

const dot = (vA, vB) => vA.x * vB.x + vA.y * vB.y;

const Vector = {
  fromRadians,
  fromPoints,
  //
  copy,
  normalize,
  dot
};

export {
  Vector
};
