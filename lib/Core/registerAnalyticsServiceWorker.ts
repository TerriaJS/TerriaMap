/**
 * Registers the analytics Service Worker for tracking external resource loads.
 *
 * The Service Worker intercepts all external fetch requests and notifies the main
 * thread, which logs them through Terria's analytics system.
 *
 */

import type Terria from "terriajs/lib/Models/Terria";

export interface ExternalResourceAnalyticsConfig {
  enabled: boolean;
  excludeHostnames?: string[];
  includeHostnames?: string[];
  proxyBaseUrl?: string;
}

let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

/**
 * Register the analytics Service Worker.
 * Call this early in app initialization (e.g., in entry.js).
 */
export async function registerAnalyticsServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) {
    console.warn("[Analytics] Service Workers not supported in this browser");
    return null;
  }

  // Check if we're on HTTPS or localhost (required for Service Workers)
  const isSecureContext =
    window.location.protocol === "https:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (!isSecureContext) {
    console.warn(
      "[Analytics] Service Workers require HTTPS (except on localhost)"
    );
    return null;
  }

  try {
    serviceWorkerRegistration = await navigator.serviceWorker.register(
      "/analytics-sw.js",
      {
        scope: "/"
      }
    );

    console.log("[Analytics] Service Worker registered successfully");

    // Wait for the service worker to be active
    if (serviceWorkerRegistration.installing) {
      await new Promise<void>((resolve) => {
        serviceWorkerRegistration!.installing!.addEventListener(
          "statechange",
          function handler() {
            if (this.state === "activated") {
              this.removeEventListener("statechange", handler);
              resolve();
            }
          }
        );
      });
    }

    return serviceWorkerRegistration;
  } catch (error) {
    console.error("[Analytics] Service Worker registration failed:", error);
    return null;
  }
}

/**
 * Configure the analytics Service Worker and set up message listener.
 * Logs events via terria.analytics.logEvent().
 */
export function configureExternalResourceAnalytics(
  terria: Terria,
  config?: ExternalResourceAnalyticsConfig
): void {
  if (!serviceWorkerRegistration) {
    console.warn("[Analytics] Service Worker not registered, cannot configure");
    return;
  }

  const worker = serviceWorkerRegistration.active;
  if (!worker) {
    console.warn("[Analytics] Service Worker not active, cannot configure");
    return;
  }

  // Set up listener for messages from Service Worker
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "EXTERNAL_RESOURCE") {
      terria.analytics?.logEvent(
        "externalResource",
        event.data.hostname,
        event.data.success ? "success" : "failure"
      );
    }
  });

  const enabled = config?.enabled ?? false;

  worker.postMessage({
    type: "ANALYTICS_CONFIG",
    config: {
      enabled,
      excludeHostnames: config?.excludeHostnames ?? [],
      includeHostnames: config?.includeHostnames ?? [],
      proxyBaseUrl:
        config?.proxyBaseUrl ?? terria.corsProxy.baseProxyUrl ?? "proxy/"
    }
  });

  console.log(
    "[Analytics] External resource tracking:",
    enabled ? "enabled" : "disabled"
  );
}
