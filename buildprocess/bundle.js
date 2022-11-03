const esbuild = require("esbuild");
const sassPlugin = require("esbuild-plugin-sass");
const path = require("path");

esbuild
  .build({
    entryPoints: ["index.js"],
    bundle: true,
    outfile: "esbuild/foo.js",
    plugins: [
      sassPlugin({
        customSassOptions: {
          verbose: false,
          // Support resolving paths like "terriajs/..."
          loadPaths: [
            path.resolve(
              path.dirname(require.resolve("terriajs/package.json")),
              ".."
            )
          ]
        }
      })
    ],
    loader: {
      ".gif": "file",
      ".png": "file",
      ".svg": "file",
      ".html": "text",
      ".glb": "file",
      ".xml": "file",
      ".DAC": "file"
    }
    //logLimit: 10,
    //logLevel: "verbose"
  })
  .catch((e) => console.error("ERRORS!"));
