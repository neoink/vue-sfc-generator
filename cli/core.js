const fs = require('fs');
const { join, sep } = require('path');
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

const createFile = async (file, from, to, data) => {
  let currentPath = join(data.savePath, file);

  if (typeof to !== 'undefined') {
    currentPath = join(data.savePath, to, file).replace('templates', '');
  }

  const source = await readFile(join(from, file), 'utf-8');

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

  ensureDirectoryExists(currentPath, file);
  await writeFile(currentPath, newTemplate);

  return currentPath;
};

core.generateTemplate = (data, directory, to = undefined) => {
  return new Promise(async (resolve, reject) => {
    try {
      const filesOrDirectory = await readDir(directory); // Foreach directories/files

      for (let i = 0, len = filesOrDirectory.length; i < len; i += 1) {
        const currentItem = filesOrDirectory[i];
        const currentPath = directory + sep + currentItem;

        // Verify if current value is directory
        const stats = await lstat(currentPath);
        const isDirectory = stats.isDirectory();

        if (isDirectory) {
          // If directory => recurcise
          let cacheDirectory = currentPath.split(`templates${sep}`)[1];
          await core.generateTemplate(data, currentPath, cacheDirectory);
        } else {
          // else remplace var with Handlebars and write directories/files
          await createFile(currentItem, directory, to, data);
        }
      }

      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = core;
