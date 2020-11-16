const store = {};

const set = (name, value) => {
  store[name] = value;
};

const get = (name) => {
  return store[name];
};

module.exports = {
  set,
  get,
};
