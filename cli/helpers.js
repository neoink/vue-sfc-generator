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

  return {
    pascalify,
    kebabcase
  };
})();
