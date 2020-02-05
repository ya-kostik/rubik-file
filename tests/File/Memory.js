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
    const buffer = new BufferListStream();
    stream.pipe(buffer);
    this.files.set(this.getPath(source), buffer);

    await waitForStream(stream);
  }

  async has(source) {
    return this.files.has(this.getPath(source));
  }

  async read(source) {
    return this.files.get(this.getPath(source)) || null;
  }

  async remove(source) {
    this.files.delete(this.getPath(source));
  }
}

module.exports = Memory;

