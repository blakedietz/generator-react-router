/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */

const fs = require('fs');

function componentExists(appName, componentName) {
    const pageComponents = fs.readdirSync(`${appName}/components`);
    const pageContainers = fs.readdirSync(`${appName}/containers`);
    const components = pageComponents.concat(pageContainers);

    return components.indexOf(componentName) >= 0;
}

module.exports = componentExists;
