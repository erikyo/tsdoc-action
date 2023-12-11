const core = require('@actions/core');
const fs = require('fs');
const util = require('util');

async function getPackageName(filePath) {
    let name = '';
    const readFile = util.promisify(fs.readFile);
    let fileContents = await readFile(filePath, 'utf8');
    try {
        let data = JSON.parse(fileContents);
        name = data.name;
    } catch (error) {
        core.setFailed('There was an error reading "name" entry in package.json file');
    }
    return name;
}

module.exports = {
    getPackageName
};
