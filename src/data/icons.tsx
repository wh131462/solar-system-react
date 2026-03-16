import React from 'react';

const s = (d: React.SVGProps<SVGSVGElement>) => ({width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",...d});

export const Icons: Record<string, React.FC> = {
  rocket: () => (
    <svg {...s({})}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  ),
  sun: () => (
    <svg {...s({})}>
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  globe: () => (
    <svg {...s({})}>
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  ring: () => (
    <svg {...s({})}>
      <circle cx="12" cy="12" r="4"/>
      <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(-20 12 12)"/>
    </svg>
  ),
  spiral: () => (
    <svg {...s({})}>
      <path d="M12 3c-1.5 0-3 .5-4 1.5C6 6.5 6 9 8 11s4.5 2 6.5.5S17 7 15 5s-4-2-5.5-.5S8 8 10 10s4 1.5 5 .5"/>
    </svg>
  ),
  book: () => (
    <svg {...s({})}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  cap: () => (
    <svg {...s({})}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c0 2 3.5 3 6 3s6-1 6-3v-5"/>
    </svg>
  ),
  scale: () => (
    <svg {...s({})}>
      <line x1="12" y1="3" x2="12" y2="21"/>
      <polyline points="1 14 12 3 23 14"/>
    </svg>
  ),
  microscope: () => (
    <svg {...s({})}>
      <path d="M6 18h8"/><path d="M3 22h18"/>
      <path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M8 6h4"/>
      <path d="M13 10V4.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V10"/>
    </svg>
  ),
  timer: () => (
    <svg {...s({})}>
      <circle cx="12" cy="13" r="8"/>
      <path d="M12 9v4l2 2"/><path d="M5 3L2 6"/><path d="M22 6l-3-3"/>
      <line x1="10" y1="1" x2="14" y2="1"/>
    </svg>
  ),
  moon: () => (
    <svg {...s({})}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  star: () => (
    <svg {...s({})}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  check: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  lock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
};
