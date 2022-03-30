import {
  TerriaPlugin,
  createPluginContext,
  ViewState
} from "terriajs-plugin-api";
import TerriaError from "terriajs/lib/Core/TerriaError";

type PluginModule = { default: TerriaPlugin };

/**
 * Load plugin modules.
 *
 * @param pluginPromises Array of promise returning plugin modules.
 */
async function loadPlugins(
  viewState: ViewState,
  pluginPromises: Promise<PluginModule>[]
): Promise<void> {
  const loadPromises = pluginPromises.map(promise => {
    const pluginContext = createPluginContext(viewState);
    promise
      .then(({ default: plugin }) => {
        try {
          plugin.register(pluginContext);
        } catch (ex) {
          const error = TerriaError.from(ex, {
            title: `Error when registering plugin "${plugin.name}"`
          });
          console.error(error);
        }
      })
      .catch(ex => {
        const error = TerriaError.from(ex, {
          title: `Error when loading a plugin`
        });
        console.error(error);
      });
  });
  await Promise.all(loadPromises);
}

export default loadPlugins;
