#! /usr/bin/env node

// Vendor dependencies
const fs = require('fs');
const { join } = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const ora = require('ora');

// CLI Dependencies
const questions = require('./cli/questions');
const { generateTemplate } = require('./cli/core');
const { pascalify, execCmd } = require('./cli/helpers');

const initPath = 'templates';

console.log(
  chalk.green(
    figlet.textSync('VUE SFC CLI', {
      font: 'big',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    })
  )
);

console.log(chalk.green('A reusable component generator for Vue.js'));
console.log('     ');
console.log('     ');

// Check if "templates" directory exist
if (!fs.existsSync(initPath)) {
  throw new Error('Templates directory is not exist. Please create it !');
}

inquirer.prompt(questions).then(async answers => {
  answers.componentNamePascal = pascalify(answers.componentName);
  answers.savePath = join(process.cwd(), answers.componentPath);

  console.log('🚀  Generate files');
  const spinner = ora('Generating templates...').start();
  await generateTemplate(initPath, answers);
  spinner.succeed('Finished!');

  console.log('✈️  Install npm packages');
  spinner.start('Please wait during installation ...');
  await execCmd(`cd ${answers.savePath} & yarn install`);
  spinner.succeed('success!');
});
