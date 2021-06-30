export = {
  extends: ['@commitlint/config-conventional'],
  plugins: ['@bigcommerce/commitlint-plugin-jira'],
  rules: {
    'subject-case': [2, 'never', ['start-case', 'pascal-case']],
    'jira-project-key': [0, 'always'],
    'subject-start-jira': [2, 'always'],
    'scope-case': [2, 'always', 'lower-case'],
  },
};
