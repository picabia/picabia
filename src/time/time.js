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

const waveSaw = (startedAt, center, amplitude, period, phase) => {
  startedAt = startedAt || 0;
  center = center || 0;
  amplitude = amplitude || 2;
  period = period || 1000;
  phase = phase ? phase / (Math.PI * 2) : 0;
  const bottom = center - amplitude / 2;
  const shift = period / 2;
  return (timestamp) => {
    const elapsed = timestamp - startedAt;
    const local = ((shift + phase * period + elapsed) % period) / period;
    return bottom + local * amplitude;
  };
};

const waveTriangle = (startedAt, center, amplitude, period, phase) => {
  startedAt = startedAt || 0;
  center = center || 0;
  amplitude = amplitude || 1;
  period = period || 1000;
  phase = phase ? phase / (Math.PI * 2) : 0;
  const bottom = center - amplitude / 2;
  const shift = 3 * period / 4;
  return (timestamp) => {
    const elapsed = timestamp - startedAt;
    const local = ((shift + phase * period + elapsed) % period) / period;
    return bottom + Math.abs(local * amplitude * 2 - amplitude);
  };
};

const waveSquare = (startedAt, center, amplitude, period, phase) => {
  startedAt = startedAt || 0;
  center = center || 0;
  amplitude = amplitude || 1;
  period = period || 1000;
  phase = phase ? phase / (Math.PI * 2) : 0;
  return (timestamp) => {
    const elapsed = timestamp - startedAt;
    const local = ((phase * period + elapsed) % period) / period;
    return local < 0.5 ? 1 : -1;
  };
};

const waveSine = (startedAt, center, amplitude, period, phase) => {
  startedAt = startedAt || 0;
  center = center || 0;
  amplitude = amplitude || 1;
  period = period || 1000;
  phase = phase || 0;
  return (timestamp) => {
    const elapsed = timestamp - startedAt;
    const local = phase + 2 * Math.PI * (elapsed % period) / period;
    return Math.sin(local) * amplitude / 2 + center;
  };
};

const waveCosine = (startedAt, center, amplitude, period, phase) => {
  startedAt = startedAt || 0;
  center = center || 0;
  amplitude = amplitude || 1;
  period = period || 1000;
  phase = phase || 0;
  return (timestamp) => {
    const elapsed = timestamp - startedAt;
    const local = phase + 2 * Math.PI * (elapsed % period) / period;
    return Math.cos(local) * amplitude / 2 + center;
  };
};

const Time = {
  throttle,
  waveSaw,
  waveTriangle,
  waveSquare,
  waveSine,
  waveCosine
};

export {
  Time
};
