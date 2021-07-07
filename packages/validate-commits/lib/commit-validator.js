'use strict';

class CommitValidator {
    constructor(options) {
        this.patterns = [
            new RegExp(`^(${options.tasks.join('|')})\\((${options.scopes.join('|')})\\): [A-Z]{2,}-[0-9]+ .+`),
            new RegExp('^Revert ".+'),
            new RegExp('^Releas(e|ing) v?\\d+\\.\\d+\\.\\d+'),
        ];

        this.errorMessage = this._getError(options.scopes, options.tasks);
    }

    isValid(subject) {
        return this.patterns.some((pattern) => pattern.test(subject));
    }

    validate(commitsToValidate) {
        const commits = commitsToValidate
            .map((subject) => ({
                valid: this.isValid(subject),
                subject,
            }));

        const valid = commits.every(commit => commit.valid);
        const message = valid ? 'All Good!' : this.errorMessage;

        return {
            commits,
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
