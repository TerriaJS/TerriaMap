import fs from "node:fs";

import type { Plugin } from "vite";

/**
 * Import XML/KML files from lib/Models as raw text strings.
 */
export function xmlRawPlugin(): Plugin {
  return {
    name: "xml-raw",
    transform(_code, id) {
      if (
        (id.endsWith(".xml") || id.endsWith(".kml")) &&
        id.includes("lib/Models")
      ) {
        const content = fs.readFileSync(id, "utf-8");
        return {
          code: `export default ${JSON.stringify(content)};`,
          map: null
        };
      }
    }
  };
}

/**
 * Strip moment.js locale imports to save ~500KB.
 * Webpack used IgnorePlugin for this; in Vite we return an empty module.
 */
export function momentLocalePlugin(): Plugin {
  return {
    name: "moment-locale-strip",
    resolveId(source, importer) {
      if (source === "./locale" && importer && importer.includes("moment")) {
        return "\0moment-locale-empty";
      }
    },
    load(id) {
      if (id === "\0moment-locale-empty") {
        return "export default {};";
      }
    }
  };
}
