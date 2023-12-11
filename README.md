# tsdoc-action

> A GitHub Action to build TypeDoc documentation

This is a GitHub Action to build your TypeScript documentation with [TypeDoc](https://typedoc.org/). This action can easily be combined with other deployment actions, in order to publish the generated documentation to, for example, [GitHub Pages](https://pages.github.com). TypeDoc [templates](https://typedoc.org/guides/options/) are also supported.

This action is a fork of the [jsdoc-action](https://github.com/andstor/jsdoc-action) by [André Storhaug](https://github.com/andstor). The repository URL for this fork is [https://github.com/erikyo/tsdoc-action](https://github.com/erikyo/tsdoc-action).

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

The tsdoc-action is a JavaScript action and is supported on both Linux, MacOS, and Windows. The action supports stable versions of Node.js 14 and later.

| OS (runs-on) | ubuntu-latest | macos-latest | windows-latest |
| ---          |:---:          |:---:         |:---:           |
| Support      | ✅️             | ✅️            | ✅️             |

## Options ⚙️

The following input variables options can/must be configured:

|Input variable|Necessity|Description|Default|
|----|----|----|----|
|`source_dir`|Optional|Source directory to build documentation from.||
|`output_dir`|Optional|Output folder for the generated documentation.|`./out`|
|`recurse`|Optional|Recurse into subdirectories when scanning for source files.|`false`|
|`config_file`|Optional|The path to a TypeDoc configuration file.||
|`template`|Optional|The TypeDoc template or theme to install. Will run `npm install template`.||
|`template_dir`|Optional|The relative location of the template files directory within the template package.||
|`front_page`|Optional|The path to a Markdown file to be used as a the front page. Normally `README.md`.||
|`excludeInternal`|Optional|Removes symbols annotated with the `@internal` doc tag.|`true`|
|`excludePrivate`|Optional|Removes private class members from the generated documentation.|`false`|
|`excludeProtected`|Optional|Removes protected class members from the generated documentation.|`false`|
|`excludeReferences`|Optional|Removes re-exports of a symbol already included in the documentation from the documentation.|`false`|
|`excludeCategories`|Optional|Removes reflections associated with any of the given categories.||
|`name`|Optional|Set the name of the project that will be used in the header of the template.|Package name from package.json|
|`includeVersion`|Optional|Includes the version according to package.json in generated documentation.|`false`|
|`disableSources`|Optional|Disables capturing where reflections are declared when converting input.|`false`|
|`sourceLinkTemplate`|Optional|Specify a link template to be used when generating source urls.||
|`gitRevision`|Optional|Use specified revision or branch instead of the last revision for linking to source files.||
|`gitRemote`|Optional|Use the specified git remote instead of origin for linking to source files.||
|`disableGit`|Optional|Prevents TypeDoc from using Git to try to determine if sources can be linked.|`false`|
|`readme`|Optional|Path to the readme file that should be displayed on the index page.||
|`stripYamlFrontmatter`|Optional|Remove YAML frontmatter from the readme file displayed on the main page.|`false`|

## Templates 💅

You can use TypeDoc [templates](https://typedoc.org/guides/options/) with this action.  
Just set the `template` input variable to the name of the template you want to use. This needs to be the template's package name.

If the template's template files are located somewhere else than the package's root, you need to specify this. Set the `template_dir` input variable to the location of the template folder (contains a `publish.js` file).

For example, to use the TypeDoc [default](https://typedoc.org/guides/themes/default/) template, set the `template` input variable to `default`.

## TypeDoc Configuration file 📄

To use a TypeDoc [configuration file](https://typedoc.org/guides/options/) located in your repository, you will need to specify the path to the file in the `config_file` input variable. Normally, if you use the [actions/checkout](https://github.com/actions/checkout), this will just resolve to `tsconfig.json` or `typedoc.json`.

## Examples

### GitHub Pages 🚀

An example for deploying TypeDoc generated documentation to GitHub Pages with [actions-gh-pages](https://github.com/marketplace/actions/github-pages-action#table-of-contents).

This tsdoc-action workflow configuration uses the [default](https://typedoc.org/guides/themes/default/) TypeDoc template and uses the root `README.md` file as the front page.

```yml
name: GitHub pages

on:
  push:
    branches:
      - master
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write
  
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Build
        uses: erikyo/tsdoc-action@v1
        with:
          source_dir: ./src
          output_dir: ./out
          config_file: tsdoc.json
          template: default
          front_page: README.md

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          deploy_key: ${{ secrets.ACTIONS_DEPLOY_KEY }}
          publish_dir: ./out
```

## License

Copyright © 2023 [Erik Golinelli](https://github.com/erikyo)

The tsdoc-action GitHub action is licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).  
See the [LICENSE](https://github.com/erikyo/tsdoc-action/blob/master/LICENSE) file for more information.
