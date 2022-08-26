#!/usr/bin/env node
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
const { getCommitList } = require('../lib/getCommitList');
const { logReport } = require('../lib/reporter');
const utils = require('../lib/utils');

// eslint-disable-next-line no-console
const log = argv.silent ? () => {} : console.log;

const commitValidator = new CommitValidator(config);

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

const ignoredAuthors = [/dependabot\[bot\]@users.noreply.github.com$/];

const filterIgnoredAuthors = ({ author, committer }) => {
  return !ignoredAuthors.find((regex) => regex.test(author) || regex.test(committer));
};

async function run() {
  const commits = await getCommitList(getRange());

  const validateList = commits.filter(filterIgnoredAuthors).map(({ message }) => message);

  const { results, valid } = await commitValidator.validate(validateList);

  logReport(results);

  if (!valid && !argv.warning) {
    process.exit(1);
  }
}

function getRange() {
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
    };
  }

  return {
    from: 'master',
  };
}
