/**
 * appExists
 *
 * Check whether the given app exists within the directory
 */

const fs = require('fs');
const path = require('path');


function getDirectories (srcpath) {
    return fs.readdirSync(srcpath)
        .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
}

function appExists (srcpath, app) {
    return getDirectories(srcpath).filter(directoryName => app === directoryName).length > 0;
}

module.exports.appExists = appExists;
module.exports.getApps = getDirectories;
