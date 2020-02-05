const { BufferListStream } = require('bl');
const Provider = require('../../classes/Provider');
const waitForStream = require('../lib/waitForStream');

class Memory extends Provider {
  constructor(options = {}) {
    super(...arguments);
    this.options = options;

    this.files = new Map();
  }

  async write(source, stream) {
    const bufferList = new BufferListStream();
    stream.pipe(bufferList);

    await waitForStream(stream);

    this.files.set(this.getPath(source), bufferList.slice());
  }

  async has(source) {
    return this.files.has(this.getPath(source));
  }

  async read(source) {
    const buffer = this.files.get(this.getPath(source));
    if (!buffer) return null;
    return new BufferListStream([buffer]);
  }

  async remove(source) {
    this.files.delete(this.getPath(source));
  }
}

module.exports = Memory;

