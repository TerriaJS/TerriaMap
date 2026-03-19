import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { patchCssModules } from "vite-css-modules";
import { viteStaticCopy } from "vite-plugin-static-copy";

import {
  momentLocalePlugin,
  xmlRawPlugin
} from "./buildprocess/vite-plugins/assetPlugins";
import { cesiumDebugStripPlugin } from "./buildprocess/vite-plugins/cesiumPlugin";
import { scssCssModulesPlugin } from "./buildprocess/vite-plugins/scssCssModulesPlugin";
import { svgSpritePlugin } from "./buildprocess/vite-plugins/svgSpritePlugin";

const terriaJSBasePath = path.resolve(__dirname, "packages/terriajs");
const cesiumDir = path.dirname(
  require.resolve("terriajs-cesium/package.json", {
    paths: [terriaJSBasePath]
  })
);

export default defineConfig(({ mode }) => {
  const devMode = mode === "development";

  return {
    publicDir: "wwwroot",

    build: {
      outDir: "wwwroot/build",
      copyPublicDir: false,
      sourcemap: devMode ? "inline" : false,
      cssMinify: false,
      assetsInlineLimit: 8192,
      rollupOptions: {
        input: path.resolve(__dirname, "index.html")
      }
    },

    css: {
      modules: {
        localsConvention: "camelCase",
        generateScopedName(name: string, filename: string) {
          // Strip virtual .module extension added by scssCssModulesPlugin
          let basename = path.basename(filename, path.extname(filename));
          basename = basename.replace(/\.module$/, "");
          return `tjs-${basename}__${name}`;
        }
      },
      preprocessorOptions: {
        scss: {
          api: "modern",
          loadPaths: [
            path.resolve(terriaJSBasePath, "lib"),
            path.resolve(terriaJSBasePath, "lib", "Sass"),
            path.resolve(terriaJSBasePath, "node_modules"),
            path.resolve(__dirname, "node_modules"),
            terriaJSBasePath
          ]
        }
      }
    },

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      alias: {
        "@cesium/engine": cesiumDir,
        "terriajs-variables": path.resolve(
          __dirname,
          "lib/Styles/variables-overrides.scss"
        ),
        lodash: "lodash-es",
        react: path.dirname(require.resolve("react")),
        "react-dom": path.dirname(require.resolve("react-dom"))
      }
    },

    // PBF and DAC files should be emitted as separate files (URL import)
    assetsInclude: ["**/*.pbf", "**/*.DAC"],

    optimizeDeps: {
      exclude: ["terriajs"]
    },

    server: {
      hmr: false,
      proxy: {
        "/proxy": "http://localhost:3002",
        "/proxyabledomains": "http://localhost:3002",
        "/api": "http://localhost:3002",
        "/serverconfig": "http://localhost:3002"
      },
      fs: {
        allow: [__dirname, terriaJSBasePath, cesiumDir]
      }
    },

    plugins: [
      patchCssModules(),
      scssCssModulesPlugin(),
      svgSpritePlugin([
        {
          dir: path.resolve(terriaJSBasePath, "wwwroot/images/icons"),
          namespace: "terriajs"
        }
      ]),
      xmlRawPlugin(),
      momentLocalePlugin(),
      viteStaticCopy({
        targets: [
          {
            src: path.join(terriaJSBasePath, "wwwroot") + "/*",
            dest: "TerriaJS"
          },
          {
            src: path.join(cesiumDir, "Build", "Workers"),
            dest: "cesiumAssets"
          },
          {
            src: path.join(cesiumDir, "Source", "Assets"),
            dest: "cesiumAssets"
          },
          {
            src: path.join(cesiumDir, "Build", "ThirdParty"),
            dest: "cesiumAssets"
          }
        ]
      }),
      cesiumDebugStripPlugin(cesiumDir),
      react({
        babel: {
          plugins: [
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/transform-class-properties"],
            "babel-plugin-styled-components"
          ],
          assumptions: {
            setPublicClassFields: false
          }
        }
      })
    ]
  };
});
