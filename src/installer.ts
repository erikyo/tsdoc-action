import {debug, info} from '@actions/core'
import {exec} from '@actions/exec'
import path from "path";
import getPackageName from "./utils";

/**
 * Installs a TSDoc template or theme by executing `npm install template/theme --production`.
 * The template/theme needs to be a JavaScript package.
 *
 * @param {string} template The TSDoc template or theme to install.
 * @async
 * @returns {Promise<string>} The name of the installed template or theme.
 */
export default async function installTemplate (template: string) : Promise<string> {
  let templateName = ''
  const actionDir = path.join(__dirname, '../')
  debug(`actionDir: ${actionDir}`)

  const cmd = 'npm'
  const args: string[] = ['install', template, '--production']
  info(`📦 Installing TSDoc template/theme: ${template}`)
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

  const filePath = path.join(packageLocation + '/package.json')
  templateName = await getPackageName(filePath)

  return templateName
}
