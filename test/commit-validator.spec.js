const CommitValidator = require('../lib/commit-validator');

describe('CommitValidator', () => {
    const options = {
        tasks: ['feat', 'refactor'],
        scopes: ['foo', 'bar'],
    };

    it('returns true if message is valid', () => {
        const validator = new CommitValidator(options);

        expect(validator.isValid('refactor(foo): JIRA-1234 Extract method')).toBe(true);
        expect(validator.isValid('feat(bar): JIRA-1234 Add new feature')).toBe(true);
    });

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

    it('returns false if message does not match with default patterns', () => {
        const validator = new CommitValidator(options);

        expect(validator.isValid('refactor[foo]: JIRA-1234 Extract method')).toBe(false);
        expect(validator.isValid('refactor(foo): JIRA-1234: Extract method')).toBe(false);
        expect(validator.isValid('JIRA-1234: refactor(foo) Extract method')).toBe(false);
    });

    it('returns true if message matches custom or default patterns', () => {
        const validator = new CommitValidator(Object.assign({}, options, {
            patterns: [
                /^Releasing \d+\.\d+\.\d+$/,
                'Merge pull request #\\d+',
            ],
        }));

        expect(validator.isValid('Releasing 1.0.0')).toBe(true);
        expect(validator.isValid('Merge pull request #123')).toBe(true);
        expect(validator.isValid('refactor(foo): JIRA-1234 Extract method')).toBe(true);
        expect(validator.isValid('feat(bar): JIRA-1234 Add new feature')).toBe(true);
    });
});
