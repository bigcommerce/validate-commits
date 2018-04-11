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

const command = process.env.TRAVIS_PULL_REQUEST ?
    `git fetch --no-tags origin ${process.env.TRAVIS_BRANCH}:${process.env.TRAVIS_BRANCH} && git log --format=%s --no-merges ${process.env.TRAVIS_BRANCH}..` :
    'git log --format=%s --no-merges master..';
const commits = execSync(command).toString();
const cleanCommitList = utils.filterEmptyLines(commits);
const results = commitValidator.validate(cleanCommitList);
reporter.printReport(results);

if (!results.valid && process.argv.indexOf('--warning') === -1) {
    log('Commit format error!');
    process.exit(1);
}
