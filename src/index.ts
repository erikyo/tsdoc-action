import {getInput, getMultilineInput, setFailed, info, error} from '@actions/core'
import {exec} from '@actions/exec'
import {join} from "path";
import installPackage from "./installer";
import {existsSync} from "node:fs";

/**
 * Runs the documentation generation process.
 * First, it parses the inputs and installs the TSDoc template or theme. Then it generates the documentation.
 *
 * @async
 * @return {Promise<string> | Error} The output directory of the generated documentation.
 */
async function run(): Promise<string> {
    /** The name of the installed template or theme. */
    let templateName: string;

    /** The name of the installed plugin. */
    let pluginName: string;

    /** Set the GITHUB_WORKSPACE variable. */
    const GITHUB_WORKSPACE: string = process.env.GITHUB_WORKSPACE

    console.log( GITHUB_WORKSPACE, 'current folder' )

    /** The scripts root directory. */
    const actionDir = join(GITHUB_WORKSPACE, '..')

    console.log( actionDir, 'actionDir folder' )

    /** Parse the inputs. */
    const source_dir = getInput('source_dir')

    /** Check if the source directory exists. */
    if (source_dir) {
        if (!existsSync(source_dir)) {
            setFailed('⛔️ Source directory does not exist')
            return;
        }
    }
    /** The output directory. */
    const output_dir = getInput('output_dir')

    try {
        /**
         * Parse the inputs.
         */
        const options = getInput('options')
        const tsconfig = getInput('tsconfig') || 'tsconfig.json'
        const entryPointStrategy = getInput('entryPointStrategy')
        const resolveEntrypoints = entryPointStrategy === 'resolve'
        const packagesEntrypoints = entryPointStrategy === 'packages'

        const install_module = getInput('install_module')
        const theme = getInput('theme')
        const themeColor = getInput('themeColor')
        const plugin = getInput('plugin')
        const template_dir = getInput('template_dir')
        const front_page = getInput('front_page')

        const name = getInput('name')
        const exclude = getInput('exclude')
        const entryPoints = getMultilineInput('entryPoints')
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
         */
        if (install_module) {
            pluginName = await installPackage(install_module, actionDir)
            info(`🆗 ${pluginName} installed`)
        }

        /**
         * The cmd variable represents the command to execute Typedoc.
         *
         * @type {string}
         */
        const cmd: string = 'npx typedoc'

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


        if (getInput('logLevel')) {
            args.push('--logLevel', getInput('logLevel'))
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
         * The path to the source directory
         */
        const srcPath: string = join(GITHUB_WORKSPACE, source_dir)
        info('📂 Source directory: ' + srcPath)
        args.push(srcPath)

        if (output_dir) {
            args.push('--out', join(GITHUB_WORKSPACE, output_dir))
        }


        /**
         * the path to the tsconfig file, needed to resolve entry points and other options. Defaults to ./{action folder}/tsconfig.json
         * https://typedoc.org/options/input/#resolve-(default)
         */
        if (tsconfig) {
            const tsConfigPath = join(GITHUB_WORKSPACE, tsconfig)
            if (existsSync(tsConfigPath)) {
                setFailed('⛔️ Config file does not exist')
                return
            }

            const configPath = join(GITHUB_WORKSPACE, tsconfig)
            args.push('--tsconfig', configPath)
        }

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
        if (templateName) {
            args.push('--template_dir', join(GITHUB_WORKSPACE, '../node_modules/', templateName, template_dir))
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
        if (tsconfig) {
            args.push('--tsconfig', tsconfig)
        }

        if (front_page) {
            const readmePath = join(GITHUB_WORKSPACE, front_page)
            args.push('--readme', readmePath)
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
        if (entryPoints) {
            entryPoints.forEach(entryPoint => args.push('--entryPoints', entryPoint))
        }
        if (resolveEntrypoints) {
            args.push('--entryPointStrategy', 'resolve')
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

        info('📝 Generating documentation')
        await exec(cmd, args, {cwd: actionDir})

        return output_dir

    } catch (err) {
        error(`🔴 Something went wrong while generating documentation`)
        error(`Current paths: workingDirectory: ${GITHUB_WORKSPACE} actionDir: ${actionDir}`)
        setFailed( err.message )
        process.exit(1)
    }
}

/**
 *
 */
run().then(output_dir => {
    info(`📖 Documentation has been generated to the ${output_dir} folder 📁`)
    process.exit(0)
})
