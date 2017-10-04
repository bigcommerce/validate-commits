const exec = require('child_process').exec;

class ShellRunner {
    run(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    return reject(stderr);
                }

                return resolve(stdout);
            });
        });
    }
}

module.exports = new ShellRunner();
