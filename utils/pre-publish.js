const fsExtra = require('fs-extra');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2), { string: 'version' });

const packageJSONPath = path.resolve(__dirname, '../package.json');
const packageJSON = fsExtra.readJSONSync(packageJSONPath);

const version = argv.version || packageJSON.version;

if (!version) {
    console.error(`missing argument 'version' and no version found in package.json`);
    process.exit(1);
    return;
}

console.log(`Preparing package for publish: version ${version}, setting private: false`);

packageJSON.version = version;
packageJSON.private = false;

fsExtra.writeJSONSync(packageJSONPath, packageJSON, { spaces: 2 });

console.log('Package prepared successfully');
