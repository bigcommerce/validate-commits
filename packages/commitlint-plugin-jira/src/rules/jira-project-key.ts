import { Rule } from '@commitlint/types';

export const jiraProjectKey: Rule<string[]> = ({ subject }, applicable, projects) => {
  const invert = applicable === 'never';
  const jiraTicket = subject?.match(/[A-Z]{2,}-\d+/);

  if (projects && projects.length) {
    if (jiraTicket && jiraTicket.length === 1) {
      const projectsStr = projects.join(', ');
      const containsKey = projects.reduce(
        (acc, project) => acc || jiraTicket[0].includes(project),
        false,
      );

      if (invert) {
        return [
          !containsKey,
          `JIRA Ticket cannot be from one of the following projects: ${projectsStr}.`,
        ];
      }

      return [
        containsKey,
        `JIRA Ticket must be from one of the following projects: ${projectsStr}.`,
      ];
    }
  }

  return [true, ''];
};
