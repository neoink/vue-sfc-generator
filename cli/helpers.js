const fs = require('fs');
const path = require('path');

module.exports = (() => {
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

  // Helper to ensure directory exists before writing file to it
  const ensureDirectoryExists = filePath => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    ensureDirectoryExists(dirname);
    fs.mkdirSync(dirname);
  };

  return {
    pascalify,
    kebabcase,
    ensureDirectoryExists
  };
})();
