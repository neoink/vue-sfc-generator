const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const helpers = {};

// Helpers for creating kebab-case/PascalCase versions of string
helpers.pascalify = str => {
  const camelized = str.replace(/-([a-z])/g, c => c[1].toUpperCase());
  return camelized.charAt(0).toUpperCase() + camelized.slice(1);
};
helpers.kebabcase = string =>
  string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();

// Helper to ensure directory exists before writing file to it
helpers.ensureDirectoryExists = filePath => {
  const dirname = path.dirname(filePath);

  if (fs.existsSync(dirname)) {
    return true;
  }

  helpers.ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
};

helpers.execCmd = (command, options) =>
  new Promise((resolve, reject) => {
    options = options || {};
    childProcess.exec(command, options, (error, stdout, stderr) => {
      if (error) reject({ error, stderr });
      resolve(stdout);
    });
  });

module.exports = helpers;
