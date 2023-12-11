var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
/**
 * Installs a TSDoc template or theme by executing `npm install template/theme --production`.
 * The template/theme needs to be a JavaScript package.
 * @param {string} template The TSDoc template or theme to install.
 * @async
 * @returns {Promise<string>} The name of the installed template or theme.
 */
function installTemplate(template) {
    return __awaiter(this, void 0, void 0, function* () {
        let templateName = '';
        const actionDir = path.join(__dirname, '../');
        core.debug(`actionDir: ${actionDir}`);
        const cmd = 'npm';
        const args = ['install', template, '--production'];
        core.info(`Installing TSDoc template/theme: ${template}`);
        core.debug(`Command: ${cmd} ${args}`);
        const options = {};
        options.cwd = actionDir;
        yield exec.exec(cmd, args, options);
        let lsOutput = '';
        let lsError = '';
        options.listeners = {
            stdout: (data) => {
                lsOutput += data.toString();
            },
            stderr: (data) => {
                lsError += data.toString();
            }
        };
        yield exec.exec('npm', ['ls', template, '-p'], options);
        core.debug(`Template/theme location: ${lsOutput}`);
        if (lsError)
            core.info(`Error: ${lsError}`);
        const packageLocation = lsOutput.trim(); // path/to/template
        const filePath = path.join(packageLocation + '/package.json');
        templateName = yield utils.getPackageName(filePath);
        return templateName;
    });
}
module.exports = {
    installTemplate
};
