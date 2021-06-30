const chalk = require('chalk');

class Reporter {
  printReport(report) {
    report.commits.map((commit) => {
      if (commit.valid) {
        return console.log(chalk.green(commit.subject));
      }

      return console.log(chalk.red.bold(commit.subject));
    });

    if (report.message) {
      console.log(report.message);
    }
  }
}

module.exports = Reporter;
