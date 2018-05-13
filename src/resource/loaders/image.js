const re = /^(.+)\.([a-z]+)$/i;

const loadImage = (resource) => {
  const img = document.createElement('img');
  let url = resource.url;
  img.pixelRatio = 1;
  if (resource['@2x'] && window.devicePixelRatio > 1) {
    let matches = url.match(re);
    url = matches[1] + '@2x.' + matches[2];
    img.pixelRatio = 2;
  }
  img.src = url;
  return new Promise((resolve, reject) => {
    const load = () => {
      img.removeEventListener('load', load);
      resolve(img);
    };
    img.addEventListener('load', load);
  });
};

export {
  loadImage
};
