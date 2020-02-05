module.exports = function waitForStream(stream) {
  return new Promise((resolve, reject) => {
    stream.once('error', reject);
    stream.once('end', resolve);
  });
};
