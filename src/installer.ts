import {debug, info} from '@actions/core'
import {exec} from '@actions/exec'
import {join} from "path";
import getPackageJson from "./utils";

/**
 * Installs a TSDoc template or theme by executing `npm install template/theme --production`.
 * The template/theme needs to be a JavaScript package.
 *
 * @param {string} packageName The TSDoc template or theme to install.
 * @param actionDir The path to the action directory.
 * @async
 * @returns {Promise<string>} The name of the installed template or theme.
 */
export default async function installPackage(packageName: string, actionDir: string = __dirname): Promise<string> {
    const cmd = 'npm'
    const args: string[] = ['i', packageName, '--silent', '--omit=dev']
    debug(`📦 ${packageName} installing in ${actionDir}`)
    debug(`Command: ${cmd} ${args}`)

    let lsOutput = ''
    let lsError = ''

    const options = {
        cwd: actionDir,
        options: {},
        listeners: {
            stdout: (data: { toString: () => string; }) => {
                lsOutput += data.toString()
            },
            stderr: (data: { toString: () => string; }) => {
                lsError += data.toString()
            }
        }
    }
    await exec(cmd, args, options)

    // get the real package location
    await exec('npm', ['ls', packageName, '-p'], options)
    debug(`🖌️ Package installed at ${lsOutput}`)
    if (lsError) info(`🔴 Error: ${lsError}`)
    const packageLocation = lsOutput.trim() // path/to/template

    // get package name from package.json and return it
    const filePath = join(packageLocation + '/package.json')
    const {name} = await getPackageJson(filePath);
    return name
}
