import {
  TerriaPlugin,
  createPluginContext,
  ViewState
} from "terriajs-plugin-api";

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
        } catch (error) {
          console.error(`Error when registering plugin "${plugin.name}"`);
          console.error(error);
        }
      })
      .catch(error => console.error(`Error when loading a plugin`, error));
  });
  await Promise.all(loadPromises);
}

export default loadPlugins;
