/**
 * Geocoding, reverse geocoding, and browser geolocation service
 * for the TechSaathi Ride Booking module.
 */

export interface LocationResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: string;
}

/** Check if Geoapify API key is present in environment */
export function hasLiveGeoapifyKey(): boolean {
  return Boolean(import.meta.env.VITE_GEOAPIFY_API_KEY);
}

export const CURATED_LOCATIONS: LocationResult[] = [
  {
    id: "ned-gate",
    name: "NED Visitor Gate",
    address: "Main University Road, NED University Of Engineering & Technology, Karachi",
    lat: 24.9328,
    lng: 67.113,
    distance: "2.5 km",
  },
  {
    id: "ned-main",
    name: "NED University Of Engineering & Technology",
    address: "Karachi",
    lat: 24.932,
    lng: 67.114,
    distance: "2.8 km",
  },
  {
    id: "pob-hospital",
    name: "POB Eye Hospital Karachi",
    address: "Munawar Chowrangi Rd, Block 12 Gulistan-e-Johar, Karachi",
    lat: 24.9245,
    lng: 67.126,
    distance: "600 m",
  },
  {
    id: "street-22",
    name: "Street 22",
    address: "Karachi",
    lat: 24.9315,
    lng: 67.112,
  },
  {
    id: "city-hospital",
    name: "City Hospital Saddar",
    address: "Saddar, Karachi",
    lat: 24.8607,
    lng: 67.0104,
    distance: "12 km",
  },
  {
    id: "airport",
    name: "Jinnah International Airport",
    address: "Airport Road, Karachi",
    lat: 24.9065,
    lng: 67.1608,
    distance: "8 km",
  },
  {
    id: "lucky-one",
    name: "Lucky One Mall",
    address: "Rashid Minhas Rd, Karachi",
    lat: 24.9365,
    lng: 67.0863,
    distance: "4.2 km",
  },
  {
    id: "dolmen-clifton",
    name: "Dolmen Mall Clifton",
    address: "Block 4 Clifton, Karachi",
    lat: 24.8197,
    lng: 67.0312,
    distance: "15 km",
  },
];

/** Request user's real browser geolocation */
export function getBrowserCurrentLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(new Error("Browser geolocation is not supported on this device."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        let msg = "Location request failed.";
        if (err.code === err.PERMISSION_DENIED) {
          msg = "Location permission was denied. You can select your pickup manually on the map.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = "Current location is temporarily unavailable.";
        } else if (err.code === err.TIMEOUT) {
          msg = "Location request timed out. Please select location manually.";
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    );
  });
}

/** Search places via Geoapify or fallback search */
export async function searchPlaces(
  query: string,
  userCoords?: { lat: number; lng: number },
  signal?: AbortSignal,
): Promise<LocationResult[]> {
  const q = query.trim();
  if (q.length < 3) return [];

  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

  if (apiKey) {
    try {
      const bias = userCoords
        ? `&bias=proximity:${userCoords.lng},${userCoords.lat}`
        : "&bias=proximity:67.1147,24.9317";
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        q,
      )}&apiKey=${apiKey}&limit=5${bias}`;

      const res = await fetch(url, { signal });
      if (res.ok) {
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          return data.features.map((f: any, idx: number) => {
            const props = f.properties || {};
            return {
              id: `geo-${idx}-${props.place_id || f.id || idx}`,
              name: props.name || props.street || props.address_line1 || q,
              address: props.formatted || `${props.city || ""}, ${props.country || ""}`,
              lat: f.geometry.coordinates[1],
              lng: f.geometry.coordinates[0],
            };
          });
        }
      }
    } catch (e: any) {
      if (e.name === "AbortError") throw e;
      console.warn("Geoapify search error, falling back to local lookup:", e);
    }
  }

  // Local fallback search against curated places
  const lower = q.toLowerCase();
  return CURATED_LOCATIONS.filter(
    (l) => l.name.toLowerCase().includes(lower) || l.address.toLowerCase().includes(lower),
  );
}

/** Reverse geocode coordinates to readable address */
export async function reverseGeocode(lat: number, lng: number): Promise<{ name: string; address: string }> {
  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

  if (apiKey) {
    try {
      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          const props = data.features[0].properties || {};
          return {
            name: props.name || props.street || props.address_line1 || "Selected location",
            address: props.formatted || `${props.city || "Karachi"}, ${props.country || "Pakistan"}`,
          };
        }
      }
    } catch (e) {
      console.warn("Geoapify reverse geocoding failed, using fallback:", e);
    }
  }

  // Find nearest curated landmark or formatted coordinates
  let closest = CURATED_LOCATIONS[0];
  let minDistance = Number.POSITIVE_INFINITY;

  for (const loc of CURATED_LOCATIONS) {
    const d = Math.hypot(loc.lat - lat, loc.lng - lng);
    if (d < minDistance) {
      minDistance = d;
      closest = loc;
    }
  }

  if (minDistance < 0.015) {
    return {
      name: closest.name,
      address: closest.address,
    };
  }

  return {
    name: "Pin Location",
    address: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
  };
}

