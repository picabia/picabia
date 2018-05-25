
const up = (now, ms) => {
  return (time) => {
    const value = (time.t - now) / ms;
    return (value > 1) ? 1 : value;
  };
};

const down = (now, ms) => {
  return (time) => {
    const value = (ms - time.t + now) / ms;
    return (value <= 0) ? 0 : value;
  };
};

const Ramp = {
  up,
  down
};

export {
  Ramp
};
