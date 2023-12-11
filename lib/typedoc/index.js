/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 649:
/***/ ((module, exports, __nccwpck_require__) => {

/* module decorator */ module = __nccwpck_require__.nmd(module);
const { readFileSync, writeFileSync } = __nccwpck_require__(147), { Script } = __nccwpck_require__(144), { wrap } = __nccwpck_require__(188);
const basename = __dirname + '/index.js';
const source = readFileSync(__nccwpck_require__.ab + "index.js.cache.js", 'utf-8');
const cachedData = !process.pkg && (__nccwpck_require__(282).platform) !== 'win32' && readFileSync(__nccwpck_require__.ab + "index.js.cache");
const scriptOpts = { filename: __nccwpck_require__.ab + "index.js.cache.js", columnOffset: -62 }
const script = new Script(wrap(source), cachedData ? Object.assign({ cachedData }, scriptOpts) : scriptOpts);
(script.runInThisContext())(exports, require, module, __filename, __dirname);
if (cachedData) process.on('exit', () => { try { writeFileSync(__nccwpck_require__.ab + "index.js.cache", script.createCachedData()); } catch(e) {} });


/***/ }),

/***/ 238:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ncc_1 = __importDefault(__nccwpck_require__(649));
const fs_1 = __importDefault(__nccwpck_require__(147));
const path_1 = __importDefault(__nccwpck_require__(17));
(0, ncc_1.default)('./node_modules/typedoc/bin/typedoc', {
    // directory outside of which never to emit assets
    filterAssetBase: process.cwd(), // default
    minify: true, // default
    assetBuilds: false, // default
    sourceMapRegister: true, // default
    watch: false, // default
    license: '', // default does not generate a license file
    target: 'es2015', // default
    v8cache: false, // default
    quiet: false, // default
    debugLog: false // default
}).then(({ code, map, assets }) => {
    fs_1.default.writeFileSync(path_1.default.join(process.cwd(), 'lib', 'assets.json'), JSON.stringify(assets));
    fs_1.default.writeFileSync(path_1.default.join(process.cwd(), 'lib', 'map.json'), JSON.stringify(map));
    fs_1.default.writeFileSync(path_1.default.join(process.cwd(), 'lib', 'typedoc.js'), JSON.stringify(code));
});


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 188:
/***/ ((module) => {

"use strict";
module.exports = require("module");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 282:
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ 144:
/***/ ((module) => {

"use strict";
module.exports = require("vm");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__nccwpck_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(238);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;