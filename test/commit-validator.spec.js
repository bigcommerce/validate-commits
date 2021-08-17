const CommitValidator = require('../lib/commit-validator');

describe('CommitValidator', () => {
  const options = {
    scopes: ['foo', 'bar'],
  };

  it('returns false if message does not contain valid task', async () => {
    const validator = new CommitValidator(options);

    expect((await validator.isValid('build(foo): JIRA-1234 Add build script')).valid).toBe(false);
    expect((await validator.isValid('doc(bar): JIRA-1234 Update docs')).valid).toBe(false);
  });

  it('returns false if message does not contain valid scope', async () => {
    const validator = new CommitValidator(options);

    expect((await validator.isValid('refactor(hello): JIRA-1234 Extract method')).valid).toBe(
      false,
    );
    expect((await validator.isValid('feat(world): JIRA-1234 Add new feature')).valid).toBe(false);
  });

  it('returns false if message does not contain ticket number', async () => {
    const validator = new CommitValidator(options);

    expect((await validator.isValid('refactor(hello): Extract method')).valid).toBe(false);
  });

  it('returns true if message follows valid format', async () => {
    const validator = new CommitValidator(options);

    expect((await validator.isValid('refactor(foo): JIRA-1234 Extract method')).valid).toBe(true);
    expect((await validator.isValid('feat(bar): JIRA-1234 Add new feature')).valid).toBe(true);
  });

  it('returns false if message does not follow valid format', async () => {
    const validator = new CommitValidator(options);

    expect((await validator.isValid('refactor[foo]: JIRA-1234 Extract method')).valid).toBe(false);
    expect((await validator.isValid('refactor(foo): JIRA-1234: Extract method')).valid).toBe(false);
    expect((await validator.isValid('JIRA-1234: refactor(foo) Extract method')).valid).toBe(false);
  });

  it('returns true if message (release commit) follows valid format', async () => {
    const validator = new CommitValidator(options);

    expect((await validator.isValid('Releasing v1.0.0')).valid).toBe(true);
    expect((await validator.isValid('Releasing 1.0.0')).valid).toBe(true);
    expect((await validator.isValid('Releasing 1.0.0.rc-1')).valid).toBe(true);
    expect((await validator.isValid('Release 1.0.0.rc-1')).valid).toBe(true);
  });

  it('returns false if message (release commit) does not follow valid format', async () => {
    const validator = new CommitValidator(options);

    expect((await validator.isValid('v1.0.0')).valid).toBe(false);
    expect((await validator.isValid('Publishing 1.0.0')).valid).toBe(false);
    expect((await validator.isValid('Releasing v1')).valid).toBe(false);
  });

  it('returns true if message (revert commit) follows valid format', async () => {
    const validator = new CommitValidator(options);

    expect(
      (await validator.isValid('Revert "refactor(foo): JIRA-1234 Extract method"')).valid,
    ).toBe(true);
    expect((await validator.isValid('Revert "Extract method"')).valid).toBe(true);
  });

  it('returns false if message (revert commit) does not follow valid format', async () => {
    const validator = new CommitValidator(options);

    expect((await validator.isValid('Revert refactor(foo): JIRA-1234 Extract method')).valid).toBe(
      false,
    );
    expect((await validator.isValid("Revert 'Extract method'")).valid).toBe(false);
  });
});
