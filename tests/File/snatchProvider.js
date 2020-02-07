module.exports = function snatchProvider(from, to) {
  return { key: from.key, provider: to.provider };
};
