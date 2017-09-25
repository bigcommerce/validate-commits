const path = require('path');
const fs = require('fs');
const scopesFile = path.join(process.env.PWD, 'scopes.json');

if (!fs.existsSync(scopesFile)) {
    throw new Error('You need to define the list of scopes in `scopes.json`.');
}

module.exports = {
    scopes: require(scopesFile),
    tasks: require('../lib/tasks.json'),
};
