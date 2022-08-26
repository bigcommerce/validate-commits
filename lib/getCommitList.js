const gitRawCommits = require('git-raw-commits');

const getCommitList = ({ to, from }) => {
  const stream = gitRawCommits({
    to,
    from,
    format: '%ae\n%ce\n%B',
    noMerges: '',
  });

  return new Promise((resolve, reject) => {
    const array = [];

    stream.on('data', (data) => {
      const commit = data.toString('utf8');
      const [author, committer, ...message] = commit.split('\n');

      array.push({
        author,
        committer,
        message: message.join('\n'),
      });
    });
    stream.on('error', reject);
    stream.on('end', () => resolve(array));
  });
};

exports.getCommitList = getCommitList;
