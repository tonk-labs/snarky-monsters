const exec = require('child_process').execFile;
const path = require('path');

const modelExe = path.join(__dirname, '..', '..', 'model', 'update_model');

/**
 * Function to execute exe
 * @param {string} fileName The name of the executable file to run.
 * @param {string[]} params List of string arguments.
 * @param {string} path Current working directory of the child process.
 */
function execute(fileName, params, path) {
    let promise = new Promise((resolve, reject) => {
        exec(fileName, params, { cwd: path }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });

    });
    return promise;
}

execute(modelExe, [
    path.join(__dirname, '..', 'src', 'model')
], path.dirname(modelExe)).then((accept, reject) => {
    if (reject) {
        console.error("Script failed: ", reject);
    }
});