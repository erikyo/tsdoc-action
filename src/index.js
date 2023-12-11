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
    const output_dir = core.getInput('output_dir')
    const config_file = core.getInput('config_file')
    const theme = core.getInput('theme')
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
    const excludeExternals = core.getInput('excludeExternals')
    const excludeNotDocumented = core.getInput('excludeNotDocumented')
    const excludeNotDocumentedKinds = core.getMultilineInput('excludeNotDocumentedKinds')
    const excludeInternal = core.getInput('excludeInternal')
    const excludePrivate = core.getInput('excludePrivate')
    const excludeProtected = core.getInput('excludeProtected')
    const excludeReferences = core.getInput('excludeReferences')
    const excludeCategories = core.getMultilineInput('excludeCategories')
    const includeVersion = core.getInput('includeVersion')
    const disableSources = core.getInput('disableSources')
    const sourceLinkTemplate = core.getInput('sourceLinkTemplate')
    const gitRevision = core.getInput('gitRevision')
    const gitRemote = core.getInput('gitRemote')
    const disableGit = core.getInput('disableGit')
    const readme = core.getInput('readme')
    const stripYamlFrontmatter = core.getInput('stripYamlFrontmatter')

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

    if (theme) {
      templateName = await installer.installTemplate(theme)
    }

    const typedocPath = path.join(__dirname, '../node_modules/typedoc/bin/typedoc')

    const cmd = 'node'
    const args = [typedocPath]

    if (source_dir) {
      const srcPath = path.join(GITHUB_WORKSPACE, source_dir)
      args.push(srcPath)
    }
    if (output_dir) {
      args.push('--out', path.join(GITHUB_WORKSPACE, output_dir))
    }
    if (config_file) {
      const configPath = path.join(GITHUB_WORKSPACE, config_file)
      args.push('--tsconfig', configPath)
    }
    if (theme) {
      args.push('--theme', template)
    }
    if (template_dir) {
      args.push('--template_dir', path.join(GITHUB_WORKSPACE, '../node_modules/', templateName, template_dir))
    }
    if (front_page) {
      const readmePath = path.join(GITHUB_WORKSPACE, front_page)
      args.push('--readme', readmePath)
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

    core.info('📝 Generating documentation')
    await exec.exec(cmd, args)

    core.info(`🎉 Documentation 📖 has been generated to the ${output_dir} folder 📁`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
