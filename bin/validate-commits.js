#!/usr/bin/env node

'use strict';

const CommitValidator = require('../lib/commit-validator');
const Reporter = require('../lib/reporter');
const utils = require('../lib/utils');
const execSync = require('child_process').execSync;

const config = require('../lib/config');

const log = process.argv.indexOf('--silent') !== -1 ? () => {} : console.log;

const commitValidator = new CommitValidator(config);
const reporter = new Reporter();

if (process.argv.indexOf('--help') !== -1) {
    log(utils.helpText);
    process.exit(0);
}

if (process.argv.indexOf('--install-git-hook') !== -1) {
    try {
        utils.installGitHook()
    } catch(error) {
        log(error.message);
    }

    process.exit(0);
}

const baseBranch = getBranch();

if (execSync(`git branch --list ${baseBranch}`).toString().trim() === '') {
    log(`Skipping commit validation. Branch '${baseBranch}' is not available.`);
    process.exit(0);
}

const commits = execSync(`git log --author=\\[bot\\] --invert-grep --format=%s --no-merges ${baseBranch}..`).toString();
const cleanCommitList = utils.filterEmptyLines(commits);
const results = commitValidator.validate(cleanCommitList);
reporter.printReport(results);

if (!results.valid && process.argv.indexOf('--warning') === -1) {
    log('Commit format error!');
    process.exit(1);
}

function getBranch() {
    if (process.env.TRAVIS_PULL_REQUEST && process.env.TRAVIS_PULL_REQUEST !== 'false') {
        execSync(`git fetch --no-tags origin ${process.env.TRAVIS_BRANCH}:${process.env.TRAVIS_BRANCH}`);
        return process.env.TRAVIS_BRANCH;
    }

    return 'master';
}
