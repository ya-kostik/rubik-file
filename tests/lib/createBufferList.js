const { BufferListStream } = require('bl');
const waitForStream = require('./waitForStream');

async function createBufferList(stream) {
  const bl = new BufferListStream();
  stream.pipe(bl);

  await waitForStream(stream);

  return bl;
}

module.exports = createBufferList;
