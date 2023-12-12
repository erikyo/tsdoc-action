# tsdoc-action

> A GitHub Action to build TypeDoc documentation

This is a GitHub Action to build your TypeScript documentation with [TypeDoc](https://typedoc.org/). This action can easily be combined with other deployment actions, in order to publish the generated documentation to, for example, [GitHub Pages](https://pages.github.com). TypeDoc [templates](https://typedoc.org/guides/options/) are also supported.

This action is a fork of the [jsdoc-action](https://github.com/andstor/jsdoc-action) by [André Storhaug](https://github.com/andstor).

The following example [workflow step](https://help.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow) will generate documentation for all source files in the `./src` directory and output the built files to the `./out` directory.

```yml
- name: Build
  uses: erikyo/tsdoc-action@v1
  with:
    source_dir: ./src
    recurse: true
    output_dir: ./out
```

## Supported platforms

The tsdoc-action is a JavaScript action and is supported on both Linux, MacOS, and Windows. The action supports stable versions of Node.js 16 and later.

| OS (runs-on) | ubuntu-latest | macos-latest | windows-latest |
| ---          |:---:          |:---:         |:---:           |
| Support      | ✅️             | ✅️            | ✅️             |

## Options ⚙️

The following input variables options can/must be configured:

Certainly! Here's an updated version of your README table with some corrections and additions:

| Input variable              |Necessity| Description                                                                                                                                           | Default                       |
|-----------------------------|----|-------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------|
| `entryPoints`               |Optional| Entry points for TypeDoc to analyze. same as `source_dir`                                                                                             |                               |
| `output_dir`                |Optional| Output folder for the generated documentation.                                                                                                        | `./out`                       |
| `options`                   |Optional| The path to a TypeDoc configuration file. see https://typedoc.org/options/configuration/#options                                                      |                               |
| `tsconfig`                  |Optional| The path to a tsconfig.json file. Defaults to ./tsconfig.json                                                                                         | `./tsconfig.json `            |
| `name`                      |Optional| Set the name of the project that will be used in the header of the template.                                                                          | Package name from package.json |
| `titleLink`                 |Optional| Link the title in the header points to.                                                                                                               |                               |
| `entryPointStrategy`        |Optional| Strategy for determining entry points. Valid options are 'resolve' or 'packages'.                                                                     |                               |
| `install_module`            |Optional| The Plugin, theme, template npm package name that you need to install.                                                                                |                               | 
| `plugin`                    |Optional| The TypeDoc plugin that you want to use. Requires to be installed using `install_module`.                                                   |                               |
| `theme`                     |Optional| The TypeDoc template or theme. Requires the theme to be installed using `install_module`.                                                             |                               |
| `theme_dir`                 |Optional| The relative location of the template files directory within the template package.                                                                    |                               |
| `themeColor`                |Optional| The base color for your theme/template.                                                                                                               |                               |
| `front_page`                |Optional| The path to a Markdown file to be used as the front page. Normally `README.md`.                                                                       |                               |
| `basePath`                  |Optional| Base path to be used when displaying file paths.                                                                                                      |                               |
| `excludeInternal`           |Optional| Removes symbols annotated with the `@internal` doc tag.                                                                                               | `true`                        |
| `excludePrivate`            |Optional| Removes private class members from the generated documentation.                                                                                       | `false`                       |
| `excludeProtected`          |Optional| Removes protected class members from the generated documentation.                                                                                     | `false`                       |
| `excludeReferences`         |Optional| Removes re-exports of a symbol already included in the documentation from the documentation.                                                          | `false`                       |
| `excludeCategories`         |Optional| Removes reflections associated with any of the given categories.                                                                                      |                               |
| `includeVersion`            |Optional| Includes the version according to package.json in generated documentation.                                                                            | `false`                       |
| `disableSources`            |Optional| Disables capturing where reflections are declared when converting input.                                                                              | `false`                       |
| `sourceLinkTemplate`        |Optional| Specify a link template to be used when generating source urls.                                                                                       |                               |
| `gitRevision`               |Optional| Use specified revision or branch instead of the last revision for linking to source files.                                                            |                               |
| `gitRemote`                 |Optional| Use the specified git remote instead of origin for linking to source files.                                                                           |                               |
| `disableGit`                |Optional| Prevents TypeDoc from using Git to try to determine if sources can be linked.                                                                         | `false`                       |
| `readme`                    |Optional| Path to the readme file that should be displayed on the index page.                                                                                   |                               |
| `stripYamlFrontmatter`      |Optional| Remove YAML frontmatter from the readme file displayed on the main page.                                                                              | `false`                       |
| `lightHighlightTheme`       |Optional| The Shiki theme to be used to highlight code snippets in light mode.                                                                                  |                               |
| `darkHighlightTheme`        |Optional| The Shiki theme to be used to highlight code snippets in dark mode.                                                                                   |                               |
| `customCss`                 |Optional| Extra CSS file to be copied into the assets directory and referenced by the theme.                                                                    |                               |
| `markedOptions`             |Optional| Options to be forwarded to Marked when parsing doc comments.                                                                                          |                               |
| `cname`                     |Optional| Text for creating a CNAME file in the output directory.                                                                                               |                               |
| `sourceLinkExternal`        |Optional| Treat source links as external links that open in a new tab when generating HTML.                                                                     |                               |
| `htmlLang`                  |Optional| Sets the lang attribute in TypeDocs HTML output.                                                                                                      |                               |
| `githubPages`               |Optional| Automatically add a .nojekyll file to the output directory to prevent GitHub Pages from processing your documentation site using Jekyll.              |                               |
| `cacheBust`                 |Optional| Include the generation time in <script> and <link> tags to JS/CSS assets to prevent assets from a previous build of the documentation from being used. |                               |
| `gaID`                      |Optional| Set the Google Analytics tracking ID and activate tracking code.                                                                                      |                               |
| `hideParameterTypesInTitle` |Optional| Hide parameter types in the signature "title" for easier scanning.                                                                                    |                               |
| `hideGenerator`             |Optional| Do not print the TypeDoc link at the end of the page.                                                                                                 |                               |
| `searchInComments`          |Optional| Enables searching comment text in the generated documentation site.                                                                                   |                               |
| `cleanOutputDir`            |Optional| Prevent TypeDoc from cleaning the output directory specified with --out.                                                                              |                               |
| `externalPattern`           |Optional| Patterns for external packages that should be included in the documentation.                                                                          |                               |
| `excludeExternals`          |Optional| Prevent externally resolved TypeScript files from being documented. Defaults to `false`.                                                              | `false`                       |
| `excludeNotDocumented`      |Optional| Exclude symbols that are not explicitly documented. Defaults to `false`.                                                                              | `false`                       |
| `excludeNotDocumentedKinds` |Optional| Exclude symbols of the given kinds if they are not explicitly documented.                                                                             |                               |
| `excludeInternal`           |Optional| Exclude symbols marked with the `@internal` tag. Defaults to `false`.                                                                                 | `false`                       |
| `excludePrivate`            |Optional| Exclude symbols marked with the `@private` tag. Defaults to `false`.                                                                                  | `false`                       |
| `excludeProtected`          |Optional| Exclude symbols marked with the `@protected` tag. Defaults to `false`.                                                                                | `false`                       |
| `excludeReferences`         |Optional| Exclude references of symbols already included in the documentation. Defaults to `false`.                                                             | `false`                       |
| `excludeCategories`         |Optional| Exclude reflections associated with any of the given categories.                                                                                      |                               |
| `showConfig`                |Optional| Show the resolved configuration and exit.                                                                                                             |                               |

Please note that I added the missing options and adjusted the names of some options to match the actual code implementation. Feel free to adapt it further based on your preferences.
## Templates and Plugins 🖌️

You can use TypeDoc [templates](https://typedoc.org/guides/options/) with this action.  
Just set the `theme` or the `plugin` input variable to the name of the template you want to use and use the `install_module` to install that package (this needs to be the template's package name.). 

## TypeDoc Configuration file 📄

To use a TypeDoc [configuration file](https://typedoc.org/guides/options/) located in your repository, you will need to specify the path to the file in the `config_file` input variable. Normally, if you use the [actions/checkout](https://github.com/actions/checkout), this will just resolve to `tsconfig.json` or `typedoc.json`.

## Examples

### GitHub Pages 🚀

An example for deploying TypeDoc generated documentation to GitHub Pages with [actions-gh-pages](https://github.com/marketplace/actions/github-pages-action#table-of-contents).

This tsdoc-action workflow configuration uses the [default](https://typedoc.org/guides/themes/default/) TypeDoc template and uses the root `README.md` file as the front page.

```yml
# Simple workflow for deploying static content to GitHub Pages
name: TSDoc Actions

on:
  release:
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  # Single deploy job since we're just deploying
  deploy:
    name: Deploy Documentation

    # Deploy to the github-pages environment
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    # Specify runner + deployment step
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: "npm"

      - name: TSDoc Action
        uses: erikyo/tsdoc-action@v1
        with:
          source_dir: ./src
          output_dir: ./docs
          front_page: README.md

      - name: Setup Pages
        uses: actions/configure-pages@v3

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          # Upload entire repository
          path: './docs'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

## License

Copyright © 2023 [Erik Golinelli](https://github.com/erikyo)

The tsdoc-action GitHub action is licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).  
See the [LICENSE](https://github.com/erikyo/tsdoc-action/blob/master/LICENSE) file for more information.
