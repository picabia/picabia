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

const throttleAF = (fn, ms, ctx) => {
  let ts;
  return (delta, timestamp) => {
    if (!ts || (timestamp - ts) >= ms) {
      fn(...arguments);
      ts = timestamp;
    }
  };
};

const run = (now, wait) => {
  return (timestamp, fn) => {
    if (timestamp > now + wait) {
      fn();
    }
  };
};

const Time = {
  run,
  throttle,
  throttleAF
};

export {
  Time
};
