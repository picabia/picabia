const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    const timestamp = args[1];
    if (!lastRan && timestamp) {
      func.apply(context, args);
      lastRan = timestamp;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if ((timestamp - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = timestamp;
        }
      }, limit - (timestamp - lastRan));
    }
  };
};

export {
  throttle
};
