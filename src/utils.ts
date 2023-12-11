import {setFailed} from '@actions/core'
import fs from "fs";
import util from "util";

/**
 * Retrieves the package name from a package.json file.
 *
 * @param {string} filePath - The path to the package.json file.
 * @returns {Promise<string>} - The package name.
 *
 */
export default async function getPackageName (filePath: string): Promise<string> {
  let name = ''
  const readFile = util.promisify(fs.readFile)
  const fileContents = await readFile(filePath, 'utf8')
  try {
    const data = JSON.parse(fileContents)
    name = data.name
  } catch (error) {
    setFailed('🔴 There was an error reading "name" entry in package.json file')
  }
  return name
}
