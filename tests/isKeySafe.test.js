/* global describe test expect */
const isKeySafe = require('../lib/isKeySafe');


const SAFE_NAMES = [
  'test', 'Test', 'Test-test', 'test-test',
  'test/test/test', 'test.png', 'test_test',
  'test/test-test.png'
];

const UNSAFE_NAMES = [
  '', 'Ё-моё', '🚗🚕🚙🚌🚎',
  'Мой файл.png', 'My File',
  'file/../../some.bad.file.sh'
];

describe('isKey function', () => {
  test.each(SAFE_NAMES)('returns true with safe name %s', (name) => {
    expect(isKeySafe(name)).toBe(true);
  });

  test.each(UNSAFE_NAMES)('returns false with unsafe name %s', (name) => {
    expect(isKeySafe(name)).toBe(false);
  });
});
