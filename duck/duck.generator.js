const Generator = require('yeoman-generator'); const appExists = require('../utils/app_utils').appExists;
const getApps = require('../utils/app_utils').getApps;
const { createNameVariations } = require('../utils/casing_utils');
const mkdirp = require('mkdirp');

class StoreGenerator extends Generator {
  constructor (args, opts) {
    super(args, opts);

    // This makes `appname` a required argument.
    // this.argument('appName', { type: String, required: true });
    this.appName = '';
    this.duckName = '';
  }

  prompting () {
    const basePath = this.destinationRoot();
    return this.prompt([{
      type: 'list',
      name: 'appName',
      message: 'Choose the module that you want to add the store to.',
      choices: getApps(basePath),
    },
      {
        type: 'input',
        name: 'duckName',
        message: 'Input the name of the redux "ducks" module you want to create.',
      }])
      .then((answers) => {
        this.appName = answers.appName;
        this.duckName = answers.duckName;
        const appAlreadyExists = appExists(basePath, answers.appName);

        if (!appAlreadyExists) {
          this.log(`The application ${answers.appName} does not exist. Something went wrong.`);
        }
        // TODO: (bdietz) - check for modules that already have that name
      });
  }

  writing () {
    const appNameVariations = createNameVariations(this.appName);
    const duckNameVariations = createNameVariations(this.duckName);
    const templateConfig = { appName: this.appName, ...duckNameVariations };
    const basePath = `${this.destinationRoot()}/${duckNameVariations.snakeName}`;

    mkdirp.sync(`${basePath}/${this.appName}/redux/modules/${duckNameVariations.snakeName}`, (error) => {
      this.log(error);
      return false;
    });

    this.fs.copyTpl(
      this.templatePath(`redux_module.js.ejs`),
      this.destinationPath(`${this.appName}/redux/modules/${duckNameVariations.snakeName}/${duckNameVariations.snakeName}.js`),
      templateConfig
    );

    this.fs.copyTpl(
      this.templatePath(`redux_module.index.js.ejs`),
      this.destinationPath(`${this.appName}/redux/modules/${duckNameVariations.snakeName}/index.js`),
      templateConfig
    );
  }
}

module.exports = StoreGenerator;
