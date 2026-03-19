import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

import { configureVite } from "terriajs/buildprocess/configureVite.mjs";

const require = createRequire(import.meta.url);

const terriaJSBasePath = path.dirname(
  require.resolve("terriajs/package.json", {})
);
const cesiumDir = path.dirname(require.resolve("terriajs-cesium/package.json"));

const PluginPackagePattern = /(^@terriajs\/plugin-|^terriajs-.*plugin)/;

function discoverPluginIconDirs(): { dir: string; namespace: string }[] {
  const dirs: { dir: string; namespace: string }[] = [];
  const nodeModules = path.resolve(__dirname, "node_modules");

  function scanDir(base: string) {
    if (!fs.existsSync(base)) return;
    for (const entry of fs.readdirSync(base)) {
      if (entry.startsWith("@")) {
        scanDir(path.join(base, entry));
        continue;
      }
      const pkgName = base.endsWith("node_modules")
        ? entry
        : `${path.basename(base)}/${entry}`;
      if (!PluginPackagePattern.test(pkgName)) continue;
      const iconsDir = path.join(base, entry, "assets", "icons");
      if (fs.existsSync(iconsDir)) {
        dirs.push({ dir: iconsDir, namespace: pkgName });
      }
    }
  }

  scanDir(nodeModules);
  return dirs;
}

const shared = configureVite({
  terriaJSBasePath,
  extraIconDirs: discoverPluginIconDirs(),
  terriaVariablesPath: path.resolve(
    __dirname,
    "lib/Styles/variables-overrides.scss"
  ),
  buildOutputPath: "build"
});

export default defineConfig(({ mode }) => {
  const devMode = mode === "development";

  return mergeConfig(shared, {
    publicDir: "wwwroot",

    build: {
      outDir: "wwwroot",
      emptyOutDir: false,
      assetsDir: "build/assets",
      copyPublicDir: false,
      sourcemap: devMode ? "inline" : false,
      cssMinify: false,
      assetsInlineLimit: 8192,
      rolldownOptions: {
        input: path.resolve(__dirname, "index.html")
      }
    },

    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [path.resolve(__dirname, "node_modules")]
        }
      }
    },

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
      viteStaticCopy({
        targets: [
          {
            src: path.join(terriaJSBasePath, "assets") + "/*",
            dest: "./build"
          }
        ]
      }),
      react({
        include: /\.[jt]sx?$/,
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
  });
});
