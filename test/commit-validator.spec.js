const CommitValidator = require('../lib/commit-validator');

let validator;

const options = {
  scopes: ['foo', 'bar'],
};

beforeEach(() => {
  validator = new CommitValidator(options);
});

describe('commit returns true if', () => {
  it('follows valid format', async () => {
    const { valid, errors, warnings } = await validator.validateCommit(
      'refactor(foo): JIRA-1234 Extract method',
    );

    expect(valid).toBe(true);
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  it('follows valid revert format', async () => {
    const { valid, errors, warnings } = await validator.validateCommit(
      'Revert "refactor(foo): JIRA-1234 Extract method"',
    );

    expect(valid).toBe(true);
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  describe('release', () => {
    it('contains a prefix', async () => {
      const { valid, errors, warnings } = await validator.validateCommit('Releasing v1.0.0');

      expect(valid).toBe(true);
      expect(errors).toEqual([]);
      expect(warnings).toEqual([]);
    });

    it('does not include a prefix', async () => {
      const { valid, errors, warnings } = await validator.validateCommit('Releasing 1.0.0');

      expect(valid).toBe(true);
      expect(errors).toEqual([]);
      expect(warnings).toEqual([]);
    });

    it('is a release candidate', async () => {
      const { valid, errors, warnings } = await validator.validateCommit('Releasing 1.0.0.rc-1');

      expect(valid).toBe(true);
      expect(errors).toEqual([]);
      expect(warnings).toEqual([]);
    });

    it('is "Release" instead of "Releasing"', async () => {
      const { valid, errors, warnings } = await validator.validateCommit('Release 1.0.0.rc-1');

      expect(valid).toBe(true);
      expect(errors).toEqual([]);
      expect(warnings).toEqual([]);
    });
  });

  describe('breaking change', () => {
    it('follows valid format', async () => {
      const { valid, errors, warnings } = await validator.validateCommit(
        `
        feat(bar): JIRA-1234 use new method

        BREAKING CHANGE:
        Use new method instead of old one.
      `.trim(),
      );

      expect(valid).toBe(true);
      expect(errors).toEqual([]);
      expect(warnings).toEqual([]);
    });

    it('contains warning if no leading blank line', async () => {
      const { valid, errors, warnings } = await validator.validateCommit(
        `
        feat(bar): JIRA-1234 use new method
        BREAKING CHANGE:
        Use new method instead of old one.
      `.trim(),
      );

      expect(valid).toBe(true);
      expect(errors).toEqual([]);
      expect(warnings).toHaveLength(1);
      expect(warnings).toStrictEqual([expect.objectContaining({ name: 'footer-leading-blank' })]);
    });
  });
});

describe('commit returns false if', () => {
  it('contains invalid task', async () => {
    const { valid, errors, warnings } = await validator.validateCommit(
      'build(foo): JIRA-1234 Add build script',
    );

    expect(valid).toBe(false);
    expect(errors).toHaveLength(1);
    expect(warnings).toEqual([]);
    expect(errors).toStrictEqual([expect.objectContaining({ name: 'type-enum' })]);
  });

  it('contains invalid scope', async () => {
    const { valid, errors, warnings } = await validator.validateCommit(
      'refactor(hello): JIRA-1234 Extract method',
    );

    expect(valid).toBe(false);
    expect(errors).toHaveLength(1);
    expect(warnings).toEqual([]);
    expect(errors).toStrictEqual([expect.objectContaining({ name: 'scope-enum' })]);
  });

  it('does not contain ticket number', async () => {
    const { valid, errors, warnings } = await validator.validateCommit(
      'refactor(foo): Extract method',
    );

    expect(valid).toBe(false);
    expect(errors).toHaveLength(1);
    expect(warnings).toEqual([]);
    expect(errors).toStrictEqual([expect.objectContaining({ name: 'subject-start-jira' })]);
  });

  it('contains invalid scope format', async () => {
    const { valid, errors, warnings } = await validator.validateCommit(
      'refactor[foo]: JIRA-1234 Extract method',
    );

    expect(valid).toBe(false);
    expect(errors).toHaveLength(3);
    expect(warnings).toEqual([]);
    expect(errors).toStrictEqual([
      expect.objectContaining({ name: 'scope-empty' }),
      expect.objectContaining({ name: 'subject-empty' }),
      expect.objectContaining({ name: 'type-empty' }),
    ]);
  });

  it('contains invalid JIRA ticket', async () => {
    const { valid, errors, warnings } = await validator.validateCommit(
      'refactor(foo): JIRA-1234: Extract method',
    );

    expect(valid).toBe(false);
    expect(errors).toHaveLength(1);
    expect(warnings).toEqual([]);
    expect(errors).toStrictEqual([expect.objectContaining({ name: 'subject-start-jira' })]);
  });

  it('JIRA tickets is first', async () => {
    const { valid, errors, warnings } = await validator.validateCommit(
      'JIRA-1234: refactor(foo) Extract method',
    );

    expect(valid).toBe(false);
    expect(errors).toHaveLength(3);
    expect(warnings).toEqual([]);
    expect(errors).toStrictEqual([
      expect.objectContaining({ name: 'scope-empty' }),
      expect.objectContaining({ name: 'subject-empty' }),
      expect.objectContaining({ name: 'type-empty' }),
    ]);
  });

  it('does not contain task or scope', async () => {
    const { valid, errors, warnings } = await validator.validateCommit('This is a commit');

    expect(valid).toBe(false);
    expect(errors).toHaveLength(3);
    expect(warnings).toEqual([]);
    expect(errors).toStrictEqual([
      expect.objectContaining({ name: 'scope-empty' }),
      expect.objectContaining({ name: 'subject-empty' }),
      expect.objectContaining({ name: 'type-empty' }),
    ]);
  });

  describe('release', () => {
    it('does not contain "Releasing"', async () => {
      const { valid, errors, warnings } = await validator.validateCommit('v1.0.0');

      expect(valid).toBe(false);
      expect(errors).toHaveLength(3);
      expect(warnings).toEqual([]);
      expect(errors).toStrictEqual([
        expect.objectContaining({ name: 'scope-empty' }),
        expect.objectContaining({ name: 'subject-empty' }),
        expect.objectContaining({ name: 'type-empty' }),
      ]);
    });

    it('contains "Publishing"', async () => {
      const { valid, errors, warnings } = await validator.validateCommit('Publishing 1.0.0');

      expect(valid).toBe(false);
      expect(errors).toHaveLength(3);
      expect(warnings).toEqual([]);
      expect(errors).toStrictEqual([
        expect.objectContaining({ name: 'scope-empty' }),
        expect.objectContaining({ name: 'subject-empty' }),
        expect.objectContaining({ name: 'type-empty' }),
      ]);
    });

    it('does not contain valid semver', async () => {
      const { valid, errors, warnings } = await validator.validateCommit('Releasing v1');

      expect(valid).toBe(false);
      expect(errors).toHaveLength(3);
      expect(warnings).toEqual([]);
      expect(errors).toStrictEqual([
        expect.objectContaining({ name: 'scope-empty' }),
        expect.objectContaining({ name: 'subject-empty' }),
        expect.objectContaining({ name: 'type-empty' }),
      ]);
    });
  });

  describe('revert', () => {
    it('does not contain quotes', async () => {
      const { valid, errors, warnings } = await validator.validateCommit(
        'Revert refactor(foo): JIRA-1234 Extract method',
      );

      expect(valid).toBe(false);
      expect(errors).toHaveLength(3);
      expect(warnings).toEqual([]);
      expect(errors).toStrictEqual([
        expect.objectContaining({ name: 'scope-empty' }),
        expect.objectContaining({ name: 'subject-empty' }),
        expect.objectContaining({ name: 'type-empty' }),
      ]);
    });

    it('contains single quotes', async () => {
      const { valid, errors, warnings } = await validator.validateCommit("Revert 'Extract method'");

      expect(valid).toBe(false);
      expect(errors).toHaveLength(3);
      expect(warnings).toEqual([]);
      expect(errors).toStrictEqual([
        expect.objectContaining({ name: 'scope-empty' }),
        expect.objectContaining({ name: 'subject-empty' }),
        expect.objectContaining({ name: 'type-empty' }),
      ]);
    });
  });
});
