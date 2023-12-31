import {getInput, getMultilineInput, setFailed, info, error} from '@actions/core'
import {exec} from '@actions/exec'
import {join} from "path";
import installPackage from "./installer";
import {existsSync} from "node:fs";
import {glob} from "glob";

/**
 * Runs the documentation generation process.
 * First, it parses the inputs and installs the TSDoc template or theme. Then it generates the documentation.
 *
 * @async
 * @return {Promise<string> | Error} The output directory of the generated documentation.
 */
async function run(): Promise<string|Error> {

    /** Set the GITHUB_WORKSPACE variable. */
    const GITHUB_WORKSPACE: string = process.env.GITHUB_WORKSPACE

    /**
     * The variable 'args' is an array of strings.
     * It is used to hold command line arguments passed to typedoc function.
     * Each element in the array represents a separate command line argument.
     *
     * @type {string[]}
     * @example
     * // Empty array
     * const args = [];
     *
     * // Array with command line arguments
     * const args = ['arg1', 'arg2', 'arg3'];
     */
    const args: string[] = []

    /**
     * The cmd variable represents the command to execute Typedoc.
     */
    const cmd: string = 'npx typedoc'

    console.log( GITHUB_WORKSPACE, 'current folder' )

    /** The scripts root directory. */
    const actionDir: string = join(GITHUB_WORKSPACE, '..')

    console.log( actionDir, 'actionDir folder' )

    /** The source directory. */
    const source_dir: string = getInput('source_dir')

    /** Check if the source directory exists. */
    if (source_dir) {
        if (!await glob(join(GITHUB_WORKSPACE, source_dir))) {
            throw new Error('⛔️ Source directory does not exist')
        }

        /**
         * The path to the source directory
         */
        const srcPath: string = join(GITHUB_WORKSPACE, source_dir)
        info('📂 Source directory: ' + srcPath)
        args.push(srcPath)
    }

    /** The entry points */
    const entryPointsPattern = getMultilineInput('entryPoints')
    // Validate the existence of entry points based on the wildcard pattern.
    await Promise.all(
        entryPointsPattern.map(async (pattern) => {
            const matchingFiles = await glob(join(GITHUB_WORKSPACE, pattern));
            if (matchingFiles.length === 0) {
                throw new Error(`⛔️ Entry point does not exist: ${pattern}`);
            }
            info('✳️ Adding entry point: ' + pattern)
            args.push('--entryPoints', join(GITHUB_WORKSPACE, pattern));
        })
    );

    /** If at this moment there are no entry points, throw an error and exit. */
    if (args.length === 0) {
        throw new Error('⛔️ No entry point found, please provide a "source_dir" or "entryPoints" in order to generate the documentation');
    }

    const entryPointStrategy = getInput('entryPointStrategy')
    const resolveEntrypoints = entryPointStrategy === 'resolve'
    const packagesEntrypoints = entryPointStrategy === 'packages'
    if (resolveEntrypoints) {
        args.push('--entryPointStrategy', 'resolve')
    }

    /** The output directory. */
    const output_dir = getInput('output_dir')

    /**
     * Parse the inputs.
     */
    const options = getInput('options')
    const tsconfig = getInput('tsconfig')

    const install_module = getInput('install_module')
    const theme = getInput('theme')
    const themeColor = getInput('themeColor')
    const plugin = getInput('plugin')
    const front_page = getInput('front_page')

    const name = getInput('name')
    const exclude = getInput('exclude')
    const externalPattern = getMultilineInput('externalPattern')
    const excludeExternals = getInput('excludeExternals')
    const excludeNotDocumented = getInput('excludeNotDocumented')
    const excludeNotDocumentedKinds = getMultilineInput('excludeNotDocumentedKinds')
    const excludeInternal = getInput('excludeInternal')
    const excludePrivate = getInput('excludePrivate')
    const excludeProtected = getInput('excludeProtected')
    const excludeReferences = getInput('excludeReferences')
    const excludeCategories = getMultilineInput('excludeCategories')
    const includeVersion = getInput('includeVersion')
    const disableSources = getInput('disableSources')
    const sourceLinkTemplate = getInput('sourceLinkTemplate')
    const gitRevision = getInput('gitRevision')
    const gitRemote = getInput('gitRemote')
    const disableGit = getInput('disableGit')
    const readme = getInput('readme')
    const stripYamlFrontmatter = getInput('stripYamlFrontmatter')

    /**
     * Install typedoc
     */
    await installPackage('typedoc', actionDir)
    info('🆗 Typedoc installed')

    /**
     * Install additional modules
     * TODO: Add support for multiple modules in the future
     * TODO: Install multiple modules at once (including typedoc)
     */
    if (install_module) {
        const pluginName = await installPackage(install_module, actionDir)
        info(`🆗 ${pluginName} installed`)
    }

    /**
     * The base path of the package to be documented.
     * Since the base path is relative to the current working directory,
     * we need to use the GITHUB_WORKSPACE variable.
     */
    const basePath = getInput('basePath');
    if (basePath) {
        args.push('--basePath', join(GITHUB_WORKSPACE, basePath))
    } else {
        args.push('--basePath', GITHUB_WORKSPACE)
    }

    /**
     * The output directory for the generated documentation.
     */
    if (output_dir) {
        args.push('--out', join(GITHUB_WORKSPACE, output_dir))
    }

    /**
     * The path to the tsconfig file, needed to resolve entry points and other options.
     * typedoc will search for the tsconfig file in the action directory, so we have to point it to the workspace folder
     * Defaults to ./{action folder}/tsconfig.json
     *
     * https://typedoc.org/options/input/#resolve-(default)
     *
     */
    let tsConfigPath: string;
    if (tsconfig) {
        tsConfigPath = join(GITHUB_WORKSPACE, tsconfig)
    } else {
        tsConfigPath = join(GITHUB_WORKSPACE, "tsconfig.json")
    }
    if ( ! existsSync(tsConfigPath) ) {
        throw new Error(`⛔️ Tsconfig file not found in the workspace folder ${tsConfigPath}`)
    }
    args.push('--tsconfig', tsConfigPath)

    /**
     * The typedoc options file
     */
    if (options) {
        const configPath = join(GITHUB_WORKSPACE, options)
        args.push('--options', configPath)
    }
    if (plugin) {
        args.push('--plugin', plugin)
    }
    if (theme) {
        args.push('--theme', theme)
    }
    if (theme && themeColor) {
        args.push('--themeColor', themeColor)
    }
    if (readme) {
        args.push('--readme', readme)
    }
    if (name) {
        args.push('--name', name)
    }
    if (exclude) {
        args.push('--exclude', exclude)
    }

    if (front_page) {
        const readmePath = join(GITHUB_WORKSPACE, front_page)
        args.push('--readme', readmePath)
    }
    if (getInput('skipErrorChecking')) {
        args.push('--skipErrorChecking', getInput('skipErrorChecking'))
    }
    if (getInput('lightHighlightTheme')) {
        args.push('--lightHighlightTheme', getInput('lightHighlightTheme'))
    }
    if (getInput('darkHighlightTheme')) {
        args.push('--darkHighlightTheme', getInput('darkHighlightTheme'))
    }
    if (getInput('customCss')) {
        args.push('--customCss', join(GITHUB_WORKSPACE, getInput('customCss')))
    }
    if (getInput('markedOptions')) {
        args.push('--markedOptions', getInput('markedOptions'))
    }
    if (getInput('cname')) {
        args.push('--cname', getInput('cname'))
    }
    if (getInput('sourceLinkExternal')) {
        args.push('--sourceLinkExternal')
    }
    if (getInput('htmlLang')) {
        args.push('--htmlLang', getInput('htmlLang'))
    }
    if (getInput('githubPages')) {
        args.push('--githubPages', getInput('githubPages'))
    }
    if (getInput('cacheBust')) {
        args.push('--cacheBust')
    }
    if (getInput('gaID')) {
        args.push('--gaID', getInput('gaID'))
    }
    if (getInput('hideParameterTypesInTitle')) {
        args.push('--hideParameterTypesInTitle', getInput('hideParameterTypesInTitle'))
    }
    if (getInput('hideGenerator')) {
        args.push('--hideGenerator')
    }
    if (getInput('searchInComments')) {
        args.push('--searchInComments')
    }
    if (getInput('cleanOutputDir')) {
        args.push('--cleanOutputDir', getInput('cleanOutputDir'))
    }
    if (getInput('titleLink')) {
        args.push('--titleLink', getInput('titleLink'))
    }
    if (packagesEntrypoints) {
        args.push('--entryPointStrategy', 'packages')
    }
    if (externalPattern) {
        externalPattern.forEach(pattern => args.push('--externalPattern', pattern))
    }
    if (excludeExternals) {
        args.push('--excludeExternals')
    }
    if (excludeNotDocumented) {
        args.push('--excludeNotDocumented')
    }
    if (excludeNotDocumentedKinds) {
        excludeNotDocumentedKinds.forEach(kind => args.push('--excludeNotDocumentedKinds', kind))
    }
    if (excludeInternal) {
        args.push('--excludeInternal')
    }
    if (excludePrivate) {
        args.push('--excludePrivate')
    }
    if (excludeProtected) {
        args.push('--excludeProtected')
    }
    if (excludeReferences) {
        args.push('--excludeReferences')
    }
    if (excludeCategories) {
        excludeCategories.forEach(category => args.push('--excludeCategories', category))
    }
    if (includeVersion) {
        args.push('--includeVersion')
    }
    if (disableSources) {
        args.push('--disableSources')
    }
    if (sourceLinkTemplate) {
        args.push('--sourceLinkTemplate', sourceLinkTemplate)
    }
    if (gitRevision) {
        args.push('--gitRevision', gitRevision)
    }
    if (gitRemote) {
        args.push('--gitRemote', gitRemote)
    }
    if (disableGit) {
        args.push('--disableGit')
    }
    if (stripYamlFrontmatter) {
        args.push('--stripYamlFrontmatter')
    }
    if (getInput('showConfig')) {
        args.push('--showConfig')
    }

    /**
     * The log level to use
     * Possible values: Verbose, Debug, Info, Warn, Error, None
     */
    if (getInput('logLevel')) {
        args.push('--logLevel', getInput('logLevel'))
    }

    info('📝 Generating documentation')

    try {
        await exec(cmd, args, {cwd: actionDir})

        return output_dir

    } catch (err) {
        throw new Error( err.message )
    }
}

/**
 * Main function to run the script
 */
run()
    .then(output_dir => {
        if (!output_dir) {
            error(`🔴 Something went wrong while generating documentation`)
            process.exit(1)
        }
        info(`📖 Documentation has been generated to the ${output_dir} folder 📁`)
        process.exit()
    })
    .catch(err => {
        setFailed(err)
    })
