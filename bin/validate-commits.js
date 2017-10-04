#!/usr/bin/env node

const CommitValidator = require('../lib/commit-validator');
const Reporter = require('../lib/reporter');
const utils = require('../lib/utils');

const config = require('../lib/config');
const shellRunner = require('../lib/shell-runner')

const commitValidator = new CommitValidator(config);
const reporter = new Reporter();

if (process.argv.includes('--help')) {
    console.log(utils.helpText);
    process.exit(0);
}

if (process.argv.includes('--install-git-hook')) {
    try {
        utils.installGitHook();
        process.exit(0);
    } catch(error) {
        console.error(error.message);
        process.exit(1);
    }
}

shellRunner.run('git log --format=%s --no-merges master..')
    .then((commits) => {
        const cleanCommitList = utils.filterEmptyLines(commits);
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
