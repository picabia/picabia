const loadJson = (resource) => {
  return window.fetch(resource.url)
    .then((response) => response.json())
    .then((data) => {
      return { data };
    });
};

export {
  loadJson
};
