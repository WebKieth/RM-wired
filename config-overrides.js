const { override, addDecoratorsLegacy, disableEsLint, addBundleVisualizer, addWebpackAlias } = require("customize-cra");
const path = require("path");
const rewireAliases = require('react-app-rewire-aliases');
const { paths } = require('react-app-rewired');

module.exports = override(
  addDecoratorsLegacy(),
  disableEsLint(),
  config => (process.env.BUNDLE_VISUALIZE == 1 ? addBundleVisualizer()(config) : config),
  addWebpackAlias({ ["ag-grid-react$"]: path.resolve(__dirname, "src/shared/agGridWrapper.js") }),
  (config, env) => {
    config = rewireAliases.aliasesOptions({
      '@': path.resolve(__dirname, `${paths.appSrc}`),
      '@icons': path.resolve(__dirname, `${paths.appSrc}/assets/icons`),
      '@common': path.resolve(__dirname, `${paths.appSrc}/components/common`),
      '@hoc': path.resolve(__dirname, `${paths.appSrc}/components/hoc`),
      '@stores': path.resolve(__dirname, `${paths.appSrc}/components/store`),
      '@routes': path.resolve(__dirname, `${paths.appSrc}/components/routes`),
      '@utils': path.resolve(__dirname, `${paths.appSrc}/utils`),
      '@urls': path.resolve(__dirname, `${paths.appSrc}/url.js`),
    })(config, env);
    return config;
  }
);