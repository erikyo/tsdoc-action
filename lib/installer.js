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
const path_1 = __importDefault(require("path"));
const utils_1 = __importDefault(require("./utils"));
/**
 * Installs a TSDoc template or theme by executing `npm install template/theme --production`.
 * The template/theme needs to be a JavaScript package.
 * @param {string} template The TSDoc template or theme to install.
 * @async
 * @returns {Promise<string>} The name of the installed template or theme.
 */
function installTemplate(template) {
    return __awaiter(this, void 0, void 0, function* () {
        let templateName = '';
        const actionDir = path_1.default.join(__dirname, '../');
        core.debug(`actionDir: ${actionDir}`);
        const cmd = 'npm';
        const args = ['install', template, '--production'];
        core.info(`Installing TSDoc template/theme: ${template}`);
        core.debug(`Command: ${cmd} ${args}`);
        const options = {
            cwd: actionDir,
            options: {},
            listeners: {}
        };
        yield exec.exec(cmd, args, options);
        let lsOutput = '';
        let lsError = '';
        options.listeners = {
            stdout: (data) => {
                lsOutput += data.toString();
            },
            stderr: (data) => {
                lsError += data.toString();
            }
        };
        yield exec.exec('npm', ['ls', template, '-p'], options);
        core.debug(`Template/theme location: ${lsOutput}`);
        if (lsError)
            core.info(`Error: ${lsError}`);
        const packageLocation = lsOutput.trim(); // path/to/template
        const filePath = path_1.default.join(packageLocation + '/package.json');
        templateName = yield (0, utils_1.default)(filePath);
        return templateName;
    });
}
exports.default = installTemplate;
