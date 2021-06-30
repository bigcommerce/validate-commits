const chalk = require('chalk');

class Reporter {
  printReport(report) {
    report.commits.map((commit) => {
      if (commit.valid) {
        // eslint-disable-next-line no-console
        return console.log(chalk.green(commit.subject));
      }

      // eslint-disable-next-line no-console
      return console.log(chalk.red.bold(commit.subject));
    });

    if (report.message) {
      // eslint-disable-next-line no-console
      console.log(report.message);
    }
  }
}

module.exports = Reporter;
