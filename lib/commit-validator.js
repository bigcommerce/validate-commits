const lint = require('@commitlint/lint').default;

class CommitValidator {
  constructor(options) {
    this.ignores = [
      (commit) => new RegExp('^Releas(e|ing) v?\\d+\\.\\d+\\.\\d+').test(commit),
      (commit) => new RegExp('^Revert ".+').test(commit),
    ];

    this.rules = {
      'body-leading-blank': [1, 'always'],
      'footer-leading-blank': [1, 'always'],
      'scope-enum': [2, 'always', options.scopes],
      'scope-empty': [2, 'never'],
      'subject-empty': [2, 'never'],
      'subject-full-stop': [2, 'never', '.'],
      'subject-start-jira': [2, 'always'],
      'type-case': [2, 'always', 'lower-case'],
      'type-enum': [
        2,
        'always',
        ['chore', 'docs', 'feat', 'fix', 'perf', 'refactor', 'style', 'test'],
      ],
      'type-empty': [2, 'never'],
    };

    this.plugins = [
      {
        rules: {
          'subject-start-jira': ({ subject, raw }) => {
            // Want to allow bots to not have jira tickets
            // Author information is not available within the plugin function arguments, patching for now.
            // https://github.com/conventional-changelog/commitlint/issues/2455
            const deps = 'chore(deps): Bump';
            const depsDev = 'chore(deps-dev): Bump';
            const isValid = () =>
              raw.startsWith(deps) ||
              raw.startsWith(depsDev) ||
              subject.match(/^[A-Z0-9]{2,}-\d+ /);

            return [
              // We return true so we don't report on an empty subject
              // The subject-empty rule will take care of that.
              subject ? isValid() : true,
              `Your subject must contain a JIRA ticket (i.e. BIG-123).`,
            ];
          },
        },
      },
    ];
  }

  async validateCommit(commit) {
    return lint(commit, this.rules, {
      defaultIgnores: false,
      ignores: this.ignores,
      plugins: this.plugins,
    });
  }

  async validate(commits) {
    const results = await Promise.all(commits.map((commit) => this.validateCommit(commit)));

    const valid = results.every((result) => result.valid);

    return {
      results,
      valid,
    };
  }
}

module.exports = CommitValidator;
