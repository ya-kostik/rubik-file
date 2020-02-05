const random = require('lodash/random');
const isNull = require('lodash/isNull');
const { BufferListStream } = require('bl');

const Length = {
  MIN: 100,
  MAX: 1000
};

module.exports = function createRandomStream(length = null) {
  if (isNull(length)) {
    length = random(Length.MIN, Length.MAX);
  }
  const buffer = Buffer.alloc(length);
  const rs = new BufferListStream([buffer]);
  return rs;
};
