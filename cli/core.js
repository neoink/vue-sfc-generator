const fs = require('fs');
const { join } = require('path');
const handlebars = require('handlebars');
const { ensureDirectoryExists } = require('./helpers');
const { promisify } = require('util');

// Promisify fs functions
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readDir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);

// Handlebars Helpers
handlebars.registerHelper('raw-helper', options => options.fn());

const core = {};

const createFile = async (file, data) => {
  let currentPath = `${data.componentPath}/${file.replace('templates/', '')}`;
  const source = await readFile(file, 'utf-8');

  // Handlebars generate template
  const template = handlebars.compile(source);
  const newTemplate = template(data);

  // Replace component name
  if (~file.indexOf('component.vue')) {
    currentPath = currentPath.replace(
      'component.vue',
      `${data.componentName}.vue`
    );
  }

  ensureDirectoryExists(currentPath);
  await writeFile(currentPath, newTemplate);

  return currentPath;
};

core.generateTemplate = (directory, data) => {
  return new Promise(async resolve => {
    const filesOrDirectory = await readDir(directory); // Foreach directories/files
    let currentDirectory = directory;

    for (let i = 0, len = filesOrDirectory.length; i < len; i += 1) {
      // Verify if current value is directory
      const stats = await lstat(
        join(`${__dirname}/../${directory}/${filesOrDirectory[i]}`)
      );
      const isDirectory = stats.isDirectory();

      if (isDirectory) {
        // If directory => recurcise
        currentDirectory += '/' + filesOrDirectory[i];
        await core.generateTemplate(`${currentDirectory}`, data);
      } else {
        // else remplace var with Handlebars and write directories/files
        await createFile(`${directory}/${filesOrDirectory[i]}`, data);
        currentDirectory = directory;
      }
    }

    resolve(true);
  });
};

module.exports = core;
