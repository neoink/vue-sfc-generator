const fs = require('fs');
const { join } = require('path');
const handlebars = require('handlebars');
const { ensureDirectoryExists } = require('./helpers');

handlebars.registerHelper('raw-helper', options => options.fn());

module.exports = (() => {
  const writeFile = (file, data) => {
    const currentPath = `${data.componentPath}/${file.replace(
      'templates/',
      ''
    )}`;

    fs.readFile(file, 'utf-8', function(error, source) {
      const template = handlebars.compile(source);
      const newTemplate = template(data);

      ensureDirectoryExists(currentPath);
      fs.writeFileSync(currentPath, newTemplate);
    });
  };

  const generateTemplate = (directory, data) => {
    const filesOrDirectory = fs.readdirSync(directory); // Foreach directories/files
    let currentDirectory = directory;

    for (let i = 0, len = filesOrDirectory.length; i < len; i += 1) {
      // Verify if current value is directory
      const isDirectory = fs
        .lstatSync(join(`${__dirname}/../${directory}/${filesOrDirectory[i]}`))
        .isDirectory();
      if (isDirectory) {
        // If directory => recurcise
        currentDirectory += '/' + filesOrDirectory[i];
        generateTemplate(`${currentDirectory}`, data);
      } else {
        // else remplace var with Handlebars and write directories/files
        writeFile(`${directory}/${filesOrDirectory[i]}`, data);
        currentDirectory = directory;
      }
    }
  };

  return {
    generateTemplate
  };
})();
