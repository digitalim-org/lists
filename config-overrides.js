const { override, addBabelPlugin } = require("customize-cra");
const rewireInlineImportGraphqlAst = require("react-app-rewire-inline-import-graphql-ast");

// module.exports = override(addBabelPlugin("import-graphql"));
module.exports = override((config, ...args) => {
  config = rewireInlineImportGraphqlAst(config, ...args);
  return config;
});
