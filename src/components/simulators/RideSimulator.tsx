import { useState, useEffect } from "react";
import {
  Car,
  MapPin,
  Navigation,
  Search,
  CheckCircle2,
  UserRound,
  ShieldAlert,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Banknote,
  Menu,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CompletionActions, SimButton, useLesson } from "@/components/learning/LessonContext";
import { PhoneFrame } from "@/components/learning/PhoneFrame";
import { formatRs, practiceFare, rideDriver, rideLocations, rideTypes } from "@/data/scenarios";
import { cn } from "@/lib/utils";
import { CURATED_LOCATIONS, type LocationResult } from "@/lib/rideGeocoding";
import { RideRouteEntry } from "./RideRouteEntry";
import { RideMapPicker } from "./RideMapPicker";

/** Dark-themed map around NED University, Karachi for the modern ride-hailing start screen */
function StartScreenDarkMap({ ur }: { ur: boolean }) {
  return (
    <div className="relative w-full h-[225px] sm:h-[240px] shrink-0 overflow-hidden bg-[#0c1420] select-none">
      {/* Top Floating Hamburger Menu */}
      <button
        type="button"
        aria-label="Menu"
        className="absolute top-2.5 left-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#18181b]/80 backdrop-blur-md border border-white/10 text-white shadow-lg hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Floating Pickup Point Pill (comfortably below status bar & dynamic island) */}
      <div className="absolute top-8 sm:top-9 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-xl bg-[#18181b]/95 backdrop-blur-md border border-zinc-700/60 px-3 py-1.5 shadow-xl cursor-pointer hover:border-emerald-500/50 transition-colors">
        <div className="text-start">
          <p className="text-[9px] font-semibold text-zinc-400 leading-tight">
            {ur ? "سوار ہونے کا مقام" : "Pickup point"}
          </p>
          <p className="text-xs font-bold text-white leading-tight mt-0.5">
            {ur ? "اسٹریٹ 2" : "Street 2"}
          </p>
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
      </div>

      {/* Bottom Floating Navigation / Compass Button */}
      <button
        type="button"
        aria-label="Current location"
        className="absolute bottom-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#18181b]/80 backdrop-blur-md border border-white/10 text-white shadow-lg hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        <Navigation className="h-3.5 w-3.5 fill-white text-white -rotate-45" />
      </button>

      {/* SVG Map Illustration */}
      <svg viewBox="0 0 320 220" className="h-full w-full object-cover" preserveAspectRatio="none">
        {/* Deep dark slate background */}
        <rect width="320" height="220" fill="#0d1522" />

        {/* City parcels & blocks */}
        <path d="M8 12 H88 V60 H8 Z" fill="#172132" />
        <path d="M195 8 H312 V68 H195 Z" fill="#172132" />
        <path d="M12 135 H95 V210 H12 Z" fill="#172132" />
        <path d="M205 140 H310 V210 H205 Z" fill="#172132" />

        {/* NED Campus Greenery */}
        <path d="M100 8 H168 V48 H100 Z" fill="#122a21" />
        <path d="M20 72 H65 V115 H20 Z" fill="#13261e" />

        {/* Secondary connecting streets */}
        <path d="M0 68 H135 M165 145 H320" stroke="#1c2738" strokeWidth="8" fill="none" />

        {/* Street 3 */}
        <path d="M220 -10 L315 180" stroke="#222e40" strokeWidth="13" fill="none" />

        {/* Street 2 */}
        <path d="M60 -10 L195 230" stroke="#27364b" strokeWidth="15" fill="none" />
        <path d="M60 -10 L195 230" stroke="#3b4b63" strokeWidth="1.2" strokeDasharray="5 4" fill="none" />

        {/* Main Diagonal University Road */}
        <path d="M-20 185 Q 140 100, 340 15" stroke="#2c3a50" strokeWidth="21" fill="none" />
        <path d="M-20 185 Q 140 100, 340 15" stroke="#4a5d78" strokeWidth="2" strokeDasharray="7 5" fill="none" />

        {/* Crisp Road Labels */}
        <text x="50" y="122" fill="#8899ac" fontSize="8.5" fontWeight="600" transform="rotate(-26, 50, 122)" letterSpacing="0.5">
          University Rd
        </text>
        <text x="148" y="58" fill="#8899ac" fontSize="8" fontWeight="600" transform="rotate(62, 148, 58)" letterSpacing="0.5">
          Street 2
        </text>
        <text x="256" y="78" fill="#8899ac" fontSize="8" fontWeight="600" transform="rotate(62, 256, 78)" letterSpacing="0.5">
          Street 3
        </text>

        {/* Cars on the roads */}
        {/* Car 1: University Rd */}
        <g transform="translate(75, 145) rotate(-26) translate(-12, -6)">
          <rect x="0" y="0" width="24" height="12" rx="3.5" fill="#ffffff" />
          <rect x="5" y="2" width="5" height="8" rx="1.5" fill="#1e293b" />
          <rect x="14" y="2" width="5" height="8" rx="1.5" fill="#1e293b" />
          <rect x="10" y="2.5" width="4" height="7" fill="#e2e8f0" />
          <path d="M0 4.5 Q 12 6, 24 4.5" stroke="#10b981" strokeWidth="1" fill="none" />
          <circle cx="23" cy="2" r="1" fill="#38bdf8" />
          <circle cx="23" cy="10" r="1" fill="#38bdf8" />
        </g>

        {/* Car 2: Street 2 Upper */}
        <g transform="translate(105, 52) rotate(62) translate(-12, -6)">
          <rect x="0" y="0" width="24" height="12" rx="3.5" fill="#ffffff" />
          <rect x="5" y="2" width="5" height="8" rx="1.5" fill="#1e293b" />
          <rect x="14" y="2" width="5" height="8" rx="1.5" fill="#1e293b" />
          <rect x="10" y="2.5" width="4" height="7" fill="#e2e8f0" />
          <circle cx="23" cy="2" r="1" fill="#38bdf8" />
          <circle cx="23" cy="10" r="1" fill="#38bdf8" />
        </g>

        {/* Car 3: Street 2 Lower */}
        <g transform="translate(165, 160) rotate(62) translate(-12, -6)">
          <rect x="0" y="0" width="24" height="12" rx="3.5" fill="#ffffff" />
          <rect x="5" y="2" width="5" height="8" rx="1.5" fill="#1e293b" />
          <rect x="14" y="2" width="5" height="8" rx="1.5" fill="#1e293b" />
          <rect x="10" y="2.5" width="4" height="7" fill="#e2e8f0" />
          <circle cx="23" cy="2" r="1" fill="#38bdf8" />
          <circle cx="23" cy="10" r="1" fill="#38bdf8" />
        </g>

        {/* Car 4: University Rd Upper */}
        <g transform="translate(250, 52) rotate(-26) translate(-12, -6)">
          <rect x="0" y="0" width="24" height="12" rx="3.5" fill="#ffffff" />
          <rect x="5" y="2" width="5" height="8" rx="1.5" fill="#1e293b" />
          <rect x="14" y="2" width="5" height="8" rx="1.5" fill="#1e293b" />
          <rect x="10" y="2.5" width="4" height="7" fill="#e2e8f0" />
          <circle cx="23" cy="2" r="1" fill="#38bdf8" />
          <circle cx="23" cy="10" r="1" fill="#38bdf8" />
        </g>

        {/* Pickup Location Marker (Green Pin on Street 2 directly beneath the pill) */}
        <g transform="translate(130, 96)">
          <circle cx="0" cy="0" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
        </g>

        {/* Current Location Marker (Pulsating Blue Dot) */}
        <g transform="translate(130, 132)">
          <circle cx="0" cy="0" r="15" fill="#3b82f6" opacity="0.25" className="animate-pulse" />
          <circle cx="0" cy="0" r="7.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
}

function CompactSimulatorHeader({
  title,
  ur,
  onBack,
}: {
  title: string;
  ur: boolean;
  onBack?: () => void;
}) {
  return (
    <div className="shrink-0 flex items-center justify-between px-2.5 py-1.5 bg-primary text-primary-foreground min-h-[32px] border-b border-primary-strong z-30">
      <div className="flex items-center gap-1 min-w-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label={ur ? "واپس" : "Back"}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full hover:bg-primary-strong transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        )}
        <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap">{title}</span>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-1.5 py-0.5 text-[8px] sm:text-[8.5px] font-bold text-warning shrink-0 leading-none">
        <ShieldCheck className="h-2.5 w-2.5" />
        <span>{ur ? "صرف مشق" : "Practice"}</span>
      </span>
    </div>
  );
}

/** 4 Service Cards in 2x2 grid */
function ServiceCardsGrid({ ur, onSelect }: { ur: boolean; onSelect?: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 px-2.5 pt-2">
      {/* CARD 1: City Rides */}
      <button
        type="button"
        onClick={onSelect}
        className="group relative flex flex-col justify-between rounded-xl bg-gradient-to-br from-[#1b3d33] via-[#122c24] to-[#0c1f19] border border-emerald-500/25 p-2 h-[72px] sm:h-[78px] overflow-hidden text-start shadow-sm hover:border-emerald-400/50 transition-all cursor-pointer select-none"
      >
        <span className="text-[11px] sm:text-xs font-bold text-white z-10 leading-none">
          {ur ? "شہری سفر" : "City Rides"}
        </span>

        {/* City Rides Illustration */}
        <svg viewBox="0 0 100 45" className="w-full h-9 self-end object-contain" preserveAspectRatio="xMidYMax meet">
          {/* Skyline silhouette */}
          <path d="M5 25 H20 V12 H5 Z M25 25 H40 V6 H25 Z M45 25 H60 V16 H45 Z" fill="#164337" opacity="0.75" />
          {/* White Sedan */}
          <path
            d="M10 32 C13 25, 24 24, 32 21 L46 14 C52 11, 68 11, 74 16 L84 22 C90 24, 94 27, 95 31 C95 33, 92 34, 88 34 H13 C11 34, 10 33, 10 32 Z"
            fill="#ffffff"
          />
          {/* Windows */}
          <path d="M35 20 L47 15 C51 13, 66 13, 72 17 L80 21 Z" fill="#1e293b" />
          <path d="M56 14 V21 M68 15 V21" stroke="#ffffff" strokeWidth="1" />
          {/* Green side wave */}
          <path d="M32 27 Q 56 24, 85 27 L83 30 Q 56 27, 30 29 Z" fill="#10b981" />
          {/* Wheels */}
          <circle cx="26" cy="32" r="5.5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="26" cy="32" r="2" fill="#94a3b8" />
          <circle cx="75" cy="32" r="5.5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="75" cy="32" r="2" fill="#94a3b8" />
        </svg>
      </button>

      {/* CARD 2: City to City */}
      <button
        type="button"
        onClick={onSelect}
        className="group relative flex flex-col justify-between rounded-xl bg-[#242424] hover:bg-[#2a2a2a] border border-white/5 p-2 h-[72px] sm:h-[78px] overflow-hidden text-start shadow-sm transition-all cursor-pointer select-none"
      >
        <span className="text-[11px] sm:text-xs font-bold text-white z-10 leading-none">
          {ur ? "شہر بہ شہر" : "City to City"}
        </span>

        {/* City to City Illustration */}
        <svg viewBox="0 0 100 45" className="w-full h-9 self-end object-contain" preserveAspectRatio="xMidYMax meet">
          {/* Green winding road / landscape */}
          <path d="M0 38 Q 30 25, 60 30 T 100 20 L 100 45 L 0 45 Z" fill="#10b981" opacity="0.85" />
          <path d="M30 35 Q 55 25, 80 23" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
          {/* White car driving */}
          <g transform="translate(18, 22) scale(0.62)">
            <path d="M6 18 C8 13, 16 12, 22 10 L32 5 C36 3, 46 3, 50 6 L58 11 C62 13, 65 15, 65 18 H6 Z" fill="#ffffff" />
            <path d="M24 10 L33 6 C36 5, 45 5, 48 7 L54 11 Z" fill="#1e293b" />
            <circle cx="16" cy="18" r="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="52" cy="18" r="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
          </g>
          {/* Destination Pin on hill */}
          <g transform="translate(85, 12)">
            <path d="M0 0 C-3 -3, -3 -7, 0 -10 C3 -7, 3 -3, 0 0 Z" fill="#ffffff" />
            <circle cx="0" cy="-6" r="2" fill="#10b981" />
          </g>
        </svg>
      </button>

      {/* CARD 3: Couriers */}
      <button
        type="button"
        onClick={onSelect}
        className="group relative flex flex-col justify-between rounded-xl bg-[#242424] hover:bg-[#2a2a2a] border border-white/5 p-2 h-[72px] sm:h-[78px] overflow-hidden text-start shadow-sm transition-all cursor-pointer select-none"
      >
        <span className="text-[11px] sm:text-xs font-bold text-white z-10 leading-none">
          {ur ? "کورئیر" : "Couriers"}
        </span>

        {/* Couriers Illustration */}
        <svg viewBox="0 0 100 45" className="w-full h-9 self-end object-contain" preserveAspectRatio="xMidYMax meet">
          {/* Cardboard box */}
          <g transform="translate(14, 12)">
            <polygon points="0,10 16,3 32,10 16,17" fill="#d97706" opacity="0.95" />
            <polygon points="0,10 16,17 16,30 0,23" fill="#b45309" />
            <polygon points="16,17 32,10 32,23 16,30" fill="#92400e" />
            <path d="M16 17 L8 13.5 M16 17 L24 13.5" stroke="#fde68a" strokeWidth="1.5" />
            <path d="M8 13.5 V26.5 M24 13.5 V26.5" stroke="#fde68a" strokeWidth="1.5" />
          </g>
          {/* Courier Bag */}
          <g transform="translate(54, 9)">
            <rect x="0" y="4" width="28" height="24" rx="4" fill="#10b981" />
            <path d="M5 4 V1 C5 0, 23 0, 23 1 V4" stroke="#059669" strokeWidth="2" fill="none" />
            <rect x="4" y="9" width="20" height="14" rx="2" fill="#047857" />
            <path d="M7 16 L12 13 L17 19 L21 13" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        </svg>
      </button>

      {/* CARD 4: Groceries */}
      <button
        type="button"
        onClick={onSelect}
        className="group relative flex flex-col justify-between rounded-xl bg-[#242424] hover:bg-[#2a2a2a] border border-white/5 p-2 h-[72px] sm:h-[78px] overflow-hidden text-start shadow-sm transition-all cursor-pointer select-none"
      >
        <span className="text-[11px] sm:text-xs font-bold text-white z-10 leading-none">
          {ur ? "گروسری" : "Groceries"}
        </span>

        {/* Groceries Illustration */}
        <svg viewBox="0 0 100 45" className="w-full h-9 self-end object-contain" preserveAspectRatio="xMidYMax meet">
          <g transform="translate(30, 6)">
            {/* Milk/Drink Bottle */}
            <rect x="22" y="2" width="8" height="18" rx="2" fill="#ffffff" />
            <rect x="23" y="0" width="6" height="3" fill="#38bdf8" />
            {/* Carrots and greens */}
            <path d="M12 4 Q 8 -2, 4 2" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M12 4 Q 14 -3, 16 0" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" fill="none" />
            <polygon points="8,8 14,4 18,14 12,18" fill="#f97316" />
            {/* Tomatoes */}
            <circle cx="2" cy="18" r="6" fill="#ef4444" />
            <circle cx="2" cy="14" r="1.5" fill="#22c55e" />
            {/* Kraft Grocery Bag */}
            <rect x="5" y="10" width="28" height="23" rx="2" fill="#b45309" />
            <path d="M5 10 L8 14 H30 L33 10" fill="#92400e" />
            <rect x="9" y="15" width="20" height="15" fill="#78350f" opacity="0.3" />
          </g>
        </svg>
      </button>
    </div>
  );
}

function RouteMap({
  pickup,
  dest,
  className,
}: {
  pickup?: string | undefined;
  dest?: string | undefined;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-[#eef5f8] flex-1 min-h-[110px] w-full shrink-0 shadow-inner",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 300 200" className="h-full w-full object-cover" preserveAspectRatio="none">
        {/* Soft pastel map background */}
        <rect width="300" height="200" fill="#eef5f8" />
        {/* Land parcels / green park patches */}
        <path d="M10 10 H90 V70 H10 Z M210 15 H290 V85 H210 Z M15 130 H110 V190 H15 Z" fill="#e5f2e9" />
        {/* Secondary roads */}
        <path
          d="M0 45 H300 M0 95 H300 M0 145 H300 M70 0 V200 M150 0 V200 M230 0 V200"
          stroke="#ffffff"
          strokeWidth="10"
        />
        <path
          d="M0 45 H300 M0 95 H300 M0 145 H300 M70 0 V200 M150 0 V200 M230 0 V200"
          stroke="#dbe6ec"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        {/* Diagonal main road */}
        <path d="M-10 190 Q 130 110, 310 25" stroke="#ffffff" strokeWidth="16" fill="none" />
        <path d="M-10 190 Q 130 110, 310 25" stroke="#f2dfa2" strokeWidth="3" fill="none" strokeDasharray="8 6" />

        {/* Route connecting pickup and destination if selected */}
        {pickup && dest ? (
          <path
            d="M65 150 C 120 150, 150 55, 235 50"
            stroke="var(--color-primary)"
            strokeWidth="5"
            fill="none"
            strokeDasharray="8 5"
          />
        ) : (
          /* Default pulsing user location indicator */
          <g transform="translate(150, 105)">
            <circle cx="0" cy="0" r="14" fill="#3b82f6" opacity="0.2" />
            <circle cx="0" cy="0" r="7" fill="#2563eb" />
            <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
          </g>
        )}

        {/* Pickup marker */}
        {pickup && (
          <g transform="translate(65, 150)">
            <circle cx="0" cy="0" r="14" fill="var(--color-primary)" opacity="0.25" />
            <circle cx="0" cy="0" r="7" fill="var(--color-primary)" />
            <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
          </g>
        )}

        {/* Destination marker */}
        {dest && (
          <g transform="translate(235, 50)">
            <circle cx="0" cy="0" r="14" fill="var(--color-destructive)" opacity="0.25" />
            <circle cx="0" cy="0" r="7" fill="var(--color-destructive)" />
            <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
          </g>
        )}
      </svg>

      <span className="absolute bottom-2 end-2 rounded-md bg-card/90 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground shadow-xs backdrop-blur-xs">
        Practice map
      </span>
    </div>
  );
}

export function RideSimulator() {
  const { engine, goSummary, retry } = useLesson();
  const { tr, lang } = useLanguage();
  const ur = lang === "ur";

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__ride_engine = engine;
    }
  }, [engine]);

  // Selected Pickup & Destination Locations
  const defaultPickup =
    CURATED_LOCATIONS.find((l) => l.id === "street-22") || CURATED_LOCATIONS[3]!;
  const [pickupLoc, setPickupLoc] = useState<LocationResult>(defaultPickup);
  const [destLoc, setDestLoc] = useState<LocationResult | null>(null);
  const [mapPickerMode, setMapPickerMode] = useState<"pickup" | "destination" | null>(null);

  const [rideType, setRideType] = useState<string>();
  const screen = engine.step.screen;
  const isHome = screen === "home";
  const isRouteEntry = screen === "pickup" || screen === "destination";
  const isDarkAppScreen = isHome || isRouteEntry || mapPickerMode !== null;

  const fare = rideType
    ? practiceFare(pickupLoc.id, destLoc?.id || "hospital", rideType)
    : 0;

  return (
    <PhoneFrame
      appName={ur ? "سواری" : "Ride"}
      hideHeader={true}
      noPadding={true}
      darkTheme={isDarkAppScreen}
    >
      {/* SCREEN 3: FULL-SCREEN INTERACTIVE MAP PICKER (LEAFLET) */}
      {mapPickerMode !== null ? (
        <RideMapPicker
          mode={mapPickerMode}
          initialCoords={
            mapPickerMode === "pickup"
              ? { lat: pickupLoc.lat, lng: pickupLoc.lng }
              : destLoc
                ? { lat: destLoc.lat, lng: destLoc.lng }
                : { lat: 24.9328, lng: 67.113 }
          }
          initialAddress={mapPickerMode === "pickup" ? pickupLoc.name : destLoc?.name}
          ur={ur}
          onBack={() => setMapPickerMode(null)}
          onConfirm={(loc) => {
            if (mapPickerMode === "pickup") {
              setPickupLoc(loc);
              if (screen === "pickup") {
                engine.act("pickup-continue");
              }
            } else {
              setDestLoc(loc);
              if (screen === "destination") {
                engine.act("dest-continue");
              }
            }
            setMapPickerMode(null);
          }}
        />
      ) : (
        <>
          {/* SCREEN 1: REDESIGNED MODERN PAKISTANI RIDE APP HOME */}
          {screen === "home" && (
            <div className="flex flex-1 flex-col min-h-full bg-[#1C1C1C] text-white">
              {/* Top Section: Interactive Dark Map */}
              <StartScreenDarkMap ur={ur} />

              {/* Middle Section: 4 Service Cards (2x2 Grid) */}
              <ServiceCardsGrid ur={ur} onSelect={() => engine.act("where-to")} />

              {/* Bottom Section: Destination Search & Recent Locations */}
              <div className="space-y-2 px-2.5 pt-2 pb-1.5">
                {/* Main Destination Search Bar (Interactive Target for Step 1) */}
                <SimButton
                  action="where-to"
                  className="flex w-full items-center gap-2.5 rounded-xl bg-white px-3 py-2 text-start shadow-sm hover:bg-zinc-100 transition-all cursor-pointer group"
                >
                  <Search className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="flex-1 text-xs sm:text-[13px] font-bold text-zinc-900 truncate">
                    {ur ? "آپ کہاں جا رہے ہیں؟" : "Where are you going?"}
                  </span>
                </SimButton>

                {/* Recent Places Section */}
                <div className="space-y-1 pt-0.5">
                  <div className="flex items-center justify-between px-0.5">
                    <span className="text-[9.5px] font-semibold text-zinc-400">
                      {ur ? "حالیہ مقامات" : "Recent places"}
                    </span>
                    <button
                      type="button"
                      onClick={() => engine.act("where-to")}
                      className="text-[9.5px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      {ur ? "سب دیکھیں" : "See all"}
                    </button>
                  </div>

                  <div className="space-y-0.5">
                    {/* Location 1: NED Visitor Gate */}
                    <button
                      type="button"
                      onClick={() => {
                        const loc = CURATED_LOCATIONS.find((l) => l.id === "ned-gate")!;
                        setDestLoc(loc);
                        engine.act("where-to");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg p-1.5 text-start hover:bg-zinc-800/60 transition-colors cursor-pointer group"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 transition-colors">
                        <Clock className="h-3 w-3" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">
                          {ur ? "این ای ڈی وزیٹر گیٹ" : "NED Visitor Gate"}
                        </p>
                        <p className="text-[8.5px] text-zinc-400 truncate">
                          {ur ? "مین یونیورسٹی روڈ، کراچی" : "Main University Road, Karachi"}
                        </p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    </button>

                    {/* Location 2: NED University Of Engineering & Technology */}
                    <button
                      type="button"
                      onClick={() => {
                        const loc = CURATED_LOCATIONS.find((l) => l.id === "ned-main")!;
                        setDestLoc(loc);
                        engine.act("where-to");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg p-1.5 text-start hover:bg-zinc-800/60 transition-colors cursor-pointer group"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 transition-colors">
                        <Clock className="h-3.5 w-3.5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">
                          {ur ? "این ای ڈی یونیورسٹی آف انجینئرنگ اینڈ ٹیکنالوجی" : "NED University Of Engineering & Technology"}
                        </p>
                        <p className="text-[8.5px] text-zinc-400 truncate">
                          {ur ? "کراچی" : "Karachi"}
                        </p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Bottom Reassurance Note */}
                <p className="shrink-0 text-center text-[8.5px] text-zinc-500 flex items-center justify-center gap-1 pt-0.5 pb-1">
                  <span>{ur ? "کوئی اصل مقام استعمال نہیں ہوتا" : "No live location is used"}</span>
                  <Info className="h-2.5 w-2.5" />
                </p>
              </div>
            </div>
          )}

          {/* SCREEN 2: ENTER YOUR ROUTE (Combines Pickup & Destination selection) */}
          {isRouteEntry && (
            <RideRouteEntry
              ur={ur}
              pickup={pickupLoc}
              dest={destLoc}
              onSelectPickup={(loc) => {
                setPickupLoc(loc);
                if (screen === "pickup") {
                  engine.act("pickup-continue");
                }
              }}
              onSelectDest={(loc) => {
                setDestLoc(loc);
                if (screen === "destination") {
                  engine.act("dest-continue");
                }
              }}
              onOpenMapPicker={(m) => setMapPickerMode(m)}
              onBack={() => engine.goTo("home")}
              onContinue={() => {
                if (screen === "pickup") {
                  engine.act("pickup-continue");
                  setTimeout(() => engine.act("dest-continue"), 50);
                } else if (screen === "destination") {
                  engine.act("dest-continue");
                }
              }}
            />
          )}
        </>
      )}

      {/* SCREEN 4: RIDE SELECTION */}
      {screen === "ride" && (
        <div className="flex flex-1 flex-col min-h-full">
          <CompactSimulatorHeader
            title={ur ? "گاڑی کا انتخاب" : "Choose Ride Type"}
            ur={ur}
            onBack={engine.back}
          />
          <div className="p-2 flex-1 flex flex-col justify-between gap-1.5 min-h-0">
            <RouteMap pickup={pickupLoc.id} dest={destLoc?.id} className="h-[75px] shrink-0" />
            <div className="shrink-0 space-y-1.5">
              <h3 className="text-[11px] font-bold text-heading">{ur ? "گاڑی کا انتخاب کریں" : "Choose Ride Type"}</h3>
              <div className="space-y-1" role="radiogroup">
                {rideTypes.map((r) => {
                  const itemFare = practiceFare(pickupLoc.id, destLoc?.id || "hospital", r.id);
                  const isSelected = rideType === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setRideType(r.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border-2 bg-card px-2 py-1 text-start transition-colors shrink-0 cursor-pointer",
                        isSelected ? "border-primary bg-mint" : "border-border hover:border-primary"
                      )}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1">
                        <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg bg-mint text-primary">
                          <Car className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold text-heading leading-tight whitespace-nowrap">
                            {tr(r.label)}
                          </div>
                          <div className="text-[8.5px] text-muted-foreground leading-tight truncate">
                            {r.id === "rickshaw"
                              ? ur
                                ? "کم کرایہ · 2 منٹ"
                                : "Economical · 2 min"
                              : ur
                                ? "آرام دہ · 3 منٹ"
                                : "Comfortable · 3 min"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 text-end">
                        <span className="font-bold text-[11px] text-heading whitespace-nowrap" dir="ltr">
                          {formatRs(itemFare)}
                        </span>
                        {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Payment Method pill */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-card px-2 py-1 text-[9.5px]">
                <span className="flex items-center gap-1 font-semibold text-muted-foreground shrink-0">
                  <Banknote className="h-3 w-3 text-primary" /> {ur ? "ادائیگی" : "Payment"}
                </span>
                <span className="font-bold text-heading text-end truncate ml-1">{ur ? "نقد (Cash)" : "Cash on arrival"}</span>
              </div>
            </div>

            <div className="shrink-0 pt-0.5">
              <SimButton
                action="ride-continue"
                onPress={() =>
                  rideType
                    ? engine.act("ride-continue")
                    : engine.mistake({
                        en: "Please tap Car or Rickshaw first.",
                        ur: "پہلے گاڑی یا رکشہ دبائیں۔",
                      })
                }
                className="btn btn-primary w-full min-h-[34px] py-1 text-xs font-bold rounded-xl cursor-pointer"
              >
                {ur ? "آگے بڑھیں" : "Continue"}
              </SimButton>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 5: REVIEW */}
      {screen === "review" && (
        <div className="flex flex-1 flex-col min-h-full">
          <CompactSimulatorHeader
            title={ur ? "بکنگ کا جائزہ" : "Review booking"}
            ur={ur}
            onBack={engine.back}
          />
          <div className="p-2 flex-1 flex flex-col justify-between gap-1.5 min-h-0">
            <RouteMap className="h-[75px] shrink-0" pickup={pickupLoc.id} dest={destLoc?.id} />
            <div className="shrink-0 space-y-1">
              <h3 className="text-[11px] font-bold text-heading">{ur ? "بکنگ کا جائزہ" : "Review booking"}</h3>
              <dl className="divide-y divide-border rounded-xl border border-border bg-card text-[9.5px]">
                {[
                  [ur ? "سوار ہونا" : "Pickup", pickupLoc.name],
                  [ur ? "منزل" : "Destination", destLoc?.name || "NED Visitor Gate"],
                  [ur ? "سواری" : "Ride", tr(rideTypes.find((r) => r.id === (rideType || "car"))?.label)],
                  [ur ? "اندازاً کرایہ" : "Est. fare", formatRs(fare || practiceFare(pickupLoc.id, destLoc?.id || "hospital", "car"))],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center gap-1.5 px-2 py-1">
                    <dt className="text-muted-foreground font-medium shrink-0">{k}</dt>
                    <dd className="text-end font-bold text-heading leading-tight truncate max-w-[62%]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="shrink-0 pt-0.5">
              <SimButton action="confirm-booking" className="btn btn-primary w-full min-h-[34px] py-1 text-xs font-bold rounded-xl cursor-pointer">
                {ur ? "مشق بکنگ کی تصدیق" : "Confirm Practice Booking"}
              </SimButton>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 6: ASSIGNED DRIVER */}
      {screen === "assigned" && (
        <div className="flex flex-1 flex-col min-h-full">
          <CompactSimulatorHeader
            title={ur ? "ڈرائیور مل گیا" : "Driver Assigned"}
            ur={ur}
            onBack={engine.back}
          />
          <div className="p-2 flex-1 flex flex-col justify-between gap-1.5 min-h-0">
            <RouteMap pickup={pickupLoc.id} dest={destLoc?.id} className="h-[75px] shrink-0" />
            <div className="shrink-0 space-y-1.5">
              <p className="rounded-lg bg-success-soft p-1 text-center text-[9.5px] font-bold text-success">
                {ur ? "مشق ڈرائیور مل گیا — 3 منٹ میں پہنچ رہا ہے" : "Practice driver found — arriving in 3 min"}
              </p>
              <div className="rounded-xl border border-border bg-card p-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mint">
                    <UserRound className="h-4 w-4 text-primary-strong" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-heading truncate">{rideDriver.name}</p>
                    <p className="text-[9px] text-muted-foreground truncate">⭐ 4.9 · {ur ? "سفید سوزوکی آلٹو" : "White Suzuki Alto"}</p>
                  </div>
                </div>
                <div className="mt-1.5 border-t border-border pt-1 text-center">
                  <p className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {ur ? "نمبر پلیٹ (یاد رکھیں)" : "Number Plate (Remember this)"}
                  </p>
                  <p
                    className="mt-0.5 inline-block rounded-lg border-2 border-heading bg-card px-2.5 py-0.5 font-mono text-sm sm:text-base font-black tracking-widest text-heading shadow-xs"
                    dir="ltr"
                  >
                    {rideDriver.bookedPlate}
                  </p>
                </div>
              </div>
            </div>
            <div className="shrink-0 pt-0.5">
              <SimButton action="see-vehicle" className="btn btn-primary w-full min-h-[34px] py-1 text-xs font-bold rounded-xl cursor-pointer">
                {ur ? "گاڑی پہنچ گئی" : "Vehicle has arrived"}
              </SimButton>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 7: VERIFY PLATE */}
      {screen === "verify" && (
        <div className="flex flex-1 flex-col min-h-full">
          <CompactSimulatorHeader
            title={ur ? "پلیٹ چیک کریں" : "Verify Plate"}
            ur={ur}
            onBack={engine.back}
          />
          <div className="p-2 flex-1 flex flex-col justify-between gap-1.5 min-h-0">
            <div className="flex-1 flex flex-col items-center justify-center rounded-xl border border-border bg-sky p-2 text-center min-h-[75px]">
              <Car className="h-8 w-8 text-heading" />
              <p
                className="mt-1 inline-block rounded-lg border-2 border-heading bg-card px-2 py-0.5 font-mono text-sm sm:text-base font-black tracking-widest text-heading shadow-xs"
                dir="ltr"
              >
                {rideDriver.arrivedPlate}
              </p>
              <p className="mt-0.5 text-[8.5px] font-semibold text-muted-foreground">
                {ur ? "آنے والی گاڑی کی نمبر پلیٹ" : "Arriving vehicle number plate"}
              </p>
            </div>

            <div className="shrink-0 rounded-lg border border-border bg-card p-1.5 text-center">
              <p className="text-[10px] font-bold text-heading leading-tight">
                {ur ? "کیا یہ نمبر پلیٹ آپ کی بکنگ والی سے ملتی ہے؟" : "Does this vehicle number plate match your booking?"}
              </p>
              <p className="mt-0.5 text-[8.5px] text-muted-foreground">
                {ur ? "بکنگ والی پلیٹ:" : "Booked plate:"}{" "}
                <span className="font-mono font-bold text-heading" dir="ltr">
                  {rideDriver.bookedPlate}
                </span>
              </p>
            </div>

            <div className="shrink-0 space-y-1 pt-0.5">
              <SimButton action="plate-match" highlightFor="__never" className="btn btn-outline w-full min-h-[32px] py-1 text-[11px] font-bold rounded-xl cursor-pointer">
                {ur ? "ہاں، ملتی ہے" : "Yes, it matches"}
              </SimButton>
              <SimButton action="plate-different" className="btn btn-primary w-full min-h-[32px] py-1 text-[11px] font-bold rounded-xl cursor-pointer">
                {ur ? "نہیں، مختلف ہے" : "No, it is different"}
              </SimButton>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 8: DONE */}
      {screen === "done" && (
        <div className="flex flex-1 flex-col min-h-full">
          <CompactSimulatorHeader
            title={ur ? "مکمل" : "Complete"}
            ur={ur}
          />
          <div className="p-2 flex-1 flex flex-col justify-between gap-1.5 min-h-0 text-center">
            <div className="flex-1 flex flex-col items-center justify-center space-y-1.5 pt-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success-soft">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <p className="flex items-start gap-1.5 rounded-xl bg-warning-soft p-1.5 text-start text-[9.5px] leading-snug text-heading shadow-xs">
                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                <span>
                  {ur
                    ? "درست! پلیٹ مختلف تھی، اس لیے گاڑی میں نہ بیٹھیں۔ ایپ میں ڈرائیور کو چیک کریں یا سواری منسوخ کریں۔"
                    : "Correct! The plate was different, so do not get in. Check the driver in the app or cancel the ride."}
                </span>
              </p>
              <p className="text-xs font-bold text-heading leading-snug px-1">
                {ur ? "زبردست! آپ نے سواری بک کرنے اور تفصیل چیک کرنے کی مشق کی۔" : "Great! You practised booking a ride safely."}
              </p>
            </div>
            <div className="shrink-0 space-y-1 pt-1">
              <button
                type="button"
                onClick={goSummary}
                className="btn btn-primary w-full min-h-[34px] py-1 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer"
              >
                {ur ? "خلاصہ دیکھیں" : "View Learning Summary"}
              </button>
              <button
                type="button"
                onClick={retry}
                className="btn btn-outline w-full min-h-[30px] py-1 text-xs font-semibold rounded-xl cursor-pointer"
              >
                {ur ? "دوبارہ کوشش کریں" : "Try Again"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
