/**
 * Service Worker for External Resource Analytics
 *
 * This service worker intercepts all fetch requests and notifies the main thread
 * about external resource loads. The main thread logs them via Terria's analytics.
 *
 * Configuration is passed via message from the main thread after registration.
 */

let config = {
  enabled: false,
  // Hostnames to exclude from logging
  excludeHostnames: [],
  // Only log requests to these hostnames (empty = log all external)
  includeHostnames: [],
  // Proxy base URL to extract target hostname from proxied requests
  proxyBaseUrl: null
};

/**
 * Extract the target hostname from a URL, handling proxied URLs.
 */
function getTargetHostname(url) {
  try {
    const parsed = new URL(url);

    // Check if this URL goes through a configured proxy
    if (config.proxyBaseUrl && url.includes(config.proxyBaseUrl)) {
      const proxyIndex =
        url.indexOf(config.proxyBaseUrl) + config.proxyBaseUrl.length;
      let targetUrl = url.substring(proxyIndex);

      // Skip optional cache flag (e.g., "_1d/", "_2d/")
      const cacheFlagMatch = targetUrl.match(/^_[^/]+\/(.+)$/);
      if (cacheFlagMatch) {
        targetUrl = cacheFlagMatch[1];
      }

      // Normalize the URL (handle https:/ -> https://)
      const normalizedUrl = targetUrl.replace(/^(https?):\/([^/])/, "$1://$2");
      return new URL(normalizedUrl).hostname;
    }

    return parsed.hostname;
  } catch {
    return "unknown";
  }
}

/**
 * Check if a URL is a proxied request.
 */
function isProxiedRequest(url) {
  return config.proxyBaseUrl && url.includes(config.proxyBaseUrl);
}

/**
 * Check if a request should be logged.
 */
function shouldLogRequest(url) {
  if (!config.enabled) {
    return false;
  }

  try {
    const parsed = new URL(url);

    // Skip non-http(s) protocols
    if (!parsed.protocol.startsWith("http")) {
      return false;
    }

    // Skip same-origin requests UNLESS they're going through the proxy
    if (parsed.origin === self.location.origin && !isProxiedRequest(url)) {
      return false;
    }

    const hostname = getTargetHostname(url);

    // Skip excluded hostnames
    if (config.excludeHostnames.some((h) => hostname.includes(h))) {
      return false;
    }

    // If includeHostnames is set, only log those
    if (config.includeHostnames.length > 0) {
      return config.includeHostnames.some((h) => hostname.includes(h));
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Notify the main thread about an external resource load.
 */
async function notifyMainThread(url, success) {
  const hostname = getTargetHostname(url);

  // Send message to all clients (main thread)
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      type: "EXTERNAL_RESOURCE",
      hostname: hostname,
      success: success
    });
  });
}

// Handle messages from the main thread (for configuration)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "ANALYTICS_CONFIG") {
    config = { ...config, ...event.data.config };
    console.log(
      "[Analytics SW] Configuration updated:",
      config.enabled ? "enabled" : "disabled"
    );
  }
});

// Install event - take control immediately
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate event - claim all clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch event - intercept all requests
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (!shouldLogRequest(url)) {
    return; // Let the request proceed normally without interception
  }

  // Intercept the request to track success/failure
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        notifyMainThread(url, response.ok);
        return response;
      })
      .catch((error) => {
        notifyMainThread(url, false);
        throw error;
      })
  );
});
