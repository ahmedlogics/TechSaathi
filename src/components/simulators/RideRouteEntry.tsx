import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  User,
  Search,
  MapPin,
  Clock,
  Crosshair,
  Map,
  X,
  Loader2,
  CheckCircle2,
  Navigation,
} from "lucide-react";
import {
  type LocationResult,
  CURATED_LOCATIONS,
  searchPlaces,
  getBrowserCurrentLocation,
  reverseGeocode,
  hasLiveGeoapifyKey,
} from "@/lib/rideGeocoding";
import { SimButton, useLesson } from "@/components/learning/LessonContext";
import { cn } from "@/lib/utils";

interface RideRouteEntryProps {
  ur: boolean;
  pickup: LocationResult;
  dest: LocationResult | null;
  onSelectPickup: (loc: LocationResult) => void;
  onSelectDest: (loc: LocationResult) => void;
  onOpenMapPicker: (mode: "pickup" | "destination") => void;
  onBack: () => void;
  onContinue: () => void;
}

export function RideRouteEntry({
  ur,
  pickup,
  dest,
  onSelectPickup,
  onSelectDest,
  onOpenMapPicker,
  onBack,
  onContinue,
}: RideRouteEntryProps) {
  const { engine, isTarget } = useLesson();
  const screen = engine.step.screen;

  const [toInput, setToInput] = useState(dest ? dest.name : "");
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFromMenu, setShowFromMenu] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Sync toInput if dest changes externally (e.g. from map picker)
  useEffect(() => {
    if (dest) {
      setToInput(dest.name);
    }
  }, [dest]);

  // Debounced destination autocomplete
  useEffect(() => {
    if (toInput.trim().length < 3 || (dest && toInput === dest.name)) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const abortController = new AbortController();
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchPlaces(
          toInput,
          { lat: pickup.lat, lng: pickup.lng },
          abortController.signal,
        );
        setSearchResults(results);
        setShowResults(results.length > 0);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [toInput, dest, pickup.lat, pickup.lng]);

  // Handle "Use my current location" via real browser geolocation
  const handleUseCurrentLocation = async () => {
    setShowFromMenu(false);
    setGeoError(null);
    setLocating(true);

    try {
      const pos = await getBrowserCurrentLocation();
      const geo = await reverseGeocode(pos.lat, pos.lng);
      const userLoc: LocationResult = {
        id: "current-user-location",
        name: geo.name,
        address: geo.address,
        lat: pos.lat,
        lng: pos.lng,
      };
      onSelectPickup(userLoc);

      // Advance lesson if waiting for pickup
      if (screen === "pickup") {
        engine.act("pickup-continue");
      }
    } catch (err: any) {
      setGeoError(err.message || "Failed to get current location.");
    } finally {
      setLocating(false);
    }
  };

  const handleSelectRecent = (loc: LocationResult) => {
    onSelectDest(loc);
    setToInput(loc.name);
    setShowResults(false);

    // If lesson is at destination step, advance or validate
    if (screen === "destination") {
      engine.act("dest-continue");
    }
  };

  const isPickupTarget = screen === "pickup" && isTarget("pickup-continue");
  const isDestTarget = screen === "destination" && isTarget("dest-continue");

  return (
    <div className="relative flex flex-col min-h-full bg-[#1C1C1C] text-white">
      {/* Sticky Header Bar */}
      <div className="sticky top-0 z-30 shrink-0 flex items-center justify-between px-3 py-2.5 bg-[#18181b] border-b border-zinc-800">
        <button
          type="button"
          onClick={onBack}
          aria-label={ur ? "واپس" : "Back"}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xs sm:text-sm font-bold text-white text-center flex-1 whitespace-nowrap truncate px-1">
          {ur ? "اپنا راستہ درج کریں" : "Enter your route"}
        </h2>
        <span className="w-8" />
      </div>

      <div className="flex-1 flex flex-col p-2.5 sm:p-3 space-y-2.5">
        {/* FROM Field Card */}
        <div className="relative">
          <div
            onClick={() => setShowFromMenu((v) => !v)}
            className={cn(
              "flex items-center justify-between rounded-2xl bg-[#252525] hover:bg-[#2a2a2a] border border-white/5 p-2.5 transition-colors cursor-pointer select-none",
              isPickupTarget && "sim-target",
            )}
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
                <User className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] sm:text-[11px] font-medium text-zinc-400 leading-tight">
                  {ur ? "کہاں سے" : "From"}
                </span>
                <p className="text-xs sm:text-[13px] font-bold text-white leading-tight mt-0.5 break-words line-clamp-1">
                  {pickup.name}
                </p>
                <p className="text-[10px] text-zinc-400 leading-tight mt-0.5 break-words line-clamp-1">{pickup.address}</p>
              </div>
            </div>

            {/* Quick "My location" button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleUseCurrentLocation();
              }}
              disabled={locating}
              aria-label={ur ? "میرا مقام" : "Use my location"}
              className="flex flex-col items-center gap-1 shrink-0 ml-1.5 cursor-pointer group"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/25 group-hover:border-emerald-500/50 transition-colors">
                {locating ? (
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                ) : (
                  <Crosshair className="h-4 w-4 text-emerald-400" />
                )}
              </span>
              <span className="text-[8px] sm:text-[8.5px] font-medium text-emerald-400 whitespace-nowrap leading-none">
                {ur ? "میرا مقام" : "Use my location"}
              </span>
            </button>
          </div>

          {/* Popup Menu when FROM is tapped */}
          {showFromMenu && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-40 rounded-2xl bg-[#18181b] border border-zinc-700 shadow-2xl p-1.5 divide-y divide-zinc-800 animate-in fade-in zoom-in-95">
              {/* Option 1: Use my current location */}
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-800 text-start transition-colors"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Navigation className="h-4 w-4 -rotate-45" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">
                    {ur ? "میرا موجودہ مقام استعمال کریں" : "Use my current location"}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    {ur ? "براؤزر سے GPS کوارڈینیٹس حاصل کریں" : "Real browser geolocation GPS"}
                  </p>
                </div>
              </button>

              {/* Option 2: Choose on map */}
              <button
                type="button"
                onClick={() => {
                  setShowFromMenu(false);
                  onOpenMapPicker("pickup");
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-800 text-start transition-colors"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 shrink-0">
                  <Map className="h-4 w-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">
                    {ur ? "نقشے پر منتخب کریں" : "Choose on map"}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    {ur ? "انٹرایکٹو نقشے پر پن رکھیں" : "Pin your pickup on Leaflet map"}
                  </p>
                </div>
              </button>

              {/* Option 3: Keep Street 22 / preset */}
              <button
                type="button"
                onClick={() => {
                  setShowFromMenu(false);
                  onSelectPickup(CURATED_LOCATIONS.find((l) => l.id === "street-22")!);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-800 text-start transition-colors"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 shrink-0">
                  <MapPin className="h-4 w-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">Street 22, Karachi</p>
                  <p className="text-[10px] text-zinc-400">Practice preset address</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Location Error alert if geolocation fails */}
        {geoError && (
          <div className="rounded-xl bg-destructive/80 p-2.5 text-xs text-white flex items-center justify-between">
            <span className="flex-1 pr-2">{geoError}</span>
            <button type="button" onClick={() => setGeoError(null)}>
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* TO Field Card with Search and Map Icon */}
        <div ref={searchBoxRef} className="relative">
          <div
            className={cn(
              "flex items-center justify-between rounded-2xl bg-[#252525] border border-white/5 p-2.5 transition-colors",
              isDestTarget && "sim-target",
            )}
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
                <Search className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] sm:text-[11px] font-medium text-zinc-400 leading-tight">
                  {ur ? "کہاں جانا ہے" : "To"}
                </span>
                <input
                  type="text"
                  value={toInput}
                  onChange={(e) => {
                    setToInput(e.target.value);
                  }}
                  placeholder={ur ? "آپ کہاں جا رہے ہیں؟" : "Where are you going?"}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-white placeholder-zinc-500 focus:outline-none truncate mt-0.5"
                />
              </div>
            </div>

            {/* Map-pin Icon Button (Opens Choose Location on Map) */}
            <button
              type="button"
              onClick={() => onOpenMapPicker("destination")}
              aria-label={ur ? "نقشے پر منتخب کریں" : "Select destination on map"}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#2a303c] border border-blue-500/25 hover:bg-[#323946] text-blue-400 transition-colors shrink-0 ml-1.5 shadow-xs cursor-pointer"
            >
              <MapPin className="h-4 w-4 fill-blue-400 text-blue-400" />
            </button>
          </div>

          {/* Autocomplete Results for TO field */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-40 max-h-48 overflow-y-auto rounded-2xl bg-[#18181b] border border-zinc-700 shadow-2xl divide-y divide-zinc-800">
              {!hasLiveGeoapifyKey() && (
                <div className="px-3 py-1 bg-zinc-900/90 text-[9px] font-semibold text-emerald-400 border-b border-zinc-800 flex items-center justify-between">
                  <span>{ur ? "مشق مقامات (ڈیمو موڈ)" : "Practice locations (Demo mode)"}</span>
                </div>
              )}
              {searchResults.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelectRecent(loc)}
                  className="w-full flex items-start gap-2.5 p-2.5 text-start hover:bg-zinc-800 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white leading-tight break-words">{loc.name}</p>
                    <p className="text-[10px] text-zinc-400 leading-tight mt-0.5 break-words">{loc.address}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recent Destinations List (Exact from reference) */}
        <div className="space-y-1 pt-0.5 flex-1">
          <p className="text-xs font-semibold text-zinc-400 px-1 mb-1">
            {ur ? "حالیہ منزلیں" : "Recent destinations"}
          </p>

          <div className="divide-y divide-zinc-800/80 rounded-2xl bg-[#242424]/50 border border-white/5">
            {/* 1. NED Visitor Gate */}
            {CURATED_LOCATIONS.slice(0, 3).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectRecent(item)}
                className={cn(
                  "w-full flex items-center justify-between p-2.5 text-start hover:bg-zinc-800/60 transition-colors cursor-pointer group",
                  dest?.id === item.id && "bg-emerald-500/10",
                )}
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-1.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 transition-colors mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-[13px] font-bold text-white leading-snug break-words">
                      {item.name}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-tight mt-0.5 break-words line-clamp-2">
                      {item.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-0.5">
                  {item.distance && (
                    <span className="text-[10.5px] font-semibold text-zinc-400 whitespace-nowrap">
                      {item.distance}
                    </span>
                  )}
                  {dest?.id === item.id && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 ml-1" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button (active when both FROM and TO are set) */}
        <div className="pt-1.5 pb-1">
          {dest ? (
            <button
              type="button"
              onClick={onContinue}
              className="w-full flex items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm py-2.5 sm:py-3 shadow-lg active:scale-98 transition-all cursor-pointer"
            >
              {ur ? "آگے بڑھیں" : "Continue"}
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full flex items-center justify-center rounded-xl sm:rounded-2xl bg-zinc-800 text-zinc-500 font-semibold text-xs sm:text-sm py-2.5 sm:py-3 cursor-not-allowed"
            >
              {ur ? "منزل منتخب کریں" : "Select a destination to continue"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
