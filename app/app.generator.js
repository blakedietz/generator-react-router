const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
const appExists = require('../utils/app_utils').appExists;
const { createNameVariations } = require('../utils/casing_utils');

class AppGenerator extends Generator {
  constructor (args, opts) {
    super(args, opts);

    this.appName = '';
    this.appAlreadyExists = false;

    this.appConfig = {
      usesRedux: false,
      usesSagas: false,
    };

    this.nameVariations = {
      camelName: '',
      pascalName: '',
      kebabName: '',
      snakeName: '',
    };
  }

  prompting () {
    return this.prompt([{
      type: 'input',
      name: 'appName',
      message: 'Enter the name of the application that you want to create.',
      },
      {
        type: 'confirm',
        name: 'usesRedux',
        message: `Will your application container use redux? If you aren't sure just choose no.`
      },
      {
        type: 'confirm',
        name: 'usesSagas',
        message: `Will your application need to use sagas? If you aren't sure just choose no.`
      }])
      .then((answers) => {
        this.appName = answers.appName;
        this.nameVariations = createNameVariations(this.appName);
        this.appConfig.usesRedux = answers.usesRedux;
        this.appConfig.usesSagas = answers.usesSagas;
        const basePath = this.destinationRoot();
        this.appAlreadyExists = appExists(basePath, this.appName);
        if (this.appAlreadyExists) {
          this.log('The application already exists. Please choose a different application name');
        }
    });
  }

  writing () {
    const appNameVariations = {
      camelName: `root${this.nameVariations.camelName}`,
      pascalName: `Root${this.nameVariations.pascalName}`,
      kebabName: `root-${this.nameVariations.kebabName}`,
      snakeName: `root_${this.nameVariations.snakeName}`,
    };
    const templateConfig = Object.assign({}, { appConfig: this.appConfig }, appNameVariations);

    if (this.appAlreadyExists) {
      this.log(`${templateConfig.kebabName} already exists. Please remove the directory and run again.`);
    }
    else {
      const basePath = `${this.destinationRoot()}/${this.nameVariations.snakeName}`;

      // Create the application directory
      mkdirp.sync(basePath, (error) => {
        this.log(error);
      });

      // Create the containers directory
      mkdirp.sync(`${basePath}/containers`, (error) => {
        this.log(error);
        return false;
      });

      // Create the root container directory
      mkdirp.sync(`${basePath}/containers/${appNameVariations.snakeName}`, (error) => {
        this.log(error);
        return false;
      });

      // Create the components directory
      mkdirp.sync(`${basePath}/components`, (error) => {
        this.log(error);
        return false;
      });

      // Create the services directory
      mkdirp.sync(`${basePath}/services`, (error) => {
        this.log(error);
        return false;
      });

      if (this.appConfig.usesRedux) {
        // Create the store directory
        mkdirp.sync(`${basePath}/redux`, (error) => {
          this.log(error);
          return false;
        });

        // Create the ducks module directory
        mkdirp.sync(`${basePath}/redux/modules`, (error) => {
          this.log(error);
          return false;
        });

        this.fs.copyTpl(
          this.templatePath(`root_reducer.js.ejs`),
          this.destinationPath(`${basePath}/redux/root_reducer.js`),
          templateConfig
        );

        this.fs.copyTpl(
          this.templatePath(`configure_store.js.ejs`),
          this.destinationPath(`${basePath}/redux/configure_store.js`),
          Object.assign({}, templateConfig, { isProd: false }),
        );

        this.fs.copyTpl(
          this.templatePath(`configure_store.dev_prod.js.ejs`),
          this.destinationPath(`${basePath}/redux/configure_store.prod.js`),
          Object.assign({}, templateConfig, { isProd: true}),
        );

        this.fs.copyTpl(
          this.templatePath(`configure_store.dev_prod.js.ejs`),
          this.destinationPath(`${basePath}/redux/configure_store.dev.js`),
          Object.assign({}, templateConfig, { isProd: false }),
        );
      }

      // Copy the app index into the application folder
      this.fs.copyTpl(
        this.templatePath(`index.js.ejs`),
        this.destinationPath(`${basePath}/index.js`),
        templateConfig
      );

      // Copy the app container into the containers folder folder
      this.fs.copyTpl(
        this.templatePath(`app.js.ejs`),
        this.destinationPath(`${basePath}/containers/${appNameVariations.snakeName}/${appNameVariations.snakeName}.js`),
        templateConfig
      );

      // Copy the app container into the containers folder folder
      this.fs.copyTpl(
        this.templatePath(`index.container.js.ejs`),
        this.destinationPath(`${basePath}/containers/${appNameVariations.snakeName}/index.js`),
        templateConfig
      );
    }
    ;
  }
}

module.exports = AppGenerator;
