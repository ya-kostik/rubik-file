const createRandomStream = require('../lib/createRandomStream');

module.exports = async function write(file, bucket) {
  const stream = createRandomStream();
  const buffer = stream.slice();
  const key = 'test.png';
  await file.write({ key, bucket }, stream);
  return { key, bucket, file, stream, buffer };
};
