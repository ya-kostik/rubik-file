const createBufferList = require('./createBufferList');

module.exports = function readBuffer(stream) {
  return createBufferList(stream).
  then((bl) => bl.slice());
}
