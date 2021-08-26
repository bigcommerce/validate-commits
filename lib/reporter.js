/* eslint-disable no-console */
const format = require('@commitlint/format').default;
const chalk = require('chalk');

function logReport(results) {
  results.forEach((result) => {
    if (result.valid) {
      console.log(chalk.green(result.input));
    } else {
      console.log(chalk.red.bold(result.input));
    }
  });

  const output = format(
    { results },
    { helpUrl: 'https://github.com/bigcommerce/validate-commits/blob/master/README.md' },
  );

  if (output !== '') {
    console.log(output);
  }
}

module.exports = {
  logReport,
};
