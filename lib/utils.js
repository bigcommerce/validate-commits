const path = require('path');
const fs = require('fs');

const PRE_PUSH_HOOK = `
#!/usr/bin/env bash

set -e
npm run validate-commits -- --warning
`.trim();

const HELP_TEXT = `
usage: validate-commits [--warning]

Checks the format of the commits

Options:

  --warning           Suppress error code.
  --install-git-hook  Install a pre-push git hook in your repo to validate commits
  --silent            Don't print any output
`.trim();
`.trim();

function installGitHookError(file) {
    return `
You already have a git hook in:

${file}

Either remove it and re-run this command or manually add:

npm run validate-commits -- --warning
`.trim();
}

function installGitHook() {
    const prePushHook = path.join(process.env.PWD, '.git', 'hooks', 'pre-push');

    if (fs.existsSync(prePushHook)) {
        throw new Error(installGitHookError(prePushHook));
    }

    fs.writeFileSync(prePushHook, PRE_PUSH_HOOK, { mode: 0o766 });
}

function filterEmptyLines(text) {
    return text
        .split('\n')
        .filter(line => !line.match(/^\s*$/));
}

module.exports = {
    helpText: HELP_TEXT,
    installGitHook,
    filterEmptyLines,
}
