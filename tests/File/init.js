const path = require('path');
const { Kubiks: { Config } } = require('rubik-main');
const { createApp, createKubik } = require('rubik-main/tests/helpers/creators');

const File = require('../../');
const Memory = require('./Memory');


function initApp() {
  const app = createApp();
  app.add(new Config(path.join(__dirname, '../../default/')));
  return app;
}

function initConfig(app, file, config) {
  Object.assign(
    app.config.get(file.name),
    { provider: 'Memory' },
    config
  );
}

function initFile(app) {
  const file = createKubik(File, app);
  File.addProvider('Memory', Memory);
  return file;
}

function init(config) {
  const app = initApp();
  const file = initFile(app);
  initConfig(app, file ,config);

  return { app, file };
}

module.exports = init;
