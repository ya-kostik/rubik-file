const init = require('./init');

async function doAfterUp(cb) {
  const { file, app } = init();
  await app.up();
  await cb(file, app);
  await app.down();
}

module.exports = doAfterUp;
