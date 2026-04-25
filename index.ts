import ConsoleAnalytics from "terriajs/lib/Core/Analytics/ConsoleAnalytics";
import GoogleAnalytics from "terriajs/lib/Core/Analytics/GoogleAnalytics";
import { loadConfig } from "terriajs/lib/Core/loadConfig";
import { ServerConfig } from "terriajs/lib/Core/ServerConfig";
import registerCatalogMembers from "terriajs/lib/Models/Catalog/registerCatalogMembers";
import { FeedbackService } from "terriajs/lib/Models/FeedbackService";
import { parseHashParams } from "terriajs/lib/Models/HashParams";
import {
  buildInitSourcesFromConfig,
  updateInitSourcesFromUrl
} from "terriajs/lib/Models/InitSource";
import registerSearchProviders from "terriajs/lib/Models/SearchProviders/registerSearchProviders";
import ShareDataService from "terriajs/lib/Models/ShareDataService";
import Terria from "terriajs/lib/Models/Terria";
import ViewState from "terriajs/lib/ReactViewModels/ViewState";
import registerCustomComponentTypes from "terriajs/lib/ReactViews/Custom/registerCustomComponentTypes";
import updateApplicationOnHashChange from "terriajs/lib/ViewModels/updateApplicationOnHashChange";
import updateApplicationOnMessageFromParentWindow from "terriajs/lib/ViewModels/updateApplicationOnMessageFromParentWindow";
import URI from "urijs";
import loadPlugins from "./lib/Core/loadPlugins";
import showGlobalDisclaimer from "./lib/Views/showGlobalDisclaimer";
import plugins from "./plugins";

// Register all types of catalog members in the core TerriaJS.  If you only want to register a subset of them
// (i.e. to reduce the size of your application if you don't actually use them all), feel free to copy a subset of
// the code in the registerCatalogMembers function here instead.
registerCatalogMembers();

// Register custom search providers in the core TerriaJS. If you only want to register a subset of them, or to add your own,
// insert your custom version of the code in the registerSearchProviders function here instead.
registerSearchProviders();

export default (async () => {
  const hashParams = parseHashParams(window.location.toString());

  const configUrl = hashParams.configUrl || "config.json";
  const config = await loadConfig(configUrl);

  const serverConfig = await new ServerConfig().init(
    config.parameters.serverConfigUrl
  );

  const terria = new Terria({
    config: config.parameters,
    baseUrl: "build/TerriaJS"
  });

  // Create the ViewState before terria.start so that errors have somewhere to go.
  const viewState = new ViewState({
    terria: terria
  });

  // Register custom components in the core TerriaJS.  If you only want to register a subset of them, or to add your own,
  // insert your custom version of the code in the registerCustomComponentTypes function here instead.
  registerCustomComponentTypes(terria);

  await terria.setHashParams(hashParams).initLanguage();

  if (config.parameters.feedbackUrl) {
    terria.setFeedbackService(
      new FeedbackService({
        terria,
        additionalFeedbackParameters: serverConfig?.additionalFeedbackParameters
      })
    );
  }
  const shareDataService = new ShareDataService({
    terria: terria,
    sharePrefix: serverConfig?.newShareUrlPrefix,
    shareMaxRequestSize: serverConfig?.shareMaxRequestSize,
    shareMaxRequestSizeBytes: serverConfig?.shareMaxRequestSizeBytes
  });
  terria.setShareDataService(shareDataService);

  terria.initCorsProxy({
    proxyAllDomains: serverConfig?.proxyAllDomains,
    allowProxyFor: serverConfig?.allowProxyFor,
    baseProxyUrl: config.parameters.corsProxyBaseUrl,
    proxyDomains: []
  });

  if (process.env.NODE_ENV === "development") {
    terria.setAnalyticsService(new ConsoleAnalytics());
  } else {
    terria.setAnalyticsService(new GoogleAnalytics());
  }

  terria.initCatalogIndex().build();

  await loadPlugins(viewState, plugins);

  if (!hashParams.clean) {
    const initSources = buildInitSourcesFromConfig({
      initializationUrls: config.initializationUrls,
      v7initializationUrls: config.v7initializationUrls,
      baseUri: new URI(configUrl).filename(""),
      initFragmentPaths: config.parameters.initFragmentPaths
    });
    terria.addInitSources(initSources);
  }

  const baseUrl = `${window.location.origin}/${terria.baseUrl}`.replace(
    /(\.\/|\/\.|\.)$/,
    ""
  );

  updateInitSourcesFromUrl(window.location.toString(), baseUrl, terria);
  (await terria.loadInitSources()).raiseError(terria);

  // Override the default document title with appName. Check first for default
  // title, because user might have already customized the title in
  // index.ejs
  if (document.title === "Terria Map") {
    document.title = terria.appName;
  }

  try {
    updateApplicationOnHashChange(terria, window);
    updateApplicationOnMessageFromParentWindow(terria, window);
  } catch (e) {
    console.error(e);
    // @ts-expect-error
    console.error(e.stack);
  }

  // Show a modal disclaimer before user can do anything else.
  if (config.parameters.globalDisclaimer) {
    showGlobalDisclaimer(viewState);
  }

  // Add font-imports
  const fontImports = config.parameters.theme?.fontImports;
  if (fontImports) {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = fontImports;
    document.head.appendChild(styleSheet);
  }

  if (process.env.NODE_ENV === "development") {
    // @ts-expect-error: test
    window.viewState = viewState;
  }

  return { terria, viewState };
})();
