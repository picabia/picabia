
const saw = (startedAt, center, amplitude, period, phase) => {
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

const triangle = (startedAt, center, amplitude, period, phase) => {
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

const square = (startedAt, center, amplitude, period, phase) => {
  startedAt = startedAt || 0;
  center = center || 0;
  amplitude = amplitude || 1;
  period = period || 1000;
  phase = phase ? phase / (Math.PI * 2) : 0;
  return (timestamp) => {
    const elapsed = timestamp - startedAt;
    const local = ((phase * period + elapsed) % period) / period;
    return local < 0.5 ? center + amplitude : center - amplitude;
  };
};

const sine = (startedAt, center, amplitude, period, phase) => {
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

const cosine = (startedAt, center, amplitude, period, phase) => {
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

const Wave = {
  saw,
  triangle,
  square,
  sine,
  cosine
};

export {
  Wave
};
