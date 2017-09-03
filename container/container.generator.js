const Generator = require('yeoman-generator');
const appExists = require('../utils/app_utils').appExists;
const getApps = require('../utils/app_utils').getApps;
const _ = require('lodash');
const { createNameVariations } = require('../utils/casing_utils');

class ContainerGenerator extends Generator {
  constructor (args, opts) {
    super(args, opts);

    this.appName = '';
    this.containerName = '';
    this.appConfig = {
      usesRedux: false,
    };
  }

  prompting () {
    const basePath = this.destinationRoot();
    // TODO: (bdietz) case for no apps being made yet
    return this.prompt([{
      type: 'list',
      name: 'appName',
      // TODO: (bdietz) add a description of the purpose of a container.
      message: 'Choose the module that you want to add the container to.',
      choices: getApps(basePath),
    },
      {
        type: 'input',
        name: 'containerName',
        message: 'Input the name of the container you want to create.',
      },
      {
        type: 'confirm',
        name: 'usesRedux',
        message: `Will your container need to be connected to redux? If you aren't sure just choose no.`
      },
    ])
    .then((answers) => {
      this.appName = answers.appName;
      this.containerName = answers.containerName;
      this.appConfig.usesRedux= answers.usesRedux;
      const appAlreadyExists = appExists(basePath, answers.appName);

      if (!appAlreadyExists) {
        this.log(`The application ${answers.appName} does not exist. Something went wrong.`);
      }
    });
  }

  writing () {
    const nameVariations = createNameVariations(this.containerName);
    const templateConfig = {
      appConfig: this.appConfig,
      name: this.containerName,
      ...nameVariations
    };
    const containerPath = `${this.appName}/containers/${nameVariations.snakeName}`;

    this.fs.copyTpl(
      this.templatePath(`container.js.ejs`),
      this.destinationPath(`${containerPath}/${nameVariations.snakeName}.js`),
      templateConfig
    );

    this.fs.copyTpl(
      this.templatePath(`container.test.js.ejs`),
      this.destinationPath(`${containerPath}/${nameVariations.snakeName}.test.js`),
      templateConfig
    );

    this.fs.copyTpl(
      this.templatePath(`index.js.ejs`),
      this.destinationPath(`${containerPath}/index.js`),
      templateConfig
    );
  }
}

module.exports = ContainerGenerator;
