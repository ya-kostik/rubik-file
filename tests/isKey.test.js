/* global describe test expect */
const isKey = require('../lib/isKey');


const CORRECT_NAMES = [
  'test', 'test.png', 'test.test', 'Test.png',
  'Тест.png', 'Мой файл.png', 'File.with.dots...',
  'My-file-with-dashes_and_underscores.exe'
];

const WRONG_NAMES = [
  '', null, false, undefined, true, 123,
  // Maximum size exceeded
  Buffer.alloc(isKey.MAX_SIZE_IN_BYTES + 1).toString(),
  // Forbidden characters used
  'b:a', 'b*a', 'a?b', 'a"b', 'a<b', 'b>a', 'b|a', 'b!a'
];

describe('isKey function', () => {
  test.each(CORRECT_NAMES)('returns true with correct name %s', (name) => {
    expect(isKey(name)).toBe(true);
  });

  test.each(WRONG_NAMES)('returns false with wrong name %s', (name) => {
    expect(isKey(name)).toBe(false);
  });
});
