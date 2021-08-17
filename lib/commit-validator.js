const lint = require('@commitlint/lint').default;

class CommitValidator {
  constructor(options) {
    this.ignores = [
      (commit) => new RegExp('^Releas(e|ing) v?\\d+\\.\\d+\\.\\d+').test(commit),
      (commit) => new RegExp('^Revert ".+').test(commit),
    ];

    this.rules = {
      'type-enum': [
        2,
        'always',
        ['chore', 'docs', 'feat', 'fix', 'perf', 'refactor', 'style', 'test'],
      ],
      'scope-enum': [2, 'always', options.scopes],
      'subject-start-jira': [2, 'always'],
    };

    this.plugins = [
      {
        rules: {
          'subject-start-jira': ({ subject }) => {
            return [
              subject ? subject.match(/^[A-Z]{2,}-\d+ /) : false,
              `Your subject must contain a JIRA ticket (i.e. BIG-123).`,
            ];
          },
        },
      },
    ];

    // Inlined tasks/types will get removed when we use the commitlint reporter.
    this.errorMessage = this._getError(options.scopes, [
      'chore',
      'docs',
      'feat',
      'fix',
      'perf',
      'refactor',
      'style',
      'test',
    ]);
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
    const message = valid ? 'All Good!' : this.errorMessage;

    return {
      results,
      valid,
      message,
    };
  }

  _getError(scopes, tasks) {
    return `
Some of your commits do not follow the commit pattern:
 - Tasks: ${tasks.join(', ')}
 - Scopes: ${scopes.join(', ')}
 - Format: task(scope): TICKET-123 Commit message

Please refer to the repo's README file for a more descriptive list of scopes.

If you're using a scope that hasn't been defined in the list above, please add
it to commit-validation.json in the root of your repo.
`.trim();
  }
}

module.exports = CommitValidator;
