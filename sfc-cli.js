// Vendor dependencies
const fs = require('fs');
const { join } = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');

// CLI Dependencies
const questions = require('./cli/questions');
const { generateTemplate } = require('./cli/core');
const { pascalify } = require('./cli/helpers');

const initPath = 'templates';

console.log(
  chalk.green(
    figlet.textSync('VUE SFC CLI', {
      horizontalLayout: 'default',
      verticalLayout: 'default'
    })
  )
);

console.log(chalk.green('A reusable component for Vue.js'));
console.log('     ');
console.log('     ');

// Check if "templates" directory exist
if (!fs.existsSync(initPath)) {
  throw new Error('Templates directory is not exist. Please create it !');
}

inquirer.prompt(questions).then(function(answers) {
  answers.componentNamePascal = pascalify(answers.componentName);
  answers.savePath = join(process.cwd(), answers.componentPath);
  generateTemplate(initPath, answers);
});

// generateTemplate('templates');
