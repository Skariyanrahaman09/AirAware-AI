import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Skull } from 'lucide-react';

export default function AqiGauge({ aqi = 180, severity = 'Unhealthy', category = 'Unhealthy', color = '#EF4444' }) {
  // Normalize AQI to scale 0 - 500 (angle from -90 to +90 degrees)
  const clampedAqi = Math.min(500, Math.max(0, aqi));
  const rotation = -90 + (clampedAqi / 500) * 180;

  const getSeverityIcon = () => {
    if (aqi <= 50) return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
    if (aqi <= 100) return <ShieldCheck className="w-5 h-5 text-amber-500" />;
    if (aqi <= 150) return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    if (aqi <= 200) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (aqi <= 300) return <AlertOctagon className="w-5 h-5 text-purple-600" />;
    return <Skull className="w-5 h-5 text-rose-950" />;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden">
      {/* Background radial soft tint */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 60%, ${color}, transparent 70%)`,
        }}
      />

      <div className="relative w-64 h-36 flex items-end justify-center">
        {/* SVG Gauge Arc */}
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          {/* Segments: Good, Moderate, USG, Unhealthy, Very Unhealthy, Hazardous */}
          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active Color Arcs */}
          {/* Good 0-50 (0 to 10%) */}
          <path d="M 20 100 A 80 80 0 0 1 36 60" fill="none" stroke="#10B981" strokeWidth="12" />
          {/* Moderate 51-100 */}
          <path d="M 36 60 A 80 80 0 0 1 65 32" fill="none" stroke="#FBBF24" strokeWidth="12" />
          {/* USG 101-150 */}
          <path d="M 65 32 A 80 80 0 0 1 100 20" fill="none" stroke="#F97316" strokeWidth="12" />
          {/* Unhealthy 151-200 */}
          <path d="M 100 20 A 80 80 0 0 1 135 32" fill="none" stroke="#EF4444" strokeWidth="12" />
          {/* Very Unhealthy 201-300 */}
          <path d="M 135 32 A 80 80 0 0 1 164 60" fill="none" stroke="#8B5CF6" strokeWidth="12" />
          {/* Hazardous 301-500 */}
          <path d="M 164 60 A 80 80 0 0 1 180 100" fill="none" stroke="#881337" strokeWidth="12" strokeLinecap="round" />

          {/* Gauge Needle Needle */}
          <g transform={`rotate(${rotation} 100 100)`} className="transition-transform duration-700 ease-out">
            <line x1="100" y1="100" x2="100" y2="30" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="100" r="7" fill="#1E293B" />
            <circle cx="100" cy="100" r="3" fill="#FFFFFF" />
          </g>
        </svg>

        {/* Centered Large AQI Display */}
        <div className="absolute bottom-0 text-center">
          <div className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">{aqi}</div>
          <div className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mt-0.5">Air Quality Index</div>
        </div>
      </div>

      {/* Severity pill below meter */}
      <div className="mt-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold shadow-2xs"
        style={{
          borderColor: color,
          color: color === '#881337' ? '#881337' : color,
          backgroundColor: `${color}15`,
        }}
      >
        {getSeverityIcon()}
        <span>{severity}</span>
      </div>
    </div>
  );
}
