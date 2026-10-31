import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Search, Crosshair, MapPin, X, Loader2 } from "lucide-react";
import { loadLeaflet } from "@/lib/leafletLoader";
import {
  type LocationResult,
  reverseGeocode,
  searchPlaces,
  getBrowserCurrentLocation,
  hasLiveGeoapifyKey,
} from "@/lib/rideGeocoding";

interface RideMapPickerProps {
  mode: "pickup" | "destination";
  initialCoords?: { lat: number; lng: number };
  initialAddress?: string;
  ur: boolean;
  onConfirm: (loc: LocationResult) => void;
  onBack: () => void;
}

export function RideMapPicker({
  mode,
  initialCoords = { lat: 24.9328, lng: 67.113 },
  initialAddress,
  ur,
  onConfirm,
  onBack,
}: RideMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  const [loadingMap, setLoadingMap] = useState(true);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [selectedLoc, setSelectedLoc] = useState<LocationResult>({
    id: "selected-map-point",
    name: initialAddress || (mode === "pickup" ? "University Road, Karachi" : "Destination"),
    address: initialAddress || "Near NED University, Karachi",
    lat: initialCoords.lat,
    lng: initialCoords.lng,
  });

  // Debounced search logic
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const abortController = new AbortController();
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchPlaces(
          searchQuery,
          { lat: selectedLoc.lat, lng: selectedLoc.lng },
          abortController.signal,
        );
        setSearchResults(results);
        setShowResults(results.length > 0);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          console.error(e);
        }
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [searchQuery, selectedLoc.lat, selectedLoc.lng]);

  // Initialize Leaflet Map
  useEffect(() => {
    let active = true;

    loadLeaflet()
      .then((L) => {
        if (!active || !mapContainerRef.current) return;
        if (mapInstanceRef.current) return;

        // Create Leaflet map instance
        const map = L.map(mapContainerRef.current, {
          center: [initialCoords.lat, initialCoords.lng],
          zoom: 16,
          zoomControl: false,
          attributionControl: true,
        });

        // Esri World Dark Gray Base tiles (crisp dark slate map, no API key required)
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
          attribution: '&copy; <a href="https://www.esri.com" target="_blank" rel="noreferrer">Esri</a> &copy; OpenStreetMap contributors',
          maxZoom: 16,
        }).addTo(map);

        // Reverse-geocode on pan/drag stop
        map.on("moveend", async () => {
          const center = map.getCenter();
          try {
            const geo = await reverseGeocode(center.lat, center.lng);
            if (active) {
              setSelectedLoc({
                id: `loc-${Date.now()}`,
                name: geo.name,
                address: geo.address,
                lat: center.lat,
                lng: center.lng,
              });
            }
          } catch (err) {
            console.error("Reverse geocoding error:", err);
          }
        });

        // Allow click to recenter
        map.on("click", (e: any) => {
          map.panTo(e.latlng, { animate: true });
        });

        mapInstanceRef.current = map;
        setLoadingMap(false);

        // Trigger resize after DOM render to ensure tile containment
        setTimeout(() => {
          if (active && mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 150);
      })
      .catch((err) => {
        console.error("Failed to load Leaflet:", err);
        setLoadingMap(false);
      });

    return () => {
      active = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initialCoords.lat, initialCoords.lng]);

  // Pan to user's real browser geolocation
  const handleUseCurrentLocation = async () => {
    setLocationError(null);
    setLocating(true);

    try {
      const pos = await getBrowserCurrentLocation();
      if (!mapInstanceRef.current || typeof window === "undefined" || !window.L) {
        setLocating(false);
        return;
      }

      const map = mapInstanceRef.current;
      const L = window.L;

      // Pan map smoothly to real coordinates
      map.setView([pos.lat, pos.lng], 16, { animate: true });

      // Add/update blue current location marker with pulsing circle
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([pos.lat, pos.lng]);
      } else {
        const blueIcon = L.divIcon({
          className: "custom-user-marker",
          html: `<div style="width:18px;height:18px;background:#2563eb;border:3px solid #ffffff;border-radius:50%;box-shadow:0 0 12px #3b82f6;"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });
        userMarkerRef.current = L.marker([pos.lat, pos.lng], { icon: blueIcon }).addTo(map);
      }

      const geo = await reverseGeocode(pos.lat, pos.lng);
      setSelectedLoc({
        id: "gps-location",
        name: geo.name,
        address: geo.address,
        lat: pos.lat,
        lng: pos.lng,
      });
    } catch (err: any) {
      setLocationError(err.message || "Could not retrieve location.");
    } finally {
      setLocating(false);
    }
  };

  const handleSelectSearchResult = (res: LocationResult) => {
    setSelectedLoc(res);
    setSearchQuery(res.name);
    setShowResults(false);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([res.lat, res.lng], 16, { animate: true });
    }
  };

  return (
    <div
      className="relative flex flex-col h-full w-full bg-[#1C1C1C] text-white overflow-hidden select-none"
      data-no-drag="true"
    >
      <style>{`
        .leaflet-control-attribution {
          background: rgba(24, 24, 27, 0.75) !important;
          color: #71717a !important;
          font-size: 8px !important;
          padding: 1px 4px !important;
          border-radius: 4px !important;
          margin: 0 4px 4px 0 !important;
        }
        .leaflet-control-attribution a {
          color: #a1a1aa !important;
          text-decoration: none !important;
        }
      `}</style>

      {/* Top Header Bar */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2.5 bg-[#18181b] border-b border-zinc-800 z-40">
        <button
          type="button"
          onClick={onBack}
          aria-label={ur ? "واپس" : "Back"}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xs sm:text-sm font-bold text-white text-center flex-1">
          {ur ? "نقشے پر مقام منتخب کریں" : "Choose location on map"}
        </h2>
        <span className="w-8" />
      </div>

      {/* Floating Search Bar */}
      <div className="absolute top-13 inset-x-3 z-40 space-y-1">
        <div className="relative flex items-center rounded-xl bg-[#18181b]/95 backdrop-blur-md border border-zinc-700/80 shadow-xl px-3 py-1.5">
          <Search className="h-4 w-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={ur ? "علاقہ یا جگہ تلاش کریں…" : "Search an area or place"}
            className="flex-1 bg-transparent px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
          {isSearching ? (
            <Loader2 className="h-4 w-4 text-emerald-400 animate-spin shrink-0" />
          ) : searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setShowResults(false);
              }}
              className="text-zinc-400 hover:text-white p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>

        {/* Autocomplete Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="max-h-48 overflow-y-auto rounded-xl bg-[#18181b] border border-zinc-700 shadow-2xl divide-y divide-zinc-800">
            {!hasLiveGeoapifyKey() && (
              <div className="px-3 py-1 bg-zinc-900/90 text-[9px] font-semibold text-emerald-400 border-b border-zinc-800">
                {ur ? "مشق مقامات (ڈیمو موڈ)" : "Practice locations (Demo mode)"}
              </div>
            )}
            {searchResults.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectSearchResult(item)}
                className="w-full flex items-start gap-2.5 p-2.5 text-start hover:bg-zinc-800/80 transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white leading-tight break-words">{item.name}</p>
                  <p className="text-[10px] text-zinc-400 leading-tight mt-0.5 break-words">{item.address}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Leaflet Map Container */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden isolate" data-no-drag="true">
        <div ref={mapContainerRef} className="h-full w-full bg-[#1c1c1c] isolate" />

        {loadingMap && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c1c1c] text-zinc-400 z-10 gap-2">
            <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
            <span className="text-xs">{ur ? "نقشہ لوڈ ہو رہا ہے…" : "Loading map…"}</span>
          </div>
        )}

        {/* Center Pin Indicator (Visual Focal Point with halo aura) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-30 pb-12">
          <div className="relative flex items-center justify-center">
            {/* Green halo aura around touch point */}
            <div className="absolute h-18 w-18 rounded-full bg-emerald-500/25 border border-emerald-400/40 animate-pulse" />
            {/* Teardrop green map pin with white dot */}
            <div className="relative flex flex-col items-center drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 border-2 border-white text-zinc-950 shadow-xl">
                <div className="h-3 w-3 rounded-full bg-white" />
              </div>
              <div className="w-0.5 h-3.5 bg-white" />
            </div>
          </div>
        </div>

        {/* Floating Current Location (GPS) Control Button */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={locating}
          aria-label={ur ? "میرا موجودہ مقام" : "Use current location"}
          className="absolute bottom-4 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[#18181b]/95 backdrop-blur-md border border-zinc-700 text-white shadow-xl hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
        >
          {locating ? (
            <Loader2 className="h-4 w-4 text-emerald-400 animate-spin" />
          ) : (
            <Crosshair className="h-4 w-4 text-emerald-400" />
          )}
        </button>

        {/* Location Error Toast / Alert */}
        {locationError && (
          <div className="absolute bottom-16 inset-x-3 z-40 rounded-xl bg-destructive/90 backdrop-blur-md p-2.5 text-xs text-destructive-foreground shadow-xl flex items-center justify-between">
            <span className="flex-1 pr-2">{locationError}</span>
            <button type="button" onClick={() => setLocationError(null)} className="p-0.5">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Sheet: Location Confirmation */}
      <div className="shrink-0 bg-[#18181b] border-t border-zinc-800 rounded-t-3xl px-3.5 pt-3 pb-3.5 shadow-2xl z-40 space-y-2.5">
        <div className="flex items-start gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
            <MapPin className="h-4 w-4" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[9.5px] font-semibold text-zinc-400 uppercase tracking-wider">
              {mode === "pickup"
                ? ur
                  ? "منتخب سواری کی جگہ"
                  : "Selected pickup"
                : ur
                  ? "منتخب منزل"
                  : "Selected destination"}
            </p>
            <p className="text-xs sm:text-sm font-bold text-white break-words line-clamp-1">{selectedLoc.name}</p>
            <p className="text-[10px] text-zinc-400 break-words line-clamp-1">{selectedLoc.address}</p>
          </div>
        </div>

        {/* Confirm Location Button */}
        <button
          type="button"
          onClick={() => onConfirm(selectedLoc)}
          className="w-full flex items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm py-2.5 sm:py-3 shadow-lg active:scale-98 transition-all cursor-pointer"
        >
          {ur ? "مقام کی تصدیق کریں" : "Confirm location"}
        </button>
      </div>
    </div>
  );
}
