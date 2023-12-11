import generated from "@vercel/ncc";
import fs from 'fs';
import path from 'path';

generated('./node_modules/typedoc/bin/typedoc', {
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

    fs.writeFileSync(path.join(process.cwd(), 'lib', 'assets.json'), JSON.stringify(assets));
    fs.writeFileSync(path.join(process.cwd(), 'lib', 'map.json'), JSON.stringify(map));
    fs.writeFileSync(path.join(process.cwd(), 'lib', 'typedoc.js'), JSON.stringify(code));
})
