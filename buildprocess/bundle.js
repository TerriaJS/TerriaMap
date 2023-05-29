const esbuild = require("esbuild");
const terriaSassModulesPlugin = require("./terriaSassModulesPlugin");
const babelPlugin = require("./babelPlugin");
const transformJsxControlStatements = require("./babelPluginTransformJsxControlStatements");
const path = require("path");
//const sassPlugin = require("esbuild-sass-plugin").default;
const { postcssModules, default: sassPlugin } = require("esbuild-sass-plugin");
const FileSystemLoader =
  require("postcss-modules/build/FileSystemLoader").default;
const postcssSass = require("@csstools/postcss-sass");

const includePaths = [
  // Support resolving paths like "terriajs/..."
  path.resolve(path.dirname(require.resolve("terriajs/package.json")), ".."),
  path.resolve(path.dirname(require.resolve("rc-slider/package.json")), ".."),
  path.resolve(
    path.dirname(require.resolve("react-anything-sortable/package.json")),
    ".."
  )
];

terriaSassModulesPlugin.TerriaSassModuleLoader.includePaths = includePaths;

const sassPluginInstantiated = sassPlugin({
  loadPaths: includePaths,
  // transform: async function(source, dirname, path) {
  //   postcssModules()
  // },
  transform: postcssModules(
    {
      Loader: terriaSassModulesPlugin.TerriaSassModuleLoader,
      localsConvention: "camelCase",
      generateScopedName: "tjs-[name]__[local]"
      // getJSON(cssFilename, json) {
      //   cssModule = JSON.stringify(json, null, 2);
      // }
    },
    [],
    [
      postcssSass({
        includePaths
      })
    ]
  )
});

terriaSassModulesPlugin.TerriaSassModuleLoader.sassPlugin =
  sassPluginInstantiated;

esbuild
  .build({
    entryPoints: ["index.js"],
    bundle: true,
    outfile: "wwwroot/esbuild/TerriaMap.js",
    jsx: "transform",
    define: {
      "process.env.NODE_ENV":
        '"' + (process.env.NODE_ENV ?? "Development") + '"',
      "module.hot": "false",
      global: "globalThis"
    },
    sourcemap: true,
    plugins: [
      sassPluginInstantiated,
      // terriaSassModulesPlugin({
      //   includePaths: [
      //     // Support resolving paths like "terriajs/..."
      //     path.resolve(
      //       path.dirname(require.resolve("terriajs/package.json")),
      //       ".."
      //     ),
      //     path.resolve(
      //       path.dirname(require.resolve("rc-slider/package.json")),
      //       ".."
      //     ),
      //     path.resolve(
      //       path.dirname(
      //         require.resolve("react-anything-sortable/package.json")
      //       ),
      //       ".."
      //     )
      //   ]
      // }),
      babelPlugin({
        filter: /\.[jt]sx$/,
        config: {
          plugins: [
            //"babel-plugin-jsx-control-statements",
            transformJsxControlStatements,
            "@babel/plugin-syntax-typescript",
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            "@babel/proposal-class-properties",
            "babel-plugin-syntax-jsx",
            "babel-plugin-macros",
            "babel-plugin-styled-components"
          ]
        }
      })
    ],
    loader: {
      ".gif": "file",
      ".png": "file",
      ".jpg": "file",
      ".svg": "file",
      ".html": "text",
      ".glb": "file",
      ".xml": "file",
      ".DAC": "file",
      ".scss": "file" // this is wrong, but let's go with it for now
    },
    external: [
      // Don't try to load node-only modules and other unnecessary stuff
      "fs",
      "path",
      "http",
      "https",
      "zlib",
      "../../wwwroot/images/drag-drop.svg",
      "../../../../wwwroot/images/TimelineIcons.png"
      //"geojson-stream"
    ]
  })
  .then((result) => {
    console.log("success");
    //console.log(result);
  })
  .catch((e) => {
    console.log("error");
    //console.error("ERRORS!", e);
  });
