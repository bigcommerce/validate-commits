const chalk = require('chalk');

class Reporter {
    printReport({ commits, message }) {
        commits.map(commit => {
            if (commit.valid) {
                return console.log(chalk.green(commit.subject));
            }

            return console.log(chalk.red.bold(commit.subject));
        });

        if (message) {
            console.log(message);
        }
    }
}

module.exports = Reporter;
