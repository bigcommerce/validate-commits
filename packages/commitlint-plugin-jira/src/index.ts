import { AsyncRule, Rule, SyncRule } from '@commitlint/types';

import { jiraProjectKey, subjectStartJira } from './rules';

export enum CommitlintPluginJiraKeys {
  JiraProjectKey = 'jira-project-key',
  SubjectStartJira = 'subject-start-jira',
}

// Waiting for this to get merged in:
// https://github.com/conventional-changelog/commitlint/pull/2146
export interface Plugin {
  rules: {
    [ruleName: string]: Rule | AsyncRule | SyncRule;
  };
}

export const commitlintPluginJira: Plugin = {
  rules: {
    [CommitlintPluginJiraKeys.JiraProjectKey]: jiraProjectKey,
    [CommitlintPluginJiraKeys.SubjectStartJira]: subjectStartJira,
  },
};
