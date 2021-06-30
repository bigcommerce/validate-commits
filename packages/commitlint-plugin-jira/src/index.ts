import { Plugin } from '@commitlint/types';

import { jiraProjectKey } from './rules/jira-project-key';
import { subjectStartJira } from './rules/subject-start-jira';

const commitlintPluginJira: Plugin = {
  rules: {
    'jira-project-key': jiraProjectKey,
    'subject-start-jira': subjectStartJira,
  },
};

export = commitlintPluginJira;
