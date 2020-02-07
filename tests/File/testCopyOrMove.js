/* global expect */
const write = require('./write');
const readBuffer = require('../lib/readBuffer');

module.exports = async function testCopyOrMove(type = 'copy', file) {
  const { key, buffer } = await write(file);
  const to = 'test2.png';

  await file[type]({ key }, { key: to });

  const bufferTo = await readBuffer(await file.read({ key: to }));

  expect(await file.has({ key })).toBe(type === 'copy');
  expect(await file.has({ key: to })).toBe(true);
  expect(buffer).toEqual(bufferTo);
}
