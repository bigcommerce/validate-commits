import { Rule } from '@commitlint/types';

export const SUBJECT_START_JIRA = 'subject-start-jira';

export const subjectStartJira: Rule = ({ subject }, applicable) => {
  const invert = applicable === 'never';
  const jiraTicket = subject?.match(/[A-Z]{2,}-\d+/);

  if (invert) {
    return [!jiraTicket, 'Subject cannot contain a JIRA ticket.'];
  }

  return [!!jiraTicket, 'Subjuct must contain a JIRA ticket.'];
};
