'use client';

import React, { useState, useEffect } from 'react';
import { useAirData } from '../../context/AirDataContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import {
  CalendarCheck,
  Clock,
  Car,
  Footprints,
  Sun,
  Moon,
  AlertTriangle,
  CheckCircle2,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Leaf,
  ShieldAlert,
} from 'lucide-react';

export default function RoutinePage() {
  const { airData, selectedCity } = useAirData();
  const { user, familyProfile } = useAuth();

  const [lifestyle, setLifestyle] = useState('office_worker');
  const [commuteMode, setCommuteMode] = useState('personal_car');
  const [outdoorActivityLevel, setOutdoorActivityLevel] = useState('moderate');
  const [hasChildren, setHasChildren] = useState(true);
  const [hasElderly, setHasElderly] = useState(false);

  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync profile preferences if available
  useEffect(() => {
    if (familyProfile) {
      if (familyProfile.commuteType) setCommuteMode(familyProfile.commuteType);
      if (familyProfile.hasChildren !== undefined) setHasChildren(familyProfile.hasChildren);
      if (familyProfile.hasElderly !== undefined) setHasElderly(familyProfile.hasElderly);
    }
  }, [familyProfile]);

  const generateRoutine = async () => {
    setLoading(true);
    try {
      const res = await api.post('/routines/generate', {
        city: airData?.city || selectedCity,
        lat: airData?.coordinates?.lat,
        lon: airData?.coordinates?.lon,
        lifestyle,
        commuteMode,
        outdoorActivityLevel,
        hasChildren,
        hasElderly,
      });

      if (res.data.success) {
        setRoutine(res.data.routine);
      }
    } catch (err) {
      console.warn('Routine generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRoutine();
  }, [lifestyle, commuteMode, outdoorActivityLevel, airData?.aqi]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
            <CalendarCheck className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Personalized Low-Emission Daily Routine
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Synchronized with real-time winter smog inversion cycles in {airData?.city || selectedCity} (AQI{' '}
          {airData?.aqi || 180}).
        </p>
      </div>

      {/* Control Configuration Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Configure Your Daily Profile</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Lifestyle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Lifestyle Profile</label>
            <select
              value={lifestyle}
              onChange={(e) => setLifestyle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            >
              <option value="student">Student / Campus</option>
              <option value="office_worker">Office Commuter</option>
              <option value="remote_worker">Remote / Work from Home</option>
              <option value="family">Full Household / Family</option>
            </select>
          </div>

          {/* Commute Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Commute Method</label>
            <select
              value={commuteMode}
              onChange={(e) => setCommuteMode(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            >
              <option value="personal_car">Personal Car (Gasoline/Diesel)</option>
              <option value="motorcycle_scooter">Motorcycle / Scooter</option>
              <option value="public_transit">Public Transit (Bus / Metro)</option>
              <option value="bicycle_walk">Bicycle / Walking</option>
            </select>
          </div>

          {/* Outdoor Activity */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Outdoor Physical Activity</label>
            <select
              value={outdoorActivityLevel}
              onChange={(e) => setOutdoorActivityLevel(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            >
              <option value="low">Low (Primarily indoors)</option>
              <option value="moderate">Moderate (Commute + light walks)</option>
              <option value="high">High (Outdoor running / sports / field)</option>
            </select>
          </div>

          {/* Household checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Vulnerable Household Members</label>
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasChildren}
                  onChange={(e) => setHasChildren(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Children</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasElderly}
                  onChange={(e) => setHasElderly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Elderly (65+)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerable Alert Notice */}
      {routine?.vulnerableGroupCaution && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="leading-relaxed font-medium">{routine.vulnerableGroupCaution}</p>
        </div>
      )}

      {/* Routine Specific Highlight Note */}
      {routine?.lifestyleSpecificNote && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
          <p className="leading-relaxed font-semibold">{routine.lifestyleSpecificNote}</p>
        </div>
      )}

      {/* The 4-Block Timeline Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recommended 4-Block Schedule</h2>
          <span className="text-xs text-slate-500">Each block details WHAT, WHY, and HOW</span>
        </div>

        {loading && !routine ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white p-6 rounded-3xl border border-slate-200 h-64 flex flex-col justify-between">
                <div className="h-5 bg-slate-200 rounded w-1/3" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
                <div className="h-12 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {routine?.timeline?.map((slot, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:border-emerald-300 transition-all space-y-4 relative overflow-hidden"
              >
                {/* Slot time header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="font-extrabold text-sm text-slate-800">{slot.timeSlot}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {slot.activity}
                  </span>
                </div>

                {/* What */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">WHAT To Do:</div>
                  <p className="text-xs text-slate-800 font-semibold leading-relaxed">{slot.what}</p>
                </div>

                {/* Why */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">WHY It Matters:</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{slot.why}</p>
                </div>

                {/* How */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">HOW To Execute:</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{slot.how}</p>
                </div>

                {/* Commute / Emission Action */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
                    <Car className="w-3.5 h-3.5 text-slate-500" />
                    <span>Commute & Emission Control:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{slot.commuteAction}</p>
                  <div className="text-[11px] font-semibold text-emerald-700 pt-0.5 flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    <span>{slot.estimatedEmissionSaved}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Low-Emission Habit Alternatives */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-600" />
          <span>Daily Sustainable Alternatives to Lower Local Smog</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {routine?.lowEmissionAlternatives?.map((alt, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium leading-relaxed">{alt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
