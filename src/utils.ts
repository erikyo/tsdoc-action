import {setFailed} from '@actions/core'
import fs from "fs";
import {promisify} from "util";

/**
 * Retrieves the package data from a package.json file.
 *
 * @param {string} filePath - The path to the package.json file.
 * @returns {Promise<Object>} - The package name.
 *
 */
export default async function getPackageJson (filePath: string): Promise<{ name: string }> {
  const readFile = promisify(fs.readFile)
  const fileContents = await readFile(filePath, 'utf8')
  /** Parse the package.json file. */
  try {
    return JSON.parse(fileContents) as { name: string }
  } catch (error) {
    setFailed('🔴 There was an error reading "name" entry in package.json file')
  }
}
