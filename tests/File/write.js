const createRandomStream = require('../lib/createRandomStream');

module.exports = async function write(file, bucket) {
  const stream = createRandomStream();
  const buffer = stream.slice();
  const id = 'test.png';
  await file.write({ id, bucket }, stream);
  return { id, bucket, file, stream, buffer };
};
