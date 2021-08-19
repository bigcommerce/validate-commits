#!/usr/bin/env node
const read = require('@commitlint/read').default;
const argv = require('minimist')(process.argv.slice(2), {
  boolean: true,
  alias: {
    installGitHooks: 'install-git-hooks',
  },
  default: {
    silent: false,
    help: false,
    warning: false,
    'install-git-hooks': false,
  },
});

const CommitValidator = require('../lib/commit-validator');
const config = require('../lib/config');
const Reporter = require('../lib/reporter');
const utils = require('../lib/utils');

// eslint-disable-next-line no-console
const log = argv.silent ? () => {} : console.log;

const commitValidator = new CommitValidator(config);
const reporter = new Reporter();

if (argv.help) {
  log(utils.helpText);
  process.exit(0);
}

if (argv.installGitHooks) {
  try {
    utils.installGitHook();
  } catch (error) {
    log(error.message);
  }

  process.exit(0);
}

run();

async function run() {
  const commits = await read(getBranch());
  const { results, valid } = await commitValidator.validate(commits);

  reporter.printReport(results);

  if (!valid && !argv.warning) {
    process.exit(1);
  }
}

function getBranch() {
  if (argv._[0]) {
    const [from, to] = argv._[0].split('..');

    return {
      from,
      to,
    };
  }

  if (process.env.TRAVIS_PULL_REQUEST && process.env.TRAVIS_PULL_REQUEST !== 'false') {
    return {
      from: process.env.TRAVIS_BRANCH,
      to: process.env.TRAVIS_BRANCH,
    };
  }

  return {
    from: 'master',
  };
}
