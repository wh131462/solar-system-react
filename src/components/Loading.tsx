import { useEffect, useState } from 'react';

const orbits = [
  { r: 28, size: 3, color: '#a6a6a6', speed: 4.2, label: '☿' },
  { r: 44, size: 4, color: '#e8cda0', speed: 3.4, label: '♀' },
  { r: 60, size: 4.5, color: '#4d9de0', speed: 2.8, label: '🜨' },
  { r: 78, size: 3.8, color: '#c1440e', speed: 2.2, label: '♂' },
  { r: 100, size: 6, color: '#c88b3a', speed: 1.4, label: '♃' },
  { r: 120, size: 5.5, color: '#d4a84b', speed: 1.0, label: '♄' },
  { r: 138, size: 4.5, color: '#72b8d4', speed: 0.7, label: '♅' },
  { r: 154, size: 4.2, color: '#3f54a5', speed: 0.5, label: '♆' },
];

export default function Loading() {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHide(true), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="loading" className={hide ? 'hide' : ''}>
      <div className="solar-loading">
        <div className="solar-loading-sun" />
        {orbits.map((o, i) => (
          <div
            key={i}
            className="solar-loading-orbit"
            style={{
              width: o.r * 2,
              height: o.r * 2,
              animationDuration: `${12 / o.speed}s`,
            }}
          >
            <div
              className="solar-loading-planet"
              style={{
                width: o.size * 2,
                height: o.size * 2,
                background: o.color,
                boxShadow: `0 0 ${o.size * 2}px ${o.color}80`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="solar-loading-text">正在构建太阳系&hellip;</div>
    </div>
  );
}
