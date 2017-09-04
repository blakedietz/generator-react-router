const Generator = require('yeoman-generator');
const appExists = require('../utils/app_utils').appExists;
const getApps = require('../utils/app_utils').getApps;
const { createNameVariations } = require('../utils/casing_utils');

const componentTypes = {
  STATELESS: 'stateless',
  STATEFUL: 'stateful',
};

class ComponentGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.appName = '';
    this.componentName = '';
    this.componentType = componentTypes.STATELESS;
  }

  prompting() {
    const basePath = this.destinationRoot();
    // TODO: (bdietz) case for no apps being made yet
    return this.prompt([{
      type: 'list',
      name: 'appName',
      // TODO: (bdietz) add a description of the purpose of a component.
      message: 'Choose the module that you want to add the component to.',
      choices: getApps(basePath),
    },
      {
        type: 'list',
        name: 'componentType',
        message: 'What type of component do you want to create?',
        choices: [componentTypes.STATELESS, componentTypes.STATEFUL],
        default: this.componentType,
      },
      {
        type: 'input',
        name: 'componentName',
        message: 'Input the name of the component you want to create.',
      }])
      .then((answers) => {
        this.appName = answers.appName;
        this.componentName = answers.componentName;
        this.componentType = answers.componentType;

        const appAlreadyExists = appExists(basePath, answers.appName);

        if (!appAlreadyExists) {
          this.log(`The application ${answers.appName} does not exist. Something went wrong.`);
        }
      });
  }

  writing() {
    const nameVariations = createNameVariations(this.componentName);
    const templateConfig = Object.assign({}, { name: this.componentName }, nameVariations);

    this.fs.copyTpl(
      this.templatePath(`component.${this.componentType}.js.ejs`),
      this.destinationPath(`${this.appName}/components/${nameVariations.snakeName}/${nameVariations.snakeName}.js`),
      templateConfig
    );

    this.fs.copyTpl(
      this.templatePath(`component.test.js.ejs`),
      this.destinationPath(`${this.appName}/components/${nameVariations.snakeName}/${nameVariations.snakeName}.test.js`),
      templateConfig
    );

    this.fs.copyTpl(
      this.templatePath(`index.js.ejs`),
      this.destinationPath(`${this.appName}/components/${nameVariations.snakeName}/index.js`),
      templateConfig
    );
  }
}

module.exports = ComponentGenerator;
