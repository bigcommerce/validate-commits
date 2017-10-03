#!/usr/bin/env node

const CommitValidator = require('../lib/commit-validator');
const Reporter = require('../lib/reporter');

const config = require('../lib/config');
const shellRunner = require('../lib/shell-runner')

const commitValidator = new CommitValidator(config);
const reporter = new Reporter();

function getNonEmptyLines(text) {
    return text
        .split('\n')
        .filter(line => !line.match(/^\s*$/));
}

if (process.argv.includes('--help')) {
    console.log(`
usage: validate-commits [--warning]

Checks the format of the commits

Options:

  --warning Suppress error code.
`.trim());
    process.exit(0);
}

shellRunner.run('git log --format=%s --no-merges master..')
    .then((commits) => {
        const cleanCommitList = getNonEmptyLines(commits);
        const results = commitValidator.validate(cleanCommitList);
        reporter.printReport(results);

        if (!results.valid && !process.argv.includes('--warning')) {
            throw new Error('Commit format error!');
        }
    })
    .catch(error => {
        console.error(error.message);
        process.exit(1);
    });
