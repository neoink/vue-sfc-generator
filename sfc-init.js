#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const readlineSync = require('readline-sync');

// Helpers for creating kebab-case/PascalCase versions of string
const pascalify = str => {
  const camelized = str.replace(/-([a-z])/g, c => c[1].toUpperCase());
  return camelized.charAt(0).toUpperCase() + camelized.slice(1);
};
const kebabcase = string =>
  string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();

// Helper to replace vars in files
const replaceVars = function replaceVars(str, vars) {
  let newstr = str;
  Object.keys(vars).forEach(key => {
    const rx = new RegExp('{{\\s?' + key + '\\s?}}', 'g');
    newstr = newstr.replace(rx, vars[key]);
  });
  return newstr;
};

// Helper to ensure directory exists before writing file to it
const ensureDirectoryExists = filePath => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
};

// Prompt user for input to populate template files
const npmName = readlineSync.question(
  'What is the npm name of your component? '
);
const componentName = readlineSync.question(
  'What is the kebab-case tag name for your component? (' +
    kebabcase(npmName) +
    ') ',
  {
    defaultInput: kebabcase(npmName)
  }
);
const savePath = readlineSync.questionPath(
  'Enter a location to save the component files: (./' + componentName + ') ',
  {
    defaultInput: path.join(process.cwd(), componentName),
    exists: false,
    isDirectory: true,
    create: true
  }
);

// Stop prompting for input, start processing
const componentNamePascal = pascalify(componentName);
const vars = {
  npmName,
  componentName,
  componentNamePascal
};
const newFiles = {
  package: '',
  rollupConfig: '',
  indexjs: '',
  wrapper: '',
  component: ''
};

const directoryPath = path.join(__dirname, 'templates');

fs.readdir(directoryPath, function(err, items) {
  for (var i = 0; i < items.length; i++) {
    var file = directoryPath + '/' + items[i];
    console.log('Start: ' + file);
    console.log(ensureDirectoryExists(file));

    fs.stat(file, function(err, stats) {
      console.log(file);
      console.log(stats['size']);
    });
  }
});

newFiles.package = replaceVars(
  fs.readFileSync(path.join(__dirname, 'templates', 'package.json')).toString(),
  vars
);
newFiles.rollupConfig = replaceVars(
  fs
    .readFileSync(
      path.join(__dirname, 'templates', 'build', 'rollup.config.js')
    )
    .toString(),
  vars
);
newFiles.indexjs = replaceVars(
  fs
    .readFileSync(path.join(__dirname, 'templates', 'src', 'index.js'))
    .toString(),
  vars
);
newFiles.wrapper = replaceVars(
  fs
    .readFileSync(path.join(__dirname, 'templates', 'src', 'App.vue'))
    .toString(),
  vars
);
newFiles.component = replaceVars(
  fs
    .readFileSync(
      path.join(__dirname, 'templates', 'src/components', 'component.vue')
    )
    .toString(),
  vars
);

const paths = {
  package: path.join(savePath, 'package.json'),
  rollupConfig: path.join(savePath, 'build', 'rollup.config.js'),
  indexjs: path.join(savePath, 'src', 'index.js'),
  wrapper: path.join(savePath, 'src', 'App.vue'),
  component: path.join(savePath, 'src/components', componentName + '.vue')
};

Object.keys(paths).forEach(key => {
  ensureDirectoryExists(paths[key]);
  fs.writeFileSync(paths[key], newFiles[key]);
});

// Display completion messages
console.log(
  '\n' +
    'Init is complete, your files have been generated and saved into ' +
    'the directory you specified above.' +
    '\n' +
    'Within that directory, use src/' +
    componentName +
    '.vue as a ' +
    'starting point for your SFC.' +
    '\n' +
    "When you're ready, run `yarn build` to generate the redistributable versions." +
    '\n\n'
);
