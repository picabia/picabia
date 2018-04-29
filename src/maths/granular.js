const size = 0.000001;

const zero = function (value) {
  return (value < size && value > -size);
};

const same = function (valueA, valueB) {
  return (valueA - valueB < size && valueB - valueA < size);
};

const greater = (valueA, valueB) => {
  return (valueA - valueB > size);
};

const greaterOrSame = (valueA, valueB) => {
  return (valueA - valueB > -size);
};

const less = (valueA, valueB) => {
  return (valueA - valueB < -size);
};

const lessOrSame = (valueA, valueB) => {
  return (valueA - valueB < size);
};

const Granular = {
  size,
  zero,
  same,
  greater,
  greaterOrSame,
  less,
  lessOrSame
};

export {
  Granular
};
