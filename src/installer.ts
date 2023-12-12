import {debug, info} from '@actions/core'
import {exec} from '@actions/exec'
import {join} from "path";
import getPackageJson from "./utils";

/**
 * Installs a TSDoc template or theme by executing `npm install template/theme --production`.
 * The template/theme needs to be a JavaScript package.
 *
 * @param {string} template The TSDoc template or theme to install.
 * @async
 * @returns {Promise<string>} The name of the installed template or theme.
 */
export default async function installPackage (template: string) : Promise<string> {
  const actionDir = join(__dirname, '../')
  debug(`actionDir: ${actionDir}`)

  const cmd = 'npm'
  const args: string[] = ['install', template, '--silent', '--production']
  info(`📦 Installing TSDoc template/theme/plugin: ${template}`)
  debug(`Command: ${cmd} ${args}`)

  const options = {
    cwd: actionDir,
    options: {},
    listeners : {}
  }

  await exec(cmd, args, options)

  let lsOutput = ''
  let lsError = ''
  options.listeners = {
    stdout: (data: { toString: () => string; }) => {
      lsOutput += data.toString()
    },
    stderr: (data: { toString: () => string; }) => {
      lsError += data.toString()
    }
  }

  await exec('npm', ['ls', template, '-p'], options)
  debug(`🖌️ Template location: ${lsOutput}`)
  if (lsError) info(`🔴 Error: ${lsError}`)
  const packageLocation = lsOutput.trim() // path/to/template

  // get package name from package.json and return it
  const filePath = join(packageLocation + '/package.json')
  const { name } = await getPackageJson(filePath);
  return  name
}
