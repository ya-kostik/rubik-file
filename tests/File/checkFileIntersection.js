/* global expect */
const snatchProvider = require('./snatchProvider');

module.exports = async function checkFileIntersection(file, from, to) {
  expect(await file.has(snatchProvider(from, to))).toBe(false);
  expect(await file.has(snatchProvider(to, from))).toBe(false);
}
