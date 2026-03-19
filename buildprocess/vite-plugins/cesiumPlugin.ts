import { cpSync, createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";

import type { Plugin, ResolvedConfig } from "vite";

const MIME_TYPES: Record<string, string> = {
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".json": "application/json",
  ".wasm": "application/wasm",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".glb": "model/gltf-binary",
  ".bin": "application/octet-stream"
};

/**
 * Serves Cesium Workers, Assets, and ThirdParty from the terriajs-cesium
 * package and terriajs wwwroot static assets during dev mode.
 *
 * At runtime, Cesium resolves assets relative to `cesiumBaseUrl` which is
 * set to `build/TerriaJS/build/Cesium/build/` by the app's index.js.
 */
export function cesiumPlugin(options: {
  terriaJSBasePath: string;
  cesiumDir: string;
}): Plugin {
  const { terriaJSBasePath, cesiumDir } = options;
  const terriaJSWwwroot = path.join(terriaJSBasePath, "wwwroot");
  let outDir = "";

  return {
    name: "cesium-assets",

    configResolved(config: ResolvedConfig) {
      outDir = path.resolve(config.root, config.build.outDir);
    },

    closeBundle() {
      // Copy terriajs wwwroot → outDir/TerriaJS/ (mirrors gulp copy-terriajs-assets)
      const destPath = path.join(outDir, "TerriaJS");
      cpSync(terriaJSWwwroot, destPath, { recursive: true });
    },

    configureServer(server) {
      // Serve terriajs wwwroot at /build/TerriaJS/
      // This mirrors the gulp `copy-terriajs-assets` task
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();

        const url = decodeURIComponent(req.url.split("?")[0]);

        // Serve terriajs wwwroot assets at /build/TerriaJS/
        if (url.startsWith("/build/TerriaJS/")) {
          const assetPath = url.slice("/build/TerriaJS/".length);
          const filePath = path.join(terriaJSWwwroot, assetPath);
          return serveFile(filePath, res, next);
        }

        // Serve WASM with correct MIME type
        if (url.endsWith(".wasm")) {
          const wasmPath = url.startsWith("/build/")
            ? path.join(terriaJSWwwroot, url.slice(1))
            : null;
          if (wasmPath && existsSync(wasmPath)) {
            return serveFile(wasmPath, res, next);
          }
        }

        next();
      });
    }
  };

  function serveFile(
    filePath: string,
    res: import("http").ServerResponse,
    next: () => void
  ) {
    if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
      return next();
    }
    const ext = path.extname(filePath);
    const mime = MIME_TYPES[ext] || "application/octet-stream";
    res.setHeader("Content-Type", mime);
    res.setHeader("Cache-Control", "no-cache");
    createReadStream(filePath).pipe(res);
  }
}

/**
 * Strip Cesium debug pragmas in production builds.
 * Removes code between //>>includeStart('debug') and //>>includeEnd('debug').
 */
export function cesiumDebugStripPlugin(cesiumDir: string): Plugin {
  const pragmaRegex =
    /\/\/>>includeStart\('debug', pragmas\.debug\);?[^]*?\/\/>>includeEnd\('debug'\);?/g;

  return {
    name: "cesium-strip-debug",
    apply: "build",
    transform(code, id) {
      if (!id.endsWith(".js") || !id.includes(cesiumDir)) return;
      return { code: code.replace(pragmaRegex, ""), map: null };
    }
  };
}
