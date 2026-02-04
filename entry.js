import { registerAnalyticsServiceWorker } from "./lib/Core/registerAnalyticsServiceWorker";
import { renderUi } from "./lib/Views/render";

// Register Service Worker early to intercept requests as soon as possible
registerAnalyticsServiceWorker();

renderUi();
