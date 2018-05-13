
// https://hacks.mozilla.org/2016/06/webfont-preloading-for-html5-games/
const FontFaceObserver = require('fontfaceobserver');

const loadFont = (resource) => {
  const matches = resource.url.match(/([a-z]+)\.woff$/i);
  if (!matches) {
    throw new Error(`Invalid font filename ${resource.url}.`);
  }
  const face = matches[1];
  const head = document.querySelector('head');
  const style = document.createElement('style');
  style.innerText = `@font-face { font-family: '${face}'; src: url('${resource.url}');}`;
  head.appendChild(style);
  const font = new FontFaceObserver(face);
  return font.load()
    .then(() => {
      style.remove();
      return face;
    });
};

export {
  loadFont
};
