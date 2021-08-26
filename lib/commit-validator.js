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
          'subject-start-jira': ({ subject }) => {
            return [
              // We return true so we don't report on an empty subject
              // The subject-empty rule will take care of that.
              subject ? subject.match(/^[A-Z]{2,}-\d+ /) : true,
              `Your subject must contain a JIRA ticket (i.e. BIG-123).`,
            ];
          },
        },
      },
    ];
  }

  async isValid(commit) {
    return lint(commit, this.rules, {
      defaultIgnores: false,
      ignores: this.ignores,
      plugins: this.plugins,
    });
  }

  async validate(commits) {
    const results = await Promise.all(commits.map((commit) => this.isValid(commit)));

    const valid = results.every((result) => result.valid);

    return {
      results,
      valid,
    };
  }
}

module.exports = CommitValidator;
