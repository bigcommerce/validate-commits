#!/usr/bin/env node

const CommitValidator = require('../lib/commit-validator');
const Reporter = require('../lib/reporter');
const utils = require('../lib/utils');
const execSync = require('child_process').execSync;

const config = require('../lib/config');

const log = process.argv.includes('--silent') ? () => {} : console.log;

const commitValidator = new CommitValidator(config);
const reporter = new Reporter();

if (process.argv.includes('--help')) {
    log(utils.helpText);
    process.exit(0);
}

if (process.argv.includes('--install-git-hook')) {
    try {
        utils.installGitHook()
    } catch(error) {
        log(error.message);
    }

    process.exit(0);
}

const commits = execSync('git log --format=%s --no-merges master..').toString();
const cleanCommitList = utils.filterEmptyLines(commits);
const results = commitValidator.validate(cleanCommitList);
reporter.printReport(results);

if (!results.valid && !process.argv.includes('--warning')) {
    log('Commit format error!');
    process.exit(1);
}
