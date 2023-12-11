"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const installer_1 = __importDefault(require("./installer"));
/**
 * Runs the documentation generation process.
 * @async
 * @return {void}
 */
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let templateName;
            const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE;
            const source_dir = core.getInput('source_dir');
            const output_dir = core.getInput('output_dir');
            const config_file = core.getInput('config_file');
            const theme = core.getInput('theme');
            const template_dir = core.getInput('template_dir');
            const front_page = core.getInput('front_page');
            const name = core.getInput('name');
            const exclude = core.getInput('exclude');
            const tsconfig = core.getInput('tsconfig');
            const entryPoints = core.getMultilineInput('entryPoints');
            const entryPointStrategy = core.getInput('entryPointStrategy');
            const resolveEntrypoints = entryPointStrategy === 'resolve';
            const packagesEntrypoints = entryPointStrategy === 'packages';
            const externalPattern = core.getMultilineInput('externalPattern');
            const excludeExternals = core.getInput('excludeExternals');
            const excludeNotDocumented = core.getInput('excludeNotDocumented');
            const excludeNotDocumentedKinds = core.getMultilineInput('excludeNotDocumentedKinds');
            const excludeInternal = core.getInput('excludeInternal');
            const excludePrivate = core.getInput('excludePrivate');
            const excludeProtected = core.getInput('excludeProtected');
            const excludeReferences = core.getInput('excludeReferences');
            const excludeCategories = core.getMultilineInput('excludeCategories');
            const includeVersion = core.getInput('includeVersion');
            const disableSources = core.getInput('disableSources');
            const sourceLinkTemplate = core.getInput('sourceLinkTemplate');
            const gitRevision = core.getInput('gitRevision');
            const gitRemote = core.getInput('gitRemote');
            const disableGit = core.getInput('disableGit');
            const readme = core.getInput('readme');
            const stripYamlFrontmatter = core.getInput('stripYamlFrontmatter');
            if (source_dir) {
                try {
                    const srcPath = path_1.default.join(GITHUB_WORKSPACE, source_dir);
                    yield fs_1.default.promises.access(srcPath);
                }
                catch (error) {
                    core.setFailed('⛔️ Source directory does not exist');
                    return;
                }
            }
            if (config_file) {
                try {
                    const configPath = path_1.default.join(GITHUB_WORKSPACE, config_file);
                    yield fs_1.default.promises.access(configPath);
                }
                catch (error) {
                    core.setFailed('⛔️ Config file does not exist');
                    return;
                }
            }
            if (theme) {
                templateName = yield (0, installer_1.default)(theme);
            }
            const typedocPath = path_1.default.join(__dirname, '../node_modules/typedoc/bin/typedoc');
            const cmd = 'node';
            const args = [typedocPath];
            if (source_dir) {
                args.push(source_dir);
            }
            if (output_dir) {
                args.push('--out', path_1.default.join(GITHUB_WORKSPACE, output_dir));
            }
            if (config_file) {
                const configPath = path_1.default.join(GITHUB_WORKSPACE, config_file);
                args.push('--tsconfig', configPath);
            }
            if (theme) {
                args.push('--theme', theme);
            }
            if (template_dir) {
                args.push('--template_dir', path_1.default.join(GITHUB_WORKSPACE, '../node_modules/', templateName, template_dir));
            }
            if (front_page) {
                const readmePath = path_1.default.join(GITHUB_WORKSPACE, front_page);
                args.push('--readme', readmePath);
            }
            if (core.getInput('lightHighlightTheme')) {
                args.push('--lightHighlightTheme', core.getInput('lightHighlightTheme'));
            }
            if (core.getInput('darkHighlightTheme')) {
                args.push('--darkHighlightTheme', core.getInput('darkHighlightTheme'));
            }
            if (core.getInput('customCss')) {
                args.push('--customCss', path_1.default.join(GITHUB_WORKSPACE, core.getInput('customCss')));
            }
            if (core.getInput('markedOptions')) {
                args.push('--markedOptions', core.getInput('markedOptions'));
            }
            if (core.getInput('basePath')) {
                args.push('--basePath', core.getInput('basePath'));
            }
            if (core.getInput('cname')) {
                args.push('--cname', core.getInput('cname'));
            }
            if (core.getInput('sourceLinkExternal')) {
                args.push('--sourceLinkExternal');
            }
            if (core.getInput('htmlLang')) {
                args.push('--htmlLang', core.getInput('htmlLang'));
            }
            if (core.getInput('githubPages')) {
                args.push('--githubPages', core.getInput('githubPages'));
            }
            if (core.getInput('cacheBust')) {
                args.push('--cacheBust');
            }
            if (core.getInput('gaID')) {
                args.push('--gaID', core.getInput('gaID'));
            }
            if (core.getInput('hideParameterTypesInTitle')) {
                args.push('--hideParameterTypesInTitle', core.getInput('hideParameterTypesInTitle'));
            }
            if (core.getInput('hideGenerator')) {
                args.push('--hideGenerator');
            }
            if (core.getInput('searchInComments')) {
                args.push('--searchInComments');
            }
            if (core.getInput('cleanOutputDir')) {
                args.push('--cleanOutputDir', core.getInput('cleanOutputDir'));
            }
            if (core.getInput('titleLink')) {
                args.push('--titleLink', core.getInput('titleLink'));
            }
            if (name) {
                args.push('--name', name);
            }
            if (exclude) {
                args.push('--exclude', exclude);
            }
            if (tsconfig) {
                args.push('--tsconfig', tsconfig);
            }
            if (entryPoints) {
                entryPoints.forEach(entryPoint => args.push('--entryPoints', entryPoint));
            }
            if (resolveEntrypoints) {
                args.push('--entryPointStrategy', 'resolve');
            }
            if (packagesEntrypoints) {
                args.push('--entryPointStrategy', 'packages');
            }
            if (externalPattern) {
                externalPattern.forEach(pattern => args.push('--externalPattern', pattern));
            }
            if (excludeExternals) {
                args.push('--excludeExternals');
            }
            if (excludeNotDocumented) {
                args.push('--excludeNotDocumented');
            }
            if (excludeNotDocumentedKinds) {
                excludeNotDocumentedKinds.forEach(kind => args.push('--excludeNotDocumentedKinds', kind));
            }
            if (excludeInternal) {
                args.push('--excludeInternal');
            }
            if (excludePrivate) {
                args.push('--excludePrivate');
            }
            if (excludeProtected) {
                args.push('--excludeProtected');
            }
            if (excludeReferences) {
                args.push('--excludeReferences');
            }
            if (excludeCategories) {
                excludeCategories.forEach(category => args.push('--excludeCategories', category));
            }
            if (includeVersion) {
                args.push('--includeVersion');
            }
            if (disableSources) {
                args.push('--disableSources');
            }
            if (sourceLinkTemplate) {
                args.push('--sourceLinkTemplate', sourceLinkTemplate);
            }
            if (gitRevision) {
                args.push('--gitRevision', gitRevision);
            }
            if (gitRemote) {
                args.push('--gitRemote', gitRemote);
            }
            if (disableGit) {
                args.push('--disableGit');
            }
            if (readme) {
                args.push('--readme', readme);
            }
            if (stripYamlFrontmatter) {
                args.push('--stripYamlFrontmatter');
            }
            core.info('📝 Generating documentation');
            yield exec.exec(cmd, args);
            core.info(`🎉 Documentation 📖 has been generated to the ${output_dir} folder 📁`);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
