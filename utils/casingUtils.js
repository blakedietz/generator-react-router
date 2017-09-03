/**
 * Some utility functions for creating proper casing for different parts of templating.
 */

const _ = require('lodash');

const createNameVariations = (name) => ({
    camelName: _.camelCase(name),
    kebabName: _.kebabCase(name),
    pascalName: _.upperFirst(_.camelCase(name)),
    snakeName: _.snakeCase(name),
});

module.exports = {
    createNameVariations
};
