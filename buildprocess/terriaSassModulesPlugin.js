/**
 * TODOs:
 *  - De-duplicate generated css
 *  - Minify generated css
 *  - Figure out a way to extract css (for prod builds)
 *  - Adding sass increases the build time on my machine to ~5 secs. See if we can improve it.
 */

const postcssModulesPlugin = require("postcss-modules");
const FileSystemLoader =
  require("postcss-modules/build/css-loader-core/loader").default;
const CssModuleParser =
  require("postcss-modules/build/css-loader-core/parser").default;
const postcss = require("postcss");
const postcssSass = require("@csstools/postcss-sass");
const { sassPlugin, makeModule } = require("esbuild-sass-plugin");

class TerriaSassModuleLoader extends FileSystemLoader {
  constructor(root, plugins) {
    super(root, plugins);
    this.core = {
      load: async function loadSassModule(
        sourceString,
        sourcePath,
        trace,
        pathFetcher
      ) {
        const parser = new CssModuleParser(pathFetcher, trace);
        const extraPlugins = plugins.concat([parser.plugin()]);
        const result = await postcss(extraPlugins).process(sourceString, {
          from: sourcePath,
          syntax: require("postcss-scss")
        });

        return {
          injectableSource: result.css,
          exportTokens: parser.exportTokens
        };
      }
    };
  }
}

/**
 * A scss + css-modules, esbuild plugin for loading terriajs sass modules
 *
 * There is legacy code in Terria that uses a combination of scss +
 * css-modules.  We can use a combination of esbuild-sass-plugin and
 * css-modules plugin to process them.  However, the css-modules plugin trips
 * when it encounters `composes` instructions that import other sass-modules.
 * eg: 'composes: x from "somewhere.scss"'.
 *
 * So we have to setup our own Loader
 * to pre-compile sass imports to css that css-modules plugin understands.
 */
const sassModulesPlugin = ({ includePaths }) => {
  /**
   * This plugin combination results in one module generated for each .scss file imported from a jsx/tsx file
   * It also inserts 1 <style> header for each import.
   * This results in:
   *   1. duplicate css class definitions
   *   2. some breakage of styles because of a duplicate style overriding some other style which it shouldn't.
   *  We have to figure out a way to minimize and remove duplicates and write just 1 <style> header.
   */
  return sassPlugin({
    transform: async function (source, dirname, from) {
      let cssModule;
      const { css } = await postcss([
        postcssSass({
          includePaths
        }),
        postcssModulesPlugin({
          Loader: TerriaSassModuleLoader,
          localsConvention: "camelCase",
          generateScopedName: "tjs-[name]__[local]",
          getJSON(cssFilename, json) {
            cssModule = JSON.stringify(json, null, 2);
          }
        })
      ]).process(source, { from, map: false });
      return {
        contents: `${makeModule(
          css,
          "style",
          this.nonce
        )}export default ${cssModule};`,
        loader: "js"
      };
    }
  });
};

module.exports = sassModulesPlugin;
