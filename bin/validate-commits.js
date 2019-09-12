#!/usr/bin/env node

'use strict';

const CommitValidator = require('../lib/commit-validator');
const Reporter = require('../lib/reporter');
const utils = require('../lib/utils');
const execSync = require('child_process').execSync;
const config = require('../lib/config');
const argv = require('minimist')(process.argv.slice(2), {
    boolean: true,
    alias: {
        'installGitHooks': 'install-git-hooks',
    },
    default: {
        'silent': false,
        'help': false,
        'warning': false,
        'install-git-hooks': false,
    },
});

const log = argv.silent ? () => {} : console.log;

const commitValidator = new CommitValidator(config);
const reporter = new Reporter();

if (argv.help) {
    log(utils.helpText);
    process.exit(0);
}

if (argv.installGitHooks) {
    try {
        utils.installGitHook()
    } catch(error) {
        log(error.message);
    }

    process.exit(0);
}

const range = argv._[0] || `${getBranch()}..`;

const commits = execSync(`git log --author='\\[bot\\]' --invert-grep --format=%s --no-merges ${range}`).toString();
const cleanCommitList = utils.filterEmptyLines(commits);
const results = commitValidator.validate(cleanCommitList);
reporter.printReport(results);

if (!results.valid && !argv.warning) {
    log('Commit format error!');
    process.exit(1);
}

function getBranch() {
    if (process.env.TRAVIS_PULL_REQUEST && process.env.TRAVIS_PULL_REQUEST !== 'false') {
        execSync(`git fetch --no-tags origin ${process.env.TRAVIS_BRANCH}:${process.env.TRAVIS_BRANCH}`);
        return process.env.TRAVIS_BRANCH;
    }

    // CircleCI does not currently provide any reference to the PR target, so the best we can assume is that we want to
    // merge into master.
    // Probably keep an eye on https://ideas.circleci.com/ideas/CCI-I-894 to see if they do anything about this.
    if (process.env.CIRCLE_PR_NUMBER && process.env.CIRCLE_PR_NUMBER !== 'false') {
        return 'origin/master';
    }

    return 'master';
}
