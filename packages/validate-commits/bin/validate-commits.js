#!/usr/bin/env node
const commitlintConfig = require('@bigcommerce/commitlint-config-jira');
const format = require('@commitlint/format').default;
const lint = require('@commitlint/lint').default;
const load = require('@commitlint/load').default;
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

const utils = require('../lib/utils');

// TODO: Refactor tests to use bin
// TODO: License

// eslint-disable-next-line no-console
const log = argv.silent ? () => {} : console.log;

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

load(utils.mergeDeprecatedConfigFile(commitlintConfig))
  .then(async (opts) => {
    const commits = await read(getBranch());

    const results = await Promise.all(
      commits.map((commit) =>
        lint(
          commit,
          opts.rules,
          opts.parserPreset
            ? {
                parserOpts: opts.parserPreset.parserOpts,
                plugins: opts.plugins,
                defaultIgnores: opts.defaultIgnores,
                helpUrl: opts.helpUrl,
                ignores: opts.ignores,
              }
            : {},
        ),
      ),
    );

    const valid = results.every((result) => result.valid);
    const output = format({ results }, { verbose: argv.verbose });

    if (output !== '') {
      log(output);
    }

    if (!valid && !argv.warning) {
      throw new Error(output);
    }
  })
  .catch(() => {
    process.exit(1);
  });

function getBranch() {
  if (argv._[0]) {
    return {
      from: argv._[0],
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
