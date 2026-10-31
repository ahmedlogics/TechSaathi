/**
 * Tailored watermark emblems for TechSaathi home screen module cards.
 * Designed with distinct iconography for each specific digital task:
 * - Payment: Classical banking colonnade, security shield, and currency seal
 * - Ride: GPS navigation pin, curved transit road, and speedometer compass
 * - Calls: Camera aperture, acoustic soundwaves, and communication speech bubble
 */

export function PaymentWatermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer concentric security guilloche rings */}
      <circle cx="100" cy="100" r="92" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="100" cy="100" r="82" strokeWidth="2" />
      <circle cx="100" cy="100" r="74" strokeWidth="1" />

      {/* Security Shield */}
      <path
        d="M100 32 L150 54 V98 C150 134 100 162 100 162 C100 162 50 134 50 98 V54 Z"
        strokeWidth="3.5"
        fill="currentColor"
        fillOpacity="0.04"
      />

      {/* Classical Bank Pediment & Colonnade */}
      <path d="M70 76 L100 58 L130 76 H70 Z" strokeWidth="2.5" />
      <line x1="66" y1="80" x2="134" y2="80" strokeWidth="2" />

      {/* Columns */}
      <line x1="77" y1="84" x2="77" y2="114" strokeWidth="3" />
      <line x1="92" y1="84" x2="92" y2="114" strokeWidth="3" />
      <line x1="108" y1="84" x2="108" y2="114" strokeWidth="3" />
      <line x1="123" y1="84" x2="123" y2="114" strokeWidth="3" />

      {/* Base */}
      <line x1="68" y1="116" x2="132" y2="116" strokeWidth="2.5" />
      <line x1="64" y1="121" x2="136" y2="121" strokeWidth="3" />

      {/* Digital Transfer Arrow Emblem */}
      <circle cx="100" cy="140" r="14" strokeWidth="2" />
      <path d="M94 140 H106 M102 136 L106 140 L102 144" strokeWidth="2" />
    </svg>
  );
}

export function RideWatermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer navigation circle with compass markings */}
      <circle cx="100" cy="100" r="90" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="80" strokeWidth="2" />

      {/* Compass cardinal ticks */}
      <line x1="100" y1="12" x2="100" y2="24" strokeWidth="3" />
      <line x1="100" y1="176" x2="100" y2="188" strokeWidth="3" />
      <line x1="12" y1="100" x2="24" y2="100" strokeWidth="3" />
      <line x1="176" y1="100" x2="188" y2="100" strokeWidth="3" />

      {/* Winding road perspective */}
      <path
        d="M45 160 C75 140, 80 110, 100 100 C120 90, 130 75, 145 45"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M45 160 C75 140, 80 110, 100 100 C120 90, 130 75, 145 45"
        strokeWidth="2"
        stroke="white"
        strokeDasharray="6 6"
      />

      {/* GPS Location Pin */}
      <g transform="translate(115, 30)">
        <path
          d="M20 0 C9 0 0 9 0 20 C0 35 20 54 20 54 C20 54 40 35 40 20 C40 9 31 0 20 0 Z"
          strokeWidth="3"
          fill="currentColor"
          fillOpacity="0.05"
        />
        <circle cx="20" cy="20" r="7" strokeWidth="2.5" />
      </g>

      {/* Car Vehicle Silhouette */}
      <g transform="translate(48, 92)">
        <path
          d="M8 24 L16 10 C18 6 24 4 32 4 H48 C56 4 62 6 64 10 L72 24 H76 C78 24 80 26 80 28 V36 C80 38 78 40 76 40 H74 M6 40 H4 C2 40 0 38 0 36 V28 C0 26 2 24 4 24 H8 Z"
          strokeWidth="2.5"
          fill="currentColor"
          fillOpacity="0.04"
        />
        {/* Wheels */}
        <circle cx="20" cy="40" r="7" strokeWidth="2.5" />
        <circle cx="60" cy="40" r="7" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

export function CallWatermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer audio wave circle */}
      <circle cx="100" cy="100" r="90" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="100" cy="100" r="80" strokeWidth="2" />

      {/* Large Speech Bubble */}
      <path
        d="M40 90 C40 55 68 32 104 32 C140 32 168 55 168 90 C168 122 142 144 110 146 L82 164 V142 C56 136 40 116 40 90 Z"
        strokeWidth="3.5"
        fill="currentColor"
        fillOpacity="0.04"
      />

      {/* Video Camera in Center */}
      <g transform="translate(68, 68)">
        {/* Camera body */}
        <rect x="0" y="8" width="46" height="34" rx="8" strokeWidth="2.5" />
        {/* Lens triangle */}
        <path d="M46 18 L64 8 V42 L46 32 Z" strokeWidth="2.5" />
        {/* Camera circle aperture */}
        <circle cx="22" cy="25" r="8" strokeWidth="2" />
      </g>

      {/* Concentric Voice Waves */}
      <path d="M152 75 C158 83 158 97 152 105" strokeWidth="2.5" />
      <path d="M162 67 C172 79 172 101 162 113" strokeWidth="2.5" />
    </svg>
  );
}
