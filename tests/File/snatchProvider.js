module.exports = function snatchProvider(from, to) {
  return { id: from.id, provider: to.provider };
};
