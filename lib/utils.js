const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');

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

const GLOBAL_GIT_HOOK_ERROR = `
Seems like you've configured a global git hook directory, please add:

> npm run validate-commits -- --warning

to your pre-push hook.
`.trim();

function installGitHookError(file) {
  return `
You already have a git hook in:

${file}

Either remove it and re-run this command or manually add:

> npm run validate-commits -- --warning
`.trim();
}

function installGitHook() {
  const prePushHook = path.join(process.env.PWD, '.git', 'hooks', 'pre-push');
  const globalHookPath = execSync('git config --get core.hooksPath || echo ""').toString().trim();

  if (globalHookPath) {
    throw new Error(GLOBAL_GIT_HOOK_ERROR);
  }

  if (fs.existsSync(prePushHook)) {
    const content = fs.readFileSync(prePushHook, 'utf8');

    if (!content.match('validate-commits')) {
      throw new Error(installGitHookError(prePushHook));
    }

    return;
  }

  fs.writeFileSync(prePushHook, PRE_PUSH_HOOK, { mode: 0o766 });
}

module.exports = {
  helpText: HELP_TEXT,
  installGitHook,
};
