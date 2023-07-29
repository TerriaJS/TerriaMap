import { TerriaPluginModule } from "terriajs-plugin-api";

if (
  !new (class {
    x;
  })().hasOwnProperty("x")
)
  throw new Error("Transpiler is not configured correctly");

/**
 * A function that when called imports all plugins.
 */
const plugins: () => Promise<TerriaPluginModule>[] = () => [
  // Add plugin imports. Example:
  // import("terriajs-plugin-sample"),
];

export default plugins;
