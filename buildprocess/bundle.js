const esbuild = require("esbuild");
const sassPlugin = require("esbuild-plugin-sass");
const path = require("path");

esbuild
  .build({
    entryPoints: ["index.js"],
    bundle: true,
    outfile: "wwwroot/esbuild/TerriaMap.js",
    jsx: "transform",
    plugins: [
      sassPlugin({
        customSassOptions: {
          verbose: false,
          loadPaths: [
            // Support resolving paths like "terriajs/..."
            path.resolve(
              path.dirname(require.resolve("terriajs/package.json")),
              ".."
            ),
            path.resolve(
              path.dirname(require.resolve("rc-slider/package.json")),
              ".."
            ),
            path.resolve(
              path.dirname(
                require.resolve("react-anything-sortable/package.json")
              ),
              ".."
            )
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
      ".DAC": "file"
    },
    external: [
      // Don't try to load node-only modules and other unnecessary stuff
      "fs",
      "path",
      "http",
      "https",
      "zlib",
      "geojson-stream"
    ]
    // metafile: true,
    //logLimit: 10,
    //logLevel: "verbose"
  })
  .then((result) => {
    console.log(result.metafile);
  })
  .catch((e) => console.error("ERRORS!"));
