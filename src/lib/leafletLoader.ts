/**
 * Dynamic loader for Leaflet library (CSS & JS).
 * Loads Leaflet on demand only when the map picker screen is mounted,
 * avoiding any peer dependency issues with React 19 or global bloat.
 */

declare global {
  interface Window {
    L: any;
  }
}

let leafletPromise: Promise<any> | null = null;

export function loadLeaflet(): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Leaflet cannot be loaded on the server"));
  }

  if (window.L) {
    return Promise.resolve(window.L);
  }

  if (leafletPromise) {
    return leafletPromise;
  }

  leafletPromise = new Promise((resolve, reject) => {
    // 1. Inject Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // 2. Check if script tag already exists
    const existing = document.getElementById("leaflet-js") as HTMLScriptElement | null;
    if (existing) {
      if (window.L) {
        resolve(window.L);
      } else {
        existing.addEventListener("load", () => resolve(window.L));
        existing.addEventListener("error", (err) => reject(err));
      }
      return;
    }

    // 3. Inject Leaflet JS
    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      if (window.L) {
        resolve(window.L);
      } else {
        reject(new Error("Leaflet loaded but window.L is undefined"));
      }
    };
    script.onerror = (err) => {
      leafletPromise = null;
      reject(err);
    };
    document.head.appendChild(script);
  });

  return leafletPromise;
}

