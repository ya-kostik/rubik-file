const File = require('../../');
let counter = 0;

module.exports = function createSource() {
  return {
    id: `file${++counter}.png`,
    provider: File.createProvider('Memory')
  }
};
