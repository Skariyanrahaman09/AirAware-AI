import React from 'react';

export default function AqiBadge({ aqi, severity, size = 'md' }) {
  const getColors = (val) => {
    if (val <= 50) return { bg: 'bg-emerald-500', text: 'text-emerald-700', bgLight: 'bg-emerald-50', border: 'border-emerald-200' };
    if (val <= 100) return { bg: 'bg-amber-400', text: 'text-amber-700', bgLight: 'bg-amber-50', border: 'border-amber-200' };
    if (val <= 150) return { bg: 'bg-orange-500', text: 'text-orange-700', bgLight: 'bg-orange-50', border: 'border-orange-200' };
    if (val <= 200) return { bg: 'bg-red-500', text: 'text-red-700', bgLight: 'bg-red-50', border: 'border-red-200' };
    if (val <= 300) return { bg: 'bg-purple-600', text: 'text-purple-700', bgLight: 'bg-purple-50', border: 'border-purple-200' };
    return { bg: 'bg-rose-950', text: 'text-rose-900', bgLight: 'bg-rose-100', border: 'border-rose-300' };
  };

  const hasReading = typeof aqi === 'number' && Number.isFinite(aqi);
  const style = hasReading ? getColors(aqi) : { bg: 'bg-slate-400', text: 'text-slate-700', bgLight: 'bg-slate-50', border: 'border-slate-200' };
  const displayValue = hasReading ? aqi : 'N/A';

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${style.bgLight} ${style.text} border ${style.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${style.bg}`}></span>
        {displayValue} {severity && `• ${severity}`}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border ${style.border} ${style.bgLight}`}>
        <div className={`w-3 h-3 rounded-full ${style.bg} animate-pulse`}></div>
        <div>
          <div className="text-2xl font-black text-slate-800 tracking-tight leading-none">{displayValue} {hasReading ? 'AQI' : 'Reading'}</div>
          <div className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>{severity}</div>
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold ${style.bgLight} ${style.text} border ${style.border}`}>
      <span className={`w-2 h-2 rounded-full ${style.bg}`}></span>
      <span>{displayValue} {hasReading ? 'AQI' : '—'} {severity || (hasReading ? '' : 'Unavailable')}</span>
    </span>
  );
}
