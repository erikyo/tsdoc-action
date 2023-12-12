import {getInput, getMultilineInput, setFailed, info} from '@actions/core'
import {exec} from '@actions/exec'
import {access} from 'node:fs/promises';
import path from "path";
import installTemplate from "./installer";

/**
 * Runs the documentation generation process.
 * First, it parses the inputs and installs the TSDoc template or theme. Then it generates the documentation.
 *
 * @async
 * @return {Promise<string> | Error} The output directory of the generated documentation.
 */
async function run(): Promise<string> {
    try {
        let templateName: string;

        /** Set the GITHUB_WORKSPACE environment variable. */
        const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE

        /** Parse the inputs. */
        const source_dir = getInput('source_dir')

        if (source_dir) {
            try {
                await access(source_dir)
            } catch (error) {
                setFailed('⛔️ Source directory does not exist')
                return;
            }
        }

        /** Parse the inputs. */
        const output_dir = getInput('output_dir')
        const config_file = getInput('config_file')
        const theme = getInput('theme')
        const template_dir = getInput('template_dir')
        const front_page = getInput('front_page')

        const name = getInput('name')
        const exclude = getInput('exclude')
        const tsconfig = getInput('tsconfig')
        const entryPoints = getMultilineInput('entryPoints')
        const entryPointStrategy = getInput('entryPointStrategy')
        const resolveEntrypoints = entryPointStrategy === 'resolve'
        const packagesEntrypoints = entryPointStrategy === 'packages'
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
        await exec('ls', ['-la'])
        await exec('npm', ['install', 'typedoc'])

        if (theme) {
            templateName = await installTemplate(theme)
        }

        const cmd = 'npx typedoc'

        const args = ['--logLevel','Info']


        const srcPath = path.join(GITHUB_WORKSPACE, source_dir)
        args.push(srcPath)
        info('📂 Source directory: ' + srcPath)
        await exec('ls', [ '-la', srcPath ])

        if (output_dir) {
            args.push('--out', path.join(GITHUB_WORKSPACE, output_dir))
        }

        if (config_file) {
            try {
                const configPath = path.join(GITHUB_WORKSPACE, config_file)
                await access(configPath)
            } catch (error) {
                setFailed('⛔️ Config file does not exist')
                return
            }
        }

        if (config_file) {
            const configPath = path.join(GITHUB_WORKSPACE, config_file)
            args.push('--tsconfig', configPath)
        }
        if (theme) {
            args.push('--theme', theme)
        }
        if (template_dir) {
            args.push('--template_dir', path.join(GITHUB_WORKSPACE, '../node_modules/', templateName, template_dir))
        }
        if (front_page) {
            const readmePath = path.join(GITHUB_WORKSPACE, front_page)
            args.push('--readme', readmePath)
        }
        if (getInput('lightHighlightTheme')) {
            args.push('--lightHighlightTheme', getInput('lightHighlightTheme'))
        }
        if (getInput('darkHighlightTheme')) {
            args.push('--darkHighlightTheme', getInput('darkHighlightTheme'))
        }
        if (getInput('customCss')) {
            args.push('--customCss', path.join(GITHUB_WORKSPACE, getInput('customCss')))
        }
        if (getInput('markedOptions')) {
            args.push('--markedOptions', getInput('markedOptions'))
        }
        if (getInput('basePath')) {
            args.push('--basePath', getInput('basePath'))
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
        if (name) {
            args.push('--name', name)
        }
        if (exclude) {
            args.push('--exclude', exclude)
        }
        if (tsconfig) {
            args.push('--tsconfig', tsconfig)
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
        if (readme) {
            args.push('--readme', readme)
        }
        if (stripYamlFrontmatter) {
            args.push('--stripYamlFrontmatter')
        }

        info('📝 Generating documentation')
        await exec(cmd, args)

        return output_dir

    } catch (error) {
        setFailed(error.message)
        process.exit(1)
    }
}

run().then(output_dir => {
    info(`📖 Documentation has been generated to the ${output_dir} folder 📁`)
    process.exit(0)
})
