var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const core = require('@actions/core');
const fs = require('fs');
const util = require('util');
function getPackageName(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        let name = '';
        const readFile = util.promisify(fs.readFile);
        const fileContents = yield readFile(filePath, 'utf8');
        try {
            const data = JSON.parse(fileContents);
            name = data.name;
        }
        catch (error) {
            core.setFailed('There was an error reading "name" entry in package.json file');
        }
        return name;
    });
}
module.exports = {
    getPackageName
};
