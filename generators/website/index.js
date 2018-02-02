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

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        // Defaults to the project's folder name if the input is skipped
        default: path.basename(this.destinationRoot())
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    const context = { name: this.props.name };
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
