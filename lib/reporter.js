const format = require('@commitlint/format').default;
const chalk = require('chalk');

// eslint-disable-next-line no-console
const log = console.log;

function logReport(results) {
  results.forEach((result) => {
    const icon = result.valid ? chalk.green('✔️ ') : chalk.red('✖ ');

    log(icon, result.input.split('\n')[0]);
  });

  const output = format(
    { results },
    { helpUrl: 'https://github.com/bigcommerce/validate-commits/blob/master/README.md' },
  );

  if (output !== '') {
    log('\nReport:\n');

    log(output);
  }
}

module.exports = {
  logReport,
};
