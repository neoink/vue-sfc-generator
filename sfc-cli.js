// Vendor dependencies
const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');

// CLI Dependencies
const questions = require('./cli/questions');
const { generateTemplate } = require('./cli/core');

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

// Check if "templates" directory exist
if (!fs.existsSync('templates')) {
  throw new Error('Templates directory is not exist. Please create it !');
}

inquirer.prompt(questions).then(function(answers) {
  generateTemplate(initPath, answers);
});

// generateTemplate('templates');
