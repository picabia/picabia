const loadImage = (resource) => {
  const img = document.createElement('img');
  img.src = resource.url;
  return new Promise((resolve, reject) => {
    const load = () => {
      img.removeEventListener('load', load);
      resolve({ img });
    };
    img.addEventListener('load', load);
  });
};

export {
  loadImage
};
