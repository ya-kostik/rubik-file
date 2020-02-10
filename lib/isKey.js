const isString = require('lodash/isString');

const MAX_SIZE_IN_BYTES = 1024;

const FORBIDDEN_CHARS_PATTERN = /[:*"><|!?]/;

/**
 * Check key name
 * @param  {String} key — is a key name to check
 * @return {Boolean} is name correct or invalid
 */
function isKey(key) {
  // The key should be non-empty string
  if (!isString(key)) return false;
  if (!key.length) return false;
  const buffer = Buffer.from(key);
  // Check max size of the key in bytes
  if (buffer.length > MAX_SIZE_IN_BYTES) return false;
  // Check forbidden chars in the key
  if (~key.search(FORBIDDEN_CHARS_PATTERN)) return false;

  return true;
}

isKey.MAX_SIZE_IN_BYTES = MAX_SIZE_IN_BYTES;
module.exports = isKey;
