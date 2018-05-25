
const create = (html) => {
  var div = document.createElement('div');
  div.innerHTML = html;
  return div.children[0];
};

const Dom = {
  create
};

export {
  Dom
};
