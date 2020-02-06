/* global describe test expect */
const isBucket = require('../lib/isBucket');


const CORRECT_NAMES = [
  'test', 'test123', '123test',
  '123test123', 'test.test', 'test-test',
  'test-test.test'
];

const WRONG_NAMES = [
  '-test', 'test-', 'test.-test',
  '.test', '192.168.0.1', null,
  123, 'test..test', 'test-.test',
  'ab', 'a', 'abcd1234'.repeat(8),
  'Test'
];

describe('isBucket function', () => {
  test.each(CORRECT_NAMES)('returns true with correct name %s', (name) => {
    expect(isBucket(name)).toBe(true);
  });

  test.each(WRONG_NAMES)('returns false with wrong name %s', (name) => {
    expect(isBucket(name)).toBe(false);
  });
});
