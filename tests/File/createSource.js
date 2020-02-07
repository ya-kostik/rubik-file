const File = require('../../');
let counter = 0;

module.exports = function createSource() {
  return {
    key: `file${++counter}.png`,
    provider: File.createProvider('Memory')
  }
};
