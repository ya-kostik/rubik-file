const FileError = require('./FileError');

const REQUIRED_METHODS = Object.freeze([
  'write', 'has', 'read', 'remove'
]);

async function defaultMethod() {
  throw new FileError(
    FileError.METHOD_IS_NOT_IMPLEMENTED + REQUIRED_METHODS.join(', ')
  );
}

/**
 * Abstract Provider
 *
 * Providers are needed to separate storage logic from kubik's code
 * Also providers should be used for copy or move files from one storage to another
 * @class Provider
 */
class Provider {
  constructor(options = {}) {
    this.options = Object.assign({}, options);
  }

  getPath({ key, bucket }) {
    return `${bucket}/${key}`;
  }
}

// Abstract
for (const method of REQUIRED_METHODS) {
  Provider.prototype[method] = defaultMethod;
}

Provider.REQUIRED_METHODS = REQUIRED_METHODS;
module.exports = Provider;
