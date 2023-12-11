import * as core from '@actions/core'
import * as exec from '@actions/exec'
import fs from "fs";
import path from "path";
import getPackageName from "./utils";

/**
 * Installs a TSDoc template or theme by executing `npm install template/theme --production`.
 * The template/theme needs to be a JavaScript package.
 * @param {string} template The TSDoc template or theme to install.
 * @async
 * @returns {Promise<string>} The name of the installed template or theme.
 */
export default async function installTemplate (template) {
  let templateName = ''
  const actionDir = path.join(__dirname, '../')
  core.debug(`actionDir: ${actionDir}`)

  const cmd = 'npm'
  const args = ['install', template, '--production']
  core.info(`Installing TSDoc template/theme: ${template}`)
  core.debug(`Command: ${cmd} ${args}`)

  const options = {
    cwd: actionDir,
    options: {},
    listeners : {}
  }

  await exec.exec(cmd, args, options)

  let lsOutput = ''
  let lsError = ''
  options.listeners = {
    stdout: (data) => {
      lsOutput += data.toString()
    },
    stderr: (data) => {
      lsError += data.toString()
    }
  }

  await exec.exec('npm', ['ls', template, '-p'], options)
  core.debug(`Template/theme location: ${lsOutput}`)
  if (lsError) core.info(`Error: ${lsError}`)
  const packageLocation = lsOutput.trim() // path/to/template

  const filePath = path.join(packageLocation + '/package.json')
  templateName = await getPackageName(filePath)

  return templateName
}
