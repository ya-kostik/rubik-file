/* global expect */
const write = require('./write');
const readBuffer = require('../lib/readBuffer');

module.exports = async function testCopyOrMove(type = 'copy', file) {
  const { id, buffer } = await write(file);
  const to = 'test2.png';

  await file[type]({ id }, { id: to });

  const bufferTo = await readBuffer(await file.read({ id: to }));

  expect(await file.has({ id })).toBe(type === 'copy');
  expect(await file.has({ id: to })).toBe(true);
  expect(buffer).toEqual(bufferTo);
}
