#! /usr/bin/env node

// Vendor dependencies
const fs = require('fs');
const { join, sep } = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const ora = require('ora');

// CLI Dependencies
const questions = require('./cli/questions');
const { generateTemplate } = require('./cli/core');
const { pascalify, execCmd } = require('./cli/helpers');

const initPath = join(__dirname + sep + 'templates');

// Check if "templates" directory exist
if (!fs.existsSync(initPath)) {
  throw new Error('Templates directory is not exist. Please create it !');
}

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
console.log('');
console.log('');

inquirer.prompt(questions).then(async answers => {
  answers.componentNamePascal = pascalify(answers.componentName);
  answers.savePath = join(process.cwd(), answers.componentPath);

  console.log('💫  Creating SFC in', chalk.yellow(answers.savePath));

  console.log('🚀  Generating files');
  const spinner = ora('Generating templates...').start();
  await generateTemplate(answers, initPath);
  spinner.succeed(chalk.green('Finished!'));

  console.log(
    '📦  Installing npm packages, Please wait during installation ...'
  );
  await execCmd(`cd ${answers.savePath} & yarn install`);

  console.log(
    `👏  ${chalk.green('Successfully')} generated SFC ${chalk.yellow(
      answers.componentName
    )}`
  );

  console.log('');
  console.log('💡  Get started with the following commands:');
  console.log(chalk.grey('  $'), chalk.cyan('cd ', answers.componentPath));
  console.log(chalk.grey('  $'), chalk.cyan('yarn serve (or npm)'));
  console.log('');
  console.log('💡  Build your SFC (production ready) :');
  console.log(chalk.grey('  $'), chalk.cyan('yarn build (or npm)'));
});
