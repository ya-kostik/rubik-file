const FileError = require('./FileError');

const REQUIRED_METHODS = Object.freeze([
  'write', 'has', 'read', 'remove'
]);

async function defaultMethod() {
  throw new FileError(
    FileError.METHOD_IS_NOT_IMPLEMENTED + REQUIRED_METHODS.join(', ')
  );
}

class Provider {
  getPath({ id, bucket }) {
    return `${bucket}/${id}`;
  }
}

// Abstract
for (const method of REQUIRED_METHODS) {
  Provider.prototype[method] = defaultMethod;
}

Provider.REQUIRED_METHODS = REQUIRED_METHODS;
module.exports = Provider;
