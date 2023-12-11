const core = require('@actions/core')
const exec = require('@actions/exec')
const fs = require('fs').promises
const path = require('path')
const installer = require('./installer')

async function run () {
  try {
    let templateName

    const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE

    const source_dir = core.getInput('source_dir')
    const recurse = core.getInput('recurse')
    const output_dir = core.getInput('output_dir')
    const config_file = core.getInput('config_file')
    const input_template_name = core.getInput('template_name') // Deprecated in favor of "template".
    const template = core.getInput('template') || input_template_name
    const template_dir = core.getInput('template_dir')
    const front_page = core.getInput('front_page')

    const name = core.getInput('name')
    const exclude = core.getInput('exclude')
    const tsconfig = core.getInput('tsconfig')
    const entryPoints = core.getMultilineInput('entryPoints')
    const entryPointStrategy = core.getInput('entryPointStrategy')
    const resolveEntrypoints = entryPointStrategy === 'resolve'
    const packagesEntrypoints = entryPointStrategy === 'packages'
    const externalPattern = core.getMultilineInput('externalPattern')
    const excludeExternals = core.getBooleanInput('excludeExternals')
    const excludeNotDocumented = core.getBooleanInput('excludeNotDocumented')
    const excludeNotDocumentedKinds = core.getMultilineInput('excludeNotDocumentedKinds')
    const excludeInternal = core.getBooleanInput('excludeInternal')
    const excludePrivate = core.getBooleanInput('excludePrivate')
    const excludeProtected = core.getBooleanInput('excludeProtected')
    const excludeReferences = core.getBooleanInput('excludeReferences')
    const excludeCategories = core.getMultilineInput('excludeCategories')
    const includeVersion = core.getBooleanInput('includeVersion')
    const disableSources = core.getBooleanInput('disableSources')
    const sourceLinkTemplate = core.getInput('sourceLinkTemplate')
    const gitRevision = core.getInput('gitRevision')
    const gitRemote = core.getInput('gitRemote')
    const disableGit = core.getBooleanInput('disableGit')
    const readme = core.getInput('readme')
    const stripYamlFrontmatter = core.getBooleanInput('stripYamlFrontmatter')

    if (input_template_name) {
      core.warning('❗The "template_name" input variable is deprecated in favor of "template"')
    }

    if (source_dir) {
      try {
        const srcPath = path.join(GITHUB_WORKSPACE, source_dir)
        await fs.access(srcPath)
      } catch (error) {
        core.setFailed('⛔️ Source directory does not exist')
        return
      }
    }

    if (config_file) {
      try {
        const configPath = path.join(GITHUB_WORKSPACE, config_file)
        await fs.access(configPath)
      } catch (error) {
        core.setFailed('⛔️ Config file does not exist')
        return
      }
    }

    if (template) {
      templateName = await installer.installTemplate(template)
    }

    const typedocPath = path.join(__dirname, '../node_modules/typedoc/bin/typedoc')

    const cmd = 'node'
    const args = [typedocPath]

    if (source_dir) {
      const srcPath = path.join(GITHUB_WORKSPACE, source_dir)
      args.push(srcPath)
    }
    if (recurse) {
      args.push('--recurse')
    }
    if (config_file) {
      const configPath = path.join(GITHUB_WORKSPACE, config_file)
      args.push('--tsconfig', configPath)
    }
    if (template) {
      args.push('--theme', template)
    }
    if (front_page) {
      const readmePath = path.join(GITHUB_WORKSPACE, front_page)
      args.push('--readme', readmePath)
    }
    if (output_dir) {
      args.push('--out', path.join(GITHUB_WORKSPACE, output_dir))
    }
    if (core.getInput('lightHighlightTheme')) {
      args.push('--lightHighlightTheme', core.getInput('lightHighlightTheme'))
    }
    if (core.getInput('darkHighlightTheme')) {
      args.push('--darkHighlightTheme', core.getInput('darkHighlightTheme'))
    }
    if (core.getInput('customCss')) {
      args.push('--customCss', path.join(GITHUB_WORKSPACE, core.getInput('customCss')))
    }
    if (core.getInput('markedOptions')) {
      args.push('--markedOptions', core.getInput('markedOptions'))
    }
    if (core.getInput('basePath')) {
      args.push('--basePath', core.getInput('basePath'))
    }
    if (core.getInput('cname')) {
      args.push('--cname', core.getInput('cname'))
    }
    if (core.getInput('sourceLinkExternal')) {
      args.push('--sourceLinkExternal')
    }
    if (core.getInput('htmlLang')) {
      args.push('--htmlLang', core.getInput('htmlLang'))
    }
    if (core.getInput('githubPages')) {
      args.push('--githubPages', core.getInput('githubPages'))
    }
    if (core.getInput('cacheBust')) {
      args.push('--cacheBust')
    }
    if (core.getInput('gaID')) {
      args.push('--gaID', core.getInput('gaID'))
    }
    if (core.getInput('hideParameterTypesInTitle')) {
      args.push('--hideParameterTypesInTitle', core.getInput('hideParameterTypesInTitle'))
    }
    if (core.getInput('hideGenerator')) {
      args.push('--hideGenerator')
    }
    if (core.getInput('searchInComments')) {
      args.push('--searchInComments')
    }
    if (core.getInput('cleanOutputDir')) {
      args.push('--cleanOutputDir', core.getInput('cleanOutputDir'))
    }
    if (core.getInput('titleLink')) {
      args.push('--titleLink', core.getInput('titleLink'))
    }

    core.info('📝 Generating documentation')
    await exec.exec(cmd, args)

    core.info(`🎉 Documentation 📖 has been generated to the ${output_dir} folder 📁`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
