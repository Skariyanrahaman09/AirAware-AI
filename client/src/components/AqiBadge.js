import React from 'react';

export default function AqiBadge({ aqi, severity, size = 'md' }) {
  const getColors = (val) => {
    // Colors tuned for WCAG 2.2 AA compliant contrast (>= 4.5:1 against respective backgrounds)
    if (val <= 50) return { bg: 'bg-emerald-600', text: 'text-emerald-900', bgLight: 'bg-emerald-50', border: 'border-emerald-300' };
    if (val <= 100) return { bg: 'bg-amber-500', text: 'text-amber-950', bgLight: 'bg-amber-50', border: 'border-amber-300' };
    if (val <= 150) return { bg: 'bg-orange-600', text: 'text-orange-950', bgLight: 'bg-orange-50', border: 'border-orange-300' };
    if (val <= 200) return { bg: 'bg-red-600', text: 'text-red-950', bgLight: 'bg-red-50', border: 'border-red-300' };
    if (val <= 300) return { bg: 'bg-purple-700', text: 'text-purple-950', bgLight: 'bg-purple-50', border: 'border-purple-300' };
    return { bg: 'bg-rose-950', text: 'text-rose-950', bgLight: 'bg-rose-100', border: 'border-rose-400' };
  };

  const style = getColors(aqi || 50);
  const accessibleLabel = `Air Quality Index: ${aqi} AQI, ${severity || 'Condition'}`;

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${style.bgLight} ${style.text} border ${style.border}`}
        role="status"
        aria-label={accessibleLabel}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${style.bg}`} aria-hidden="true"></span>
        <span>{aqi} {severity && `• ${severity}`}</span>
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div
        className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border ${style.border} ${style.bgLight}`}
        role="status"
        aria-label={accessibleLabel}
      >
        <div className={`w-3 h-3 rounded-full ${style.bg} animate-pulse`} aria-hidden="true"></div>
        <div>
          <div className="text-2xl font-black text-slate-900 tracking-tight leading-none">{aqi} AQI</div>
          <div className={`text-xs font-extrabold uppercase tracking-wider ${style.text}`}>{severity}</div>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold ${style.bgLight} ${style.text} border ${style.border}`}
      role="status"
      aria-label={accessibleLabel}
    >
      <span className={`w-2 h-2 rounded-full ${style.bg}`} aria-hidden="true"></span>
      <span>{aqi} AQI – {severity}</span>
    </span>
  );
}
