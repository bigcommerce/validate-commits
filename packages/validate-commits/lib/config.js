const CONFIG_FILE = 'commit-validation.json';
const fs = require('fs');
const path = require('path');

const tasks = require('../lib/tasks.json');

const configFile = path.join(process.env.PWD, CONFIG_FILE);

if (!fs.existsSync(configFile)) {
  throw new Error(`You need a configuration file: '${CONFIG_FILE}'.`);
}

// eslint-disable-next-line import/no-dynamic-require
const config = require(configFile);

if (!Array.isArray(config.scopes)) {
  throw new Error(`You need to define the list of scopes in: '${CONFIG_FILE}'.`);
}

module.exports = Object.assign({ tasks }, config);
