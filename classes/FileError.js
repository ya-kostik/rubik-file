const INVALID_KEY = 'key is not a string or invalid';
const INVALID_BUCKET = 'name of bucket is not a string or invalid';
const INVALID_PROVIDER = 'provider should be an instance of Provider';
const INVALID_PROVIDER_CLASS = 'unknown provider';
const METHOD_IS_NOT_IMPLEMENTED = 'provider\'s required method is not implemented.\nRequired methods: ';
const FILE_DOES_NOT_EXIST = 'file does not exist';

class FileError extends Error {
  static is(expression, message) {
    if (!expression) throw new this(message);
  }
}

// Assign constants to class
Object.assign(
  FileError,
  {
    INVALID_KEY,
    INVALID_BUCKET,
    INVALID_PROVIDER,
    INVALID_PROVIDER_CLASS,
    METHOD_IS_NOT_IMPLEMENTED,
    FILE_DOES_NOT_EXIST
  }
);
module.exports = FileError;
