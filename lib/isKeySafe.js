const isKey = require('./isKey');

const GOOD_CHARS = /^[a-zA-Z0-9-_/.]$/

module.exports = function isKeySafe(key) {
  if (!isKey(key)) return false;
  for (let i = 0; i < key.length; i++) {
    const char = key[i];
    if (!GOOD_CHARS.test(char)) return false;
    // We check two points one by other: `..`
    if (char !== '.') continue;
    if (key[i + 1] === '.') return false;
  }

  return true;
};
