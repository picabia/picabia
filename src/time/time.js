const FROZEN = {};
Object.freeze(FROZEN);

const throttle = (func, limit) => {
  let timeout;
  let ts;
  return () => {
    const context = this;
    const args = arguments;
    if (!ts) {
      func.apply(context, args);
      ts = Date.now();
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if ((Date.now() - ts) >= limit) {
          func.apply(context, args);
          ts = Date.now();
        }
      }, limit - (Date.now() - ts));
    }
  };
};

const repeat = (now, ms, fn, context) => {
  return (time) => {
    if (!now || (time.t - now) >= ms) {
      fn(...arguments);
      now = time.t;
    }
  };
};

const run = (now, wait, fn, context) => {
  return (time) => {
    if (time.t > now + wait) {
      fn.apply(context || FROZEN, arguments);
    }
  };
};

const Time = {
  throttle,
  repeat,
  run
};

export {
  Time
};
