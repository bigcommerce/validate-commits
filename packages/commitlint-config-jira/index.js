module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: ['@bigcommerce/commitlint-plugin-jira'],
  rules: {
    'jira-project-key': [0, 'always'],
    'subject-start-jira': [2, 'always'],
  },
};
