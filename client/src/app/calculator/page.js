'use client';

import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import {
  Calculator,
  Leaf,
  DollarSign,
  Fuel,
  Zap,
  TrendingDown,
  Info,
  ShieldAlert,
  ArrowRight,
  Car,
  TreePine,
  RotateCcw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function CalculatorPage() {
  const [commuteDistanceKm, setCommuteDistanceKm] = useState(18);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [currentMode, setCurrentMode] = useState('personal_car');
  const [alternativeMode, setAlternativeMode] = useState('public_transit');
  const [carpoolOccupancy, setCarpoolOccupancy] = useState(2);
  const [avoidIdling, setAvoidIdling] = useState(true);
  const [combineTrips, setCombineTrips] = useState(true);
  const [reducedKwhMonthly, setReducedKwhMonthly] = useState(40);

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateSavings = async () => {
    setLoading(true);
    try {
      const res = await api.post('/impact/calculate', {
        commuteDistanceKm: Number(commuteDistanceKm),
        daysPerWeek: Number(daysPerWeek),
        currentMode,
        alternativeMode,
        carpoolOccupancy: Number(carpoolOccupancy),
        avoidIdling,
        combineTrips,
        reducedKwhMonthly: Number(reducedKwhMonthly),
      });

      if (res.data.success) {
        setResults(res.data);
      }
    } catch (err) {
      console.warn('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateSavings();
  }, [
    commuteDistanceKm,
    daysPerWeek,
    currentMode,
    alternativeMode,
    carpoolOccupancy,
    avoidIdling,
    combineTrips,
    reducedKwhMonthly,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <Calculator className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sustainability & Emissions Impact Calculator
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Estimate your avoided CO2 emissions, fuel cost savings, and breathing-zone particulate reductions.
        </p>
      </div>

      {/* Mandatory Scientific Transparency Disclaimer Card */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-1.5">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Scientific Distinction: Global Climate (CO2) vs. Local Health Exposure (PM2.5)</span>
        </div>
        <p className="text-amber-800 leading-relaxed">
          {results?.scientificDisclaimer?.explanation ||
            'All calculations are empirical estimates. Reductions in CO2 emissions address global climate change over decades. While taking transit or eliminating vehicle idling also prevents localized tailpipe PM2.5 exhaust, immediate personal protection during winter smog requires certified N95 respirators and indoor HEPA air filtration.'}
        </p>
      </div>

      {/* Main Grid: Controls vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Household & Commute Parameters</h3>
            <button
              onClick={() => {
                setCommuteDistanceKm(15);
                setDaysPerWeek(5);
                setCurrentMode('personal_car');
                setAlternativeMode('public_transit');
                setAvoidIdling(true);
                setCombineTrips(true);
                setReducedKwhMonthly(35);
              }}
              className="text-xs font-semibold text-slate-400 hover:text-emerald-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Commute Distance */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Daily Round-Trip Distance</span>
              <span className="font-black text-emerald-700">{commuteDistanceKm} km / day</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={commuteDistanceKm}
              onChange={(e) => setCommuteDistanceKm(e.target.value)}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Days Per Week */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Active Commute Days per Week</span>
              <span className="font-black text-emerald-700">{daysPerWeek} days / week</span>
            </div>
            <input
              type="range"
              min={1}
              max={7}
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(e.target.value)}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Current Vehicle Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Vehicle Mode</label>
            <select
              value={currentMode}
              onChange={(e) => setCurrentMode(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
            >
              <option value="personal_car">Personal Car (Petrol / Diesel)</option>
              <option value="motorcycle_scooter">Motorcycle / Scooter</option>
              <option value="public_transit">Bus / Metro</option>
              <option value="bicycle_walk">Bicycle / Walk</option>
            </select>
          </div>

          {/* Alternative Shift Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Proposed Sustainable Shift</label>
            <select
              value={alternativeMode}
              onChange={(e) => setAlternativeMode(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
            >
              <option value="public_transit">Public Transit (Electric Rail / Bus)</option>
              <option value="carpool">Carpooling with Neighbors</option>
              <option value="bicycle_walk">Bicycle or Walk</option>
              <option value="remote_work">Remote Work / Telecommuting</option>
            </select>
          </div>

          {alternativeMode === 'carpool' && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Carpool Passengers Sharing Vehicle</span>
                <span className="font-black text-emerald-700">{carpoolOccupancy} occupants</span>
              </div>
              <input
                type="range"
                min={2}
                max={5}
                value={carpoolOccupancy}
                onChange={(e) => setCarpoolOccupancy(e.target.value)}
                className="w-full accent-emerald-600"
              />
            </div>
          )}

          {/* Behavioral Toggles */}
          <div className="pt-2 space-y-2.5 border-t border-slate-100 text-xs">
            <label className="flex items-center justify-between text-slate-700 cursor-pointer">
              <span>Anti-Idling (Shut engine at signals &gt;30s)</span>
              <input
                type="checkbox"
                checked={avoidIdling}
                onChange={(e) => setAvoidIdling(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between text-slate-700 cursor-pointer">
              <span>Trip Chaining (Combine multiple errands into 1)</span>
              <input
                type="checkbox"
                checked={combineTrips}
                onChange={(e) => setCombineTrips(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
            </label>
          </div>

          {/* Electricity Conservation */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Monthly Household Electricity Saved</span>
              <span className="font-black text-emerald-700">{reducedKwhMonthly} kWh / mo</span>
            </div>
            <input
              type="range"
              min={0}
              max={150}
              value={reducedKwhMonthly}
              onChange={(e) => setReducedKwhMonthly(e.target.value)}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>

        {/* Right Output Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Total Annual CO2 */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Avoided Annual CO2</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {results?.summary?.totalAnnualCO2AvoidedKg ?? 0}{' '}
                <span className="text-xs font-normal text-slate-500">kg CO2e</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Global greenhouse gas reduction</span>
            </div>

            {/* Fuel Saved */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
              <div className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Fuel Conserved</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {results?.summary?.fuelSavedLiters ?? 0}{' '}
                <span className="text-xs font-normal text-slate-500">Liters</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Saved ~${results?.summary?.estimatedFuelCostSavedUSD ?? 0} USD
              </span>
            </div>

            {/* Equivalent Trees */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
              <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Tree Offset Equiv.</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {results?.summary?.equivalentTreesPlanted ?? 0}{' '}
                <span className="text-xs font-normal text-slate-500">Trees</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Annual mature tree absorption</span>
            </div>

            {/* Local Breathing Zone PM2.5 Saved */}
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
              <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Tailpipe PM2.5 Cut</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {results?.summary?.localPM25AvoidedGrams ?? 0}{' '}
                <span className="text-xs font-normal text-slate-500">grams</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Eliminated directly from street air</span>
            </div>

            {/* Unnecessary Trips Saved */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Trips Eliminated</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {results?.summary?.unnecessaryVehicleTripsReduced ?? 0}{' '}
                <span className="text-xs font-normal text-slate-500">Trips</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Through errand chaining</span>
            </div>

            {/* Household Electricity Saved */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
              <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">Electricity Saved</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {results?.summary?.annualKwhSaved ?? 0}{' '}
                <span className="text-xs font-normal text-slate-500">kWh/yr</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Cuts coal power station demand</span>
            </div>
          </div>

          {/* Monthly Savings Bar Chart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Monthly Projected CO2 Savings (kg)</h3>
                <p className="text-[11px] text-slate-400">
                  Winter smog months (Nov-Feb) exhibit higher sensitivity to tailpipe emission reductions.
                </p>
              </div>
            </div>

            <div className="h-60 w-full pt-2">
              {results?.monthlyBreakdown ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.monthlyBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="co2AvoidedKg" fill="#10B981" radius={[4, 4, 0, 0]} name="CO2 Saved (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">Calculating...</div>
              )}
            </div>
          </div>

          {/* Scientific Calculation Assumptions */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-700">Calculation Assumptions & Emission Factors:</div>
            <ul className="text-slate-600 space-y-1 list-disc pl-4 text-[11px]">
              {results?.assumptions?.map((assump, idx) => (
                <li key={idx}>{assump}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
