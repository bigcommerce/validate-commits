import { Plugin } from '@commitlint/types';

import { SUBJECT_START_JIRA, subjectStartJira } from './rules';

const plugin: Plugin = {
  rules: {
    [SUBJECT_START_JIRA]: subjectStartJira,
  },
};

export = plugin;
