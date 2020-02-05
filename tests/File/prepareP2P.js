const createSource = require('./createSource');
const createRandomStream = require('../lib/createRandomStream');

module.exports = async function prepareP2P(file) {
  const from = createSource();
  const to = createSource();

  const stream = createRandomStream();
  const buffer = stream.slice();

  await file.write(from, stream);

  return { from, to, buffer, stream };
}
