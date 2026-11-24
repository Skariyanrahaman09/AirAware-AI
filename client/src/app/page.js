'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAirData } from '../context/AirDataContext';
import AqiGauge from '../components/AqiGauge';
import AqiBadge from '../components/AqiBadge';
import {
  Wind,
  Shield,
  Bot,
  CalendarCheck,
  Home,
  Calculator,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Search,
  MapPin,
  TrendingUp,
  Leaf,
  Users,
  Compass,
  Radio,
  RefreshCw,
  Globe2,
} from 'lucide-react';

export default function HomePage() {
  const {
    airData,
    selectedCity,
    changeCity,
    loading,
    isRealTimeGps,
    enableRealTimeGps,
    searchCities,
    isLivePolling,
    pollingSecondsLeft,
  } = useAirData();

  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  const quickCities = [
    { name: 'Delhi', region: 'India' },
    { name: 'Kolkata', region: 'India' },
    { name: 'Mumbai', region: 'India' },
    { name: 'Bengaluru', region: 'India' },
    { name: 'Lahore', region: 'Hotspot' },
    { name: 'Beijing', region: 'Hotspot' },
    { name: 'London', region: 'Global' },
    { name: 'New York', region: 'Global' },
    { name: 'Tokyo', region: 'Global' },
  ];

  // Handle autocomplete input changes
  useEffect(() => {
    if (!searchInput.trim() || searchInput.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await searchCities(searchInput);
      setSuggestions(results || []);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchInput, searchCities]);

  // Click outside to dismiss suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      changeCity(searchInput.trim());
      setSearchInput('');
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (cityItem) => {
    changeCity(cityItem.city, { lat: cityItem.lat, lon: cityItem.lon });
    setSearchInput('');
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Winter Smog Alert Banner */}
      {airData && airData.aqi > 200 && (
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-purple-900 text-white text-xs py-2.5 px-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>
                <strong>Severe Smog Warning in {airData.city}:</strong> AQI is currently {airData.aqi} (
                {airData.severity}). Keep windows closed, run indoor HEPA filtration, and avoid outdoor physical workouts.
              </span>
            </div>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1 font-bold underline hover:text-amber-200"
            >
              View Guidance <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-emerald-50/60 via-teal-50/30 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>GenAI-Powered Global Air Quality & Smog Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Breathe Smarter. <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-800 bg-clip-text text-transparent">
                  Live Healthier
                </span>{' '}
                Worldwide.
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                AirAware AI is your personal environmental health assistant. We analyze real-time PM2.5, gaseous pollutants,
                and weather patterns for any city worldwide to provide actionable daily routines, indoor air purification guidance, and measurable
                low-emission lifestyle choices.
              </p>

              {/* Real-Time City Search & Live GPS Option */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
                  {/* Autocomplete Input Container */}
                  <div ref={searchContainerRef} className="relative flex-1">
                    <form onSubmit={handleSearch}>
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchInput}
                        onFocus={() => setShowSuggestions(true)}
                        onChange={(e) => {
                          setSearchInput(e.target.value);
                          setShowSuggestions(true);
                        }}
                        placeholder="Search any city worldwide (e.g. Kolkata, London, Tokyo)..."
                        className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs font-medium"
                      />
                    </form>

                    {/* Suggestions Autocomplete Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden divide-y divide-slate-100 text-xs">
                        {suggestions.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectSuggestion(item)}
                            className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-emerald-50 transition-colors"
                          >
                            <div>
                              <div className="font-bold text-slate-800">{item.city}</div>
                              <div className="text-[10px] text-slate-400">{item.country}</div>
                            </div>
                            <div className="text-right">
                              <span className="text-[11px] font-extrabold text-slate-700">{item.aqi} AQI</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors whitespace-nowrap"
                    >
                      Check AQI
                    </button>

                    {/* Live GPS Detection Button */}
                    <button
                      type="button"
                      onClick={enableRealTimeGps}
                      title="Detect Live Coordinates via GPS"
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border transition-all whitespace-nowrap shadow-xs ${
                        isRealTimeGps
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-600/20'
                          : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-300 hover:text-emerald-700'
                      }`}
                    >
                      <Compass className={`w-4 h-4 ${loading ? 'animate-spin' : isRealTimeGps ? 'animate-pulse' : 'text-emerald-600'}`} />
                      <span>{isRealTimeGps ? 'GPS Live' : 'Live GPS'}</span>
                    </button>
                  </div>
                </div>

                {/* Popular Worldwide City Quick Chips */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                  <span className="font-semibold text-slate-400 flex items-center gap-1">
                    <Globe2 className="w-3.5 h-3.5" /> Popular:
                  </span>
                  {quickCities.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => changeCity(item.name)}
                      className={`px-2.5 py-1 rounded-full border transition-all ${
                        selectedCity.toLowerCase() === item.name.toLowerCase()
                          ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-700'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                >
                  <span>Open Live Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs transition-colors"
                >
                  <Bot className="w-4 h-4 text-emerald-600" />
                  <span>Ask AI Assistant</span>
                </Link>
              </div>
            </div>

            {/* Right Live Gauge Card Preview */}
            <div className="lg:col-span-5">
              <div className="glass-card rounded-3xl p-6 shadow-xl border border-emerald-100 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Environmental Station</span>
                      {isRealTimeGps && (
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                          GPS Live
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      {airData?.city || selectedCity}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {airData && <AqiBadge aqi={airData.aqi} severity={airData.severity} size="sm" />}
                    {isLivePolling && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live in {pollingSecondsLeft}s
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-6">
                  {airData ? (
                    <AqiGauge
                      aqi={airData.aqi}
                      severity={airData.severity}
                      category={airData.category}
                      color={airData.color}
                    />
                  ) : (
                    <div className="h-44 flex items-center justify-center text-slate-400">Loading metrics...</div>
                  )}
                </div>

                {/* Pollutant snapshot */}
                {airData && (
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">PM2.5</div>
                      <div className="text-base font-extrabold text-slate-800">{airData.pollutants?.pm25} µg/m³</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">PM10</div>
                      <div className="text-base font-extrabold text-slate-800">{airData.pollutants?.pm10} µg/m³</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Temp / Hum</div>
                      <div className="text-base font-extrabold text-slate-800">
                        {airData.weather?.temperature}°C / {airData.weather?.humidity}%
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-3 text-center">
                  <Link
                    href="/dashboard"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-1"
                  >
                    Inspect Full 24h Hourly Curve & Forecast <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What, Why, How Philosophy Grid */}
      <section className="py-16 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-emerald-600 tracking-widest uppercase mb-2">Our Core Mission</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Beyond Just Numbers: Explaining What, Why & How
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Most weather apps only show a raw AQI number. AirAware AI connects scientific data directly to actionable
              lifestyle decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">WHAT You Should Do</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Precise operational steps: when to keep windows sealed, when to run your purifier, which commute mode is
                safe, and when outdoor exercise is prohibited.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">WHY It Matters</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Clear scientific explanations: how winter thermal inversion traps tailpipe PM2.5 at breathing level, and why
                particulates require HEPA while gases require carbon adsorption.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-black">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">HOW To Implement It</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Practical, budget-conscious execution: DIY Corsi-Rosenthal box fans ($25 vs $300), damp mopping techniques,
                and transit routing to minimize toxic exposure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-emerald-600 tracking-widest uppercase mb-2">Integrated Platform</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">Complete Smog Navigation Suite</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Real-Time Dashboard */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Real-Time AQI & Pollutant Metrics</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Live monitoring of PM2.5, PM10, CO, NO2, SO2, and O3 with 24-hour hourly trendlines and 5-day predictive
                smog forecasts.
              </p>
              <Link href="/dashboard" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                Explore Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2. GenAI Assistant */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">GenAI Environmental Assistant</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Natural language chatbot powered by OpenAI, grounded in your real-time sensor data and household vulnerability
                profile.
              </p>
              <Link href="/chat" className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1">
                Chat with Assistant <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3. Daily Routine */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Personalized Low-Emission Routine</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Four-block daily schedule tailored to students, office workers, remote workers, and families to avoid peak
                inversion hours.
              </p>
              <Link href="/routine" className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1">
                Build My Routine <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4. Indoor Air Quality */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Indoor Air Quality & DIY Purifiers</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Particle vs gas defense strategies, damp cleaning techniques, and affordable DIY Corsi-Rosenthal filter box
                blueprints.
              </p>
              <Link href="/indoor-quality" className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
                View Indoor Guide <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 5. Impact Calculator */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Sustainability Impact Calculator</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Empirical calculations of CO2 avoided, fuel conserved, vehicle trip reduction, and breathing-zone particulate
                prevention.
              </p>
              <Link href="/calculator" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                Calculate My Savings <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 6. Community Hub */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Family & Community Hub</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Protect vulnerable children and elderly family members, configure household ventilation, and share local smog
                alerts.
              </p>
              <Link href="/community" className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
                Join Community <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Take Control of Your Winter Air Quality Today
          </h2>
          <p className="text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Protect your lungs from toxic PM2.5 and make measurable environmental contributions in your everyday life.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow-lg hover:bg-emerald-50 transition-colors"
            >
              Open Air Quality Dashboard
            </Link>
            <Link
              href="/auth?mode=register"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm border border-emerald-400/40 transition-colors"
            >
              Create Free Family Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
