const FileError = require('./FileError');

function defaultMethod() {
  throw new FileError(FileError.METHOD_IS_NOT_IMPLEMENTED);
}

class Provider {
  getPath({ id, bucket }) {
    return `${bucket}/${id}`;
  }
}

// Abstract
const methods = ['write', 'has', 'read', 'remove'];
for (const method of methods) {
  Provider.prototype[method] = defaultMethod;
}

module.exports = Provider;
