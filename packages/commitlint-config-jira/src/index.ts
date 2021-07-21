import { UserConfig } from '@commitlint/types';

import { releases } from './ignores';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  plugins: ['@bigcommerce/commitlint-plugin-jira'],
  rules: {
    'scope-case': [2, 'always', 'lower-case'],
    // https://github.com/conventional-changelog/commitlint/issues/2631
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    'subject-case': [2, 'never', ['start-case', 'pascal-case']],
    'subject-start-jira': [2, 'always'],
  },
  ignores: [releases],
};

export = config;
