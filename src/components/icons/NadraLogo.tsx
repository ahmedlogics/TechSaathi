import type { SVGProps } from "react";

export function NadraLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill="#01411C" />
      <circle cx="50" cy="50" r="44" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" />

      {/* Crescent and Star */}
      <path
        d="M52 26C41.5 26 33 34.5 33 45C33 55.5 41.5 64 52 64C56.5 64 60.5 62.4 63.8 59.8C59.5 61.5 54.8 61.2 51 58.5C45.2 54.5 43.5 46.5 47.2 40.2C49.2 36.8 52.8 34.2 57 33.5C55.4 32.5 53.7 32 52 32V26Z"
        fill="#FFFFFF"
      />
      <polygon
        points="62,34 64.5,39 70,39.5 65.8,43 67.2,48.5 62.5,45.5 57.8,48.5 59.2,43 55,39.5 60.5,39"
        fill="#FFFFFF"
      />

      {/* Fingerprint Ridge Arcs */}
      <path
        d="M36 71C40 68.5 45 67 50 67C55 67 60 68.5 64 71"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M32 76C37.5 73 43.5 71.5 50 71.5C56.5 71.5 62.5 73 68 76"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M29 81C35.5 77.5 42.5 75.8 50 75.8C57.5 75.8 64.5 77.5 71 81"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* NADRA Banner / Text */}
      <rect x="22" y="14" width="56" height="11" rx="5.5" fill="#FFFFFF" />
      <text
        x="50"
        y="22.5"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="900"
        fill="#01411C"
        fontFamily="system-ui, sans-serif"
        letterSpacing="1.2"
      >
        NADRA
      </text>
    </svg>
  );
}

export function PakIDBadgeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="40" height="40" rx="10" fill="#01411C" />
      {/* Crescent */}
      <path
        d="M21 10C16 10 12 14 12 19C12 24 16 28 21 28C23.2 28 25.2 27.2 26.8 25.8C24.5 26.5 22 25.8 20.2 24.2C17.5 21.8 17 17.8 19 14.8C20 13.2 21.8 12 23.8 11.8C22.9 11.2 22 11 21 11V10Z"
        fill="#FFFFFF"
      />
      {/* Star */}
      <polygon
        points="27,14 28,16.5 30.5,16.8 28.5,18.5 29.2,21 27,19.5 24.8,21 25.5,18.5 23.5,16.8 26,16.5"
        fill="#FFFFFF"
      />
      {/* Fingerprint line */}
      <path
        d="M14 31C16.5 29.5 19 28.8 22 28.8C25 28.8 27.5 29.5 30 31"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <text
        x="20"
        y="37"
        textAnchor="middle"
        fontSize="5"
        fontWeight="900"
        fill="#A7F3D0"
        fontFamily="system-ui, sans-serif"
      >
        PAKID
      </text>
    </svg>
  );
}

