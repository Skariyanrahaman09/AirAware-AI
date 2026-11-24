'use client';

import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useAirData } from '../../context/AirDataContext';
import {
  Home,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Wrench,
  DollarSign,
  Droplets,
  Wind,
  Sparkles,
  Info,
  HelpCircle,
  Flame,
} from 'lucide-react';

export default function IndoorQualityPage() {
  const { airData, selectedCity } = useAirData();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGuide() {
      try {
        const res = await api.get('/routines/indoor-guide');
        if (res.data.success) {
          setGuide(res.data.guide);
        }
      } catch (err) {
        console.warn('Failed to fetch indoor guide:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGuide();
  }, []);

  const isWindowSafe = (airData?.aqi || 200) < 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
            <Home className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Indoor Air Quality & Purification Master Guide
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Scientifically sound strategies for protecting indoor living quarters during severe winter smog episodes.
        </p>
      </div>

      {/* Live Room Ventilation Status Banner */}
      <div
        className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isWindowSafe
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Wind className={`w-5 h-5 shrink-0 ${isWindowSafe ? 'text-emerald-600' : 'text-rose-600'}`} />
          <div>
            <strong className="text-sm block">
              {isWindowSafe ? 'Safe to Ventilate Indoors' : 'Keep Windows & Exterior Doors Sealed'}
            </strong>
            <span>
              Current outdoor AQI in {airData?.city || selectedCity} is {airData?.aqi || 180} ({airData?.severity || 'Unhealthy'}).{' '}
              {isWindowSafe
                ? 'Great opportunity for 15-minute cross-ventilation.'
                : 'Outdoor air is toxic; ventilating now will flood rooms with dangerous PM2.5.'}
            </span>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${
            isWindowSafe ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
          }`}
        >
          {isWindowSafe ? 'Ventilation OK' : 'Windows Closed'}
        </span>
      </div>

      {/* Crucial Scientific Section: Particle Pollution vs Gaseous Pollutants */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Scientific Distinction</span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Particulate Matter vs. Gaseous Pollutants
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Different pollutants require completely different remediation techniques. Using the wrong tool wastes money and
            leaves your lungs unprotected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Particulates (PM2.5/PM10) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/40 to-slate-50 border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Particulate Matter (PM2.5 / PM10)</span>
              </h3>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Physical Particles
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Microscopic solid combustion specks, diesel soot, and road dust that penetrate through nasal passages into the
              deepest lung alveoli and bloodstream.
            </p>

            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What Actually Works:</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 pl-2">
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span><strong>True HEPA H13 Filtration:</strong> Mechanically captures 99.97% of particles down to 0.3 microns.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span><strong>DIY Box Fan + MERV-13:</strong> Low-cost filtration system yielding ~85% particulate capture.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span><strong>Damp Microfiber Mopping:</strong> Traps settled dust without re-suspending toxic particles into air.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span><strong>Door & Window Sealing:</strong> Weatherstripping foam tape blocks outdoor smog draft ingress.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-emerald-100/80">
              <div className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>What Fails / Misleading:</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pl-2">
                Basic mesh insect screens (pores are 1,000x larger than PM2.5), ionic breeze generators (emit ozone), dry
                feather dusters.
              </p>
            </div>
          </div>

          {/* Gaseous Pollutants (NO2/CO/VOCs) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50/40 to-slate-50 border border-teal-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-teal-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                <span>Gaseous Pollutants (NO2, CO, VOCs)</span>
              </h3>
              <span className="text-[10px] font-extrabold uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                Chemical Molecules
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Volatile organic compounds, nitrogen dioxide from gas cooking burners, carbon monoxide, and formaldehyde from
              adhesives and paints.
            </p>

            <div className="space-y-2">
              <div className="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>What Actually Works:</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 pl-2">
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span><strong>Activated Carbon / Charcoal:</strong> Adsorbs chemical vapor molecules on porous surface.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span><strong>Source Elimination:</strong> Strictly ban indoor incense, dhoop, smoking, and paraffin candles.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span><strong>Kitchen Range Hood Exhaust:</strong> Venting directly outdoors during cooking to eliminate NO2.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span><strong>Timed Ventilation:</strong> Brief window airing during afternoon hours when outdoor air improves.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-teal-100/80">
              <div className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>What Fails / Misleading:</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pl-2">
                Standard HEPA filters alone (gas molecules pass straight through fiberglass fiber mesh), chemical air freshener
                sprays (heavily increase toxic phthalates).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget-Friendly Alternatives Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Equity & Accessibility</span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Budget-Friendly Air Quality Strategies
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Clean indoor air should not be a luxury reserved for those who can afford $400 commercial purifiers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading && !guide ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 h-48 animate-pulse flex flex-col justify-between">
                <div className="h-6 w-1/3 bg-slate-200 rounded" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-4/5" />
                </div>
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))
          ) : (
            guide?.budgetFriendlyAlternatives?.map((alt, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                      <Wrench className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {alt.costEstimate}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">{alt.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">{alt.description}</p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-200/80 text-[11px]">
                  <div className="text-emerald-800 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{alt.effectiveness}</span>
                  </div>
                  <div className="text-slate-500">Maint: {alt.maintenance}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Do's & Don'ts Checklist */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Essential Indoor Smog Rules: Do's and Don'ts</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2.5">
            <h4 className="font-bold text-emerald-800 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>DO'S: Healthy Indoor Practices</span>
            </h4>
            <ul className="space-y-2 text-slate-700 pl-1">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Keep kitchen range hood on for at least 5 minutes after boiling or frying finishes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Maintain indoor relative humidity between 40% and 50% to prevent mucosal cracking.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Remove outdoor shoes at entryway to keep toxic brake dust out of living zones.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2.5">
            <h4 className="font-bold text-rose-800 flex items-center gap-1.5 text-sm">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>DON'TS: Critical Mistakes to Avoid</span>
            </h4>
            <ul className="space-y-2 text-slate-700 pl-1">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>NEVER burn incense sticks, dhoop, mosquito coils, or scented candles during winter smog.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Do not dry-sweep floors with dry straw brooms (resuspends settled PM2.5 into air).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Do not use unvented gas or kerosene space heaters indoors without dedicated flues.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
