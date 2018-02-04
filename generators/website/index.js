'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

const path = require('path');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay('Welcome to the shining ' + chalk.red('generator-danfife') + ' generator!')
    );

    const folderName = path.basename(this.destinationRoot());

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Project name',
        default: folderName
      },
      {
        type: 'input',
        name: 's3bucket',
        message: 'S3 bucket name',
        default: folderName
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    const context = {
      name: this.props.name,
      s3bucket: this.props.s3bucket
    };
    const copyOptions = { globOptions: { dot: true } };

    this.fs.copyTpl(
      this.templatePath('**/*'),
      this.destinationRoot(),
      context,
      {},
      copyOptions
    );
  }

  install() {
    this.installDependencies({
      bower: false,
      npm: true
    });
  }
};
