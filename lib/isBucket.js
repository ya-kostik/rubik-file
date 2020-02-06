const isString = require('lodash/isString');

const Pattern = {
  NAME: /^[a-z0-9][a-z0-9-.]+[a-z0-9]$/,
  IP: /^\d+?\.\d+?\.\d+\.\d+?$/,
  LETTER_OR_DIGIT: /^([a-z0-9])$/
}

module.exports = function isBucket(bucket) {
  if (!isString(bucket)) return false;
  if (!(bucket.length > 2 && bucket.length < 64)) return false;
  // Only latin letters, digits, dashes, and dots
  // Starts from a letter or digit
  // Ends with a letter or digit
  if (!Pattern.NAME.test(bucket)) return false;
  // Doesn't look like an IP address
  if (Pattern.IP.test(bucket)) return false;
  // before and after dot should be a letter or digit
  for (let i = 1; i < bucket.length - 1; i++) {
    const past = bucket[i - 1];
    const char = bucket[i];
    const next = bucket[i + 1];

    if (char !== '.') continue;
    if (!Pattern.LETTER_OR_DIGIT.test(past)) return false;
    if (!Pattern.LETTER_OR_DIGIT.test(next)) return false;
  }

  return true;
}
