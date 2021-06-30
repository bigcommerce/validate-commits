const CommitValidator = require('../lib/commit-validator');

describe('CommitValidator', () => {
  const options = {
    tasks: ['feat', 'refactor'],
    scopes: ['foo', 'bar'],
  };

  it('returns false if message does not contain valid task', () => {
    const validator = new CommitValidator(options);

    expect(validator.isValid('build(foo): JIRA-1234 Add build script')).toBe(false);
    expect(validator.isValid('docs(bar): JIRA-1234 Update docs')).toBe(false);
  });

  it('returns false if message does not contain valid scope', () => {
    const validator = new CommitValidator(options);

    expect(validator.isValid('refactor(hello): JIRA-1234 Extract method')).toBe(false);
    expect(validator.isValid('feat(world): JIRA-1234 Add new feature')).toBe(false);
  });

  it('returns false if message does not contain ticket number', () => {
    const validator = new CommitValidator(options);

    expect(validator.isValid('refactor(hello): Extract method')).toBe(false);
  });

  it('returns true if message follows valid format', () => {
    const validator = new CommitValidator(options);

    expect(validator.isValid('refactor(foo): JIRA-1234 Extract method')).toBe(true);
    expect(validator.isValid('feat(bar): JIRA-1234 Add new feature')).toBe(true);
  });

  it('returns false if message does not follow valid format', () => {
    const validator = new CommitValidator(options);

    expect(validator.isValid('refactor[foo]: JIRA-1234 Extract method')).toBe(false);
    expect(validator.isValid('refactor(foo): JIRA-1234: Extract method')).toBe(false);
    expect(validator.isValid('JIRA-1234: refactor(foo) Extract method')).toBe(false);
  });

  it('returns true if message (release commit) follows valid format', () => {
    const validator = new CommitValidator(options);

    expect(validator.isValid('Releasing v1.0.0')).toBe(true);
    expect(validator.isValid('Releasing 1.0.0')).toBe(true);
    expect(validator.isValid('Releasing 1.0.0.rc-1')).toBe(true);
    expect(validator.isValid('Release 1.0.0.rc-1')).toBe(true);
  });

  it('returns false if message (release commit) does not follow valid format', () => {
    const validator = new CommitValidator(options);

    expect(validator.isValid('v1.0.0')).toBe(false);
    expect(validator.isValid('Publishing 1.0.0')).toBe(false);
    expect(validator.isValid('Releasing v1')).toBe(false);
  });

  it('returns true if message (revert commit) follows valid format', () => {
    const validator = new CommitValidator(options);

    expect(validator.isValid('Revert "refactor(foo): JIRA-1234 Extract method"')).toBe(true);
    expect(validator.isValid('Revert "Extract method"')).toBe(true);
  });

  it('returns false if message (revert commit) does not follow valid format', () => {
    const validator = new CommitValidator(options);

    expect(validator.isValid('Revert refactor(foo): JIRA-1234 Extract method')).toBe(false);
    expect(validator.isValid("Revert 'Extract method'")).toBe(false);
  });
});
