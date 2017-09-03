/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */

const fs = require('fs');
// TODO: (bdietz) fix this
const pageComponents = fs.readdirSync('app/components');
const pageContainers = fs.readdirSync('app/containers');

function componentExists(comp) {
    return components.indexOf(comp) >= 0;
}

module.exports = componentExists;
