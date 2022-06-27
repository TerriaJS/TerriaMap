const path = require("path");
const fs = require("fs");

function configureWebpackForPlugins(config) {
  config.module.rules.push(createPluginIconsRule());
  return config;
}

/**
 * Creates a webpack rule for processing svg icons from terriajs plugins using `svg-sprite-loader`.
 * We check two things to decide whether to include an icon:
 *   1. The icon belongs to assets/icons folder
 *   2. assets/icons/../../package.json has a name field with `terriajs-plugin-` prefix
 *
 * @returns A webpack module rule
 */
function createPluginIconsRule() {
  const packageNames = {};
  return {
    test: /\.svg$/,
    include(svgPath) {
      const dirName = path.dirname(svgPath);
      const isIconDir = dirName.endsWith(path.join("assets", "icons"));
      if (!isIconDir) {
        return false;
      }

      const packageName = readPackageName(
        path.resolve(dirName, "..", "..", "package.json")
      );
      const isTerriaJsPlugin = packageName ? packageName.startsWith("terriajs-plugin-") : false
      packageNames[svgPath] = packageName;
      return isTerriaJsPlugin;
    },
    loader: require.resolve("svg-sprite-loader"),
    options: {
      esModule: false,
      symbolId: svgPath => {
        // Generate a symbolId by concatenating the package name and the icon name
        const packageName = packageNames[svgPath] || "terriajs-plugin-";
        const iconName = path.basename(svgPath, ".svg");
        const symbolId = `${packageName}-${iconName}`;
        return symbolId;
      }
    }
  };
}

const packageJsonNames = {};
function readPackageName(packageFile) {
  if (packageJsonNames[packageFile]) {
    return packageJsonNames[packageFile];
  } else {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageFile));
      packageJsonNames[packageFile] = packageJson ? packageJson.name : undefined;
      return packageJsonNames[packageFile];
    } catch {}
  }
  return undefined;
}

module.exports = configureWebpackForPlugins;
