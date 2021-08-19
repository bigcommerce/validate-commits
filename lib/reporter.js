/* eslint-disable no-console */
const chalk = require('chalk');

class Reporter {
  printReport(report) {
    report.results.map((commit) => {
      if (commit.valid) {
        return console.log(chalk.green(commit.input));
      }

      return console.log(chalk.red.bold(commit.input));
    });

    if (report.message) {
      console.log(report.message);
    }
  }
}

module.exports = Reporter;
