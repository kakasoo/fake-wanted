module.exports = {
  // DEFAULT CONFIGURATIONS
  parser: "typescript",
  printWidth: 120,
  semi: true,
  tabWidth: 2,
  trailingComma: "all",

  // PLUG-IN CONFIGURATIONS
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: ["^@kakasoo/fake-wanted-api(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ["decorators-legacy", "typescript"],
};
