const lint = require('@commitlint/lint').default;

class CommitValidator {
  constructor(options) {
    this.ignores = [
      (commit) => new RegExp('^Releas(e|ing) v?\\d+\\.\\d+\\.\\d+').test(commit),
      (commit) => new RegExp('^Revert ".+').test(commit),
    ];

    // New format: JIRA-123: type(scope) - subject
    this.newParserOpts = {
      headerPattern: /^[A-Z0-9]{2,}-\d+: (\w*)(?:\(([^)]*)\))?(?:!)? - (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    };

    this.newRules = {
      'body-leading-blank': [1, 'always'],
      'footer-leading-blank': [1, 'always'],
      'scope-enum': [2, 'always', options.scopes],
      'subject-empty': [2, 'never'],
      'header-match-bc-format': [2, 'always'],
      'type-case': [2, 'always', 'lower-case'],
      'type-enum': [
        2,
        'always',
        [
          'build',
          'chore',
          'ci',
          'docs',
          'feat',
          'fix',
          'license',
          'meta',
          'perf',
          'ref',
          'revert',
          'style',
          'test',
        ],
      ],
      'type-empty': [2, 'never'],
    };

    this.newPlugins = [
      {
        rules: {
          'header-match-bc-format': ({ header }) => {
            return [
              header ? /^[A-Z0-9]{2,}-\d+: \w+(\([^)]*\))?!? - .+/.test(header) : true,
              'Header must follow format: JIRA-123: type(scope) - subject',
            ];
          },
        },
      },
    ];

    // Legacy format: type(scope): JIRA-123 subject
    this.legacyRules = {
      'body-leading-blank': [1, 'always'],
      'footer-leading-blank': [1, 'always'],
      'scope-enum': [2, 'always', options.scopes],
      'scope-empty': [2, 'never'],
      'subject-empty': [2, 'never'],
      'subject-start-jira': [2, 'always'],
      'type-case': [2, 'always', 'lower-case'],
      'type-enum': [
        2,
        'always',
        ['chore', 'docs', 'feat', 'fix', 'perf', 'refactor', 'style', 'test'],
      ],
      'type-empty': [2, 'never'],
    };

    this.legacyPlugins = [
      {
        rules: {
          'subject-start-jira': ({ subject }) => {
            return [
              subject ? subject.match(/^[A-Z0-9]{2,}-\d+ /) : true,
              `Your subject must contain a JIRA ticket (i.e. BIG-123).`,
            ];
          },
        },
      },
    ];
  }

  async validateCommit(commit) {
    const [newResult, legacyResult] = await Promise.all([
      lint(commit, this.newRules, {
        defaultIgnores: false,
        ignores: this.ignores,
        parserOpts: this.newParserOpts,
        plugins: this.newPlugins,
      }),
      lint(commit, this.legacyRules, {
        defaultIgnores: false,
        ignores: this.ignores,
        plugins: this.legacyPlugins,
      }),
    ]);

    let passingResult = null;

    if (newResult.valid) {
      passingResult = newResult;
    } else if (legacyResult.valid) {
      passingResult = legacyResult;
    }

    if (passingResult) {
      const warnings = [...newResult.warnings, ...legacyResult.warnings].filter(
        (w, i, arr) => arr.findIndex((x) => x.name === w.name) === i,
      );

      return { ...passingResult, warnings };
    }

    // Both failed — return errors from whichever format the commit appears to target
    const looksLikeNewFormat = /^[A-Z0-9]{2,}-\d+:/.test(commit);

    return looksLikeNewFormat ? newResult : legacyResult;
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
