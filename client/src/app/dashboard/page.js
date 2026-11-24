'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAirData } from '../../context/AirDataContext';
import AqiGauge from '../../components/AqiGauge';
import AqiBadge from '../../components/AqiBadge';
import {
  Search,
  MapPin,
  RefreshCw,
  Compass,
  Wind,
  Thermometer,
  ShieldAlert,
  AlertTriangle,
  Info,
  Calendar,
  Activity,
  CheckCircle2,
  Radio,
  Clock,
  Globe2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const {
    airData,
    forecast,
    loading,
    error,
    selectedCity,
    coordinates,
    changeCity,
    enableRealTimeGps,
    isRealTimeGps,
    isLivePolling,
    toggleLivePolling,
    pollingSecondsLeft,
    lastRefreshedAt,
    searchCities,
    refreshAirQuality,
  } = useAirData();

  const [cityInput, setCityInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('india'); // 'india' | 'smog_hotspots' | 'world'

  const searchContainerRef = useRef(null);

  const majorIndianCities = [
    'Delhi', 'Kolkata', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad',
    'Lucknow', 'Patna', 'Ahmedabad', 'Jaipur', 'Varanasi', 'Chandigarh', 'Pune'
  ];

  const globalSmogHotspots = [
    'Lahore', 'Dhaka', 'Kathmandu', 'Beijing', 'Hanoi', 'Cairo', 'Jakarta', 'Bangkok'
  ];

  const worldMetros = [
    'New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Los Angeles', 'Singapore', 'Berlin'
  ];

  // Handle autocomplete input changes
  useEffect(() => {
    if (!cityInput.trim() || cityInput.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await searchCities(cityInput);
      setSuggestions(results || []);
    }, 200);

    return () => clearTimeout(timer);
  }, [cityInput, searchCities]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      changeCity(cityInput.trim());
      setCityInput('');
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (cityItem) => {
    changeCity(cityItem.city, { lat: cityItem.lat, lon: cityItem.lon });
    setCityInput('');
    setShowSuggestions(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Real-Time Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Real-Time Global Air Quality Station
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Live worldwide particulate matter (PM2.5, PM10) and gaseous pollutant measurements.
          </p>
        </div>

        {/* Real-Time Live Mode Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Autocomplete City Search */}
          <div ref={searchContainerRef} className="relative flex-1 md:w-64">
            <form onSubmit={handleCitySubmit}>
              <input
                type="text"
                value={cityInput}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setCityInput(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search any city worldwide..."
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden divide-y divide-slate-100 text-xs">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-emerald-50 transition-colors"
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

          {/* GPS Location Button */}
          <button
            onClick={enableRealTimeGps}
            title="Detect My Live GPS Location"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
              isRealTimeGps
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-300 hover:text-emerald-700'
            }`}
          >
            <Compass className={`w-4 h-4 ${loading ? 'animate-spin' : isRealTimeGps ? 'animate-pulse' : 'text-emerald-600'}`} />
            <span>{isRealTimeGps ? 'GPS Active' : 'Live GPS'}</span>
          </button>

          {/* Real-time Polling Toggle */}
          <button
            onClick={toggleLivePolling}
            title={isLivePolling ? 'Real-Time Auto-Refresh Active (30s)' : 'Real-Time Auto-Refresh Paused'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isLivePolling
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-300 text-slate-600'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {isLivePolling && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLivePolling ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
            </span>
            <span className="hidden sm:inline">{isLivePolling ? `Live (${pollingSecondsLeft}s)` : 'Live Paused'}</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={refreshAirQuality}
            disabled={loading}
            title="Refresh Station Data Now"
            className="p-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Real-Time Live Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 text-white text-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold tracking-wide">
            {isRealTimeGps ? 'DEVICE GPS STREAM' : 'LIVE REGIONAL FEED'}:
          </span>
          <span className="text-slate-300">
            {airData?.city || selectedCity} {airData?.country && `(${airData.country})`}
          </span>
          {coordinates?.lat && coordinates?.lon && (
            <span className="hidden sm:inline text-slate-500 text-[11px]">
              [{Number(coordinates.lat).toFixed(3)}°N, {Number(coordinates.lon).toFixed(3)}°E]
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          {lastRefreshedAt && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Updated: {lastRefreshedAt.toLocaleTimeString()}</span>
            </span>
          )}
          <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-extrabold uppercase text-[10px]">
            {airData?.isLive ? 'Active Sensor API' : 'Calibrated Regional'}
          </span>
        </div>
      </div>

      {/* Global & Indian Quick Switcher Tabs */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('india')}
            className={`pb-1 px-2 border-b-2 transition-colors ${
              activeTab === 'india'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🇮🇳 Major Indian Cities
          </button>
          <button
            onClick={() => setActiveTab('smog_hotspots')}
            className={`pb-1 px-2 border-b-2 transition-colors ${
              activeTab === 'smog_hotspots'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🌏 Winter Smog Hotspots
          </button>
          <button
            onClick={() => setActiveTab('world')}
            className={`pb-1 px-2 border-b-2 transition-colors ${
              activeTab === 'world'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🏙️ Global Metros
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {(activeTab === 'india'
            ? majorIndianCities
            : activeTab === 'smog_hotspots'
            ? globalSmogHotspots
            : worldMetros
          ).map((city) => (
            <button
              key={city}
              onClick={() => changeCity(city)}
              className={`px-3 py-1 rounded-full border transition-all shrink-0 ${
                selectedCity.toLowerCase() === city.toLowerCase()
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Error state alert with retry */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={refreshAirQuality}
            className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg text-xs hover:bg-rose-700"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Skeleton Loading State */}
      {loading && !airData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 h-96 flex flex-col justify-center items-center">
            <div className="w-32 h-32 rounded-full bg-slate-200 mb-4" />
            <div className="w-24 h-4 bg-slate-200 rounded" />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 h-44" />
            <div className="bg-white p-6 rounded-3xl border border-slate-200 h-44" />
          </div>
        </div>
      )}

      {/* Main Grid: Gauge, Key Pollutants, Weather */}
      {airData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Gauge Card (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{airData.country || 'Global Location'}</span>
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  {airData.city || selectedCity}
                </h2>
              </div>
              <AqiBadge aqi={airData.aqi} severity={airData.severity} size="sm" />
            </div>

            <div className="my-4">
              <AqiGauge
                aqi={airData.aqi}
                severity={airData.severity}
                category={airData.category}
                color={airData.color}
              />
            </div>

            {/* Health guidance card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
                <span>Health Guidance & Exposure Advisory</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{airData.healthGuidance}</p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span
                  className={`px-2 py-0.5 rounded-md font-semibold ${
                    airData.maskRecommended ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  Mask: {airData.maskRecommended ? 'N95 Respirator Required' : 'Not Required'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md font-semibold ${
                    airData.purifierRecommended ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  Indoor Purifier: {airData.purifierRecommended ? 'Recommended' : 'Optional'}
                </span>
              </div>
            </div>
          </div>

          {/* Pollutants & Weather Breakdown (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Detailed Pollutants Grid */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Wind className="w-5 h-5 text-emerald-600" />
                  <span>Pollutant Concentration Breakdown</span>
                </h3>
                <span className="text-[11px] text-slate-400">Micrograms per cubic meter (µg/m³)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* PM2.5 */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50/50 to-white border border-rose-200/80">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>PM2.5</span>
                    <span className="text-[10px] text-rose-600 bg-rose-100 px-1.5 py-0.2 rounded font-extrabold">Primary</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {airData.pollutants?.pm25 ?? 'N/A'}{' '}
                    <span className="text-xs font-normal text-slate-500">µg/m³</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Fine inhalable particles penetrating deep into lungs.</p>
                </div>

                {/* PM10 */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/50 to-white border border-amber-200/80">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>PM10</span>
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-extrabold">Dust</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {airData.pollutants?.pm10 ?? 'N/A'}{' '}
                    <span className="text-xs font-normal text-slate-500">µg/m³</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Coarser dust, road grit, and construction debris.</p>
                </div>

                {/* NO2 */}
                <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 mb-1">NO2 (Nitrogen Dioxide)</div>
                  <div className="text-xl font-black text-slate-900">
                    {airData.pollutants?.no2 ?? 'N/A'}{' '}
                    <span className="text-xs font-normal text-slate-500">µg/m³</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Vehicular combustion gas; causes airway inflammation.</p>
                </div>

                {/* CO */}
                <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 mb-1">CO (Carbon Monoxide)</div>
                  <div className="text-xl font-black text-slate-900">
                    {airData.pollutants?.co ?? 'N/A'}{' '}
                    <span className="text-xs font-normal text-slate-500">µg/m³</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Toxic gas from incomplete vehicle fuel burning.</p>
                </div>

                {/* SO2 */}
                <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 mb-1">SO2 (Sulfur Dioxide)</div>
                  <div className="text-xl font-black text-slate-900">
                    {airData.pollutants?.so2 ?? 'N/A'}{' '}
                    <span className="text-xs font-normal text-slate-500">µg/m³</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Power plants & coal burning byproduct.</p>
                </div>

                {/* O3 */}
                <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 mb-1">O3 (Ground Ozone)</div>
                  <div className="text-xl font-black text-slate-900">
                    {airData.pollutants?.o3 ?? 'N/A'}{' '}
                    <span className="text-xs font-normal text-slate-500">µg/m³</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Secondary smog created by sunlight and emissions.</p>
                </div>
              </div>
            </div>

            {/* Meteorological & Atmospheric Inversion Conditions */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-teal-600" />
                <span>Winter Meteorological Conditions</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Temperature</div>
                  <div className="text-xl font-black text-slate-800 mt-1">{airData.weather?.temperature}°C</div>
                  <span className="text-[10px] text-slate-500">Ground Level</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Humidity</div>
                  <div className="text-xl font-black text-slate-800 mt-1">{airData.weather?.humidity}%</div>
                  <span className="text-[10px] text-slate-500">Moisture Index</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Wind Speed</div>
                  <div className="text-xl font-black text-slate-800 mt-1">{airData.weather?.windSpeedKmH} km/h</div>
                  <span className="text-[10px] text-slate-500">Dispersion Factor</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Condition</div>
                  <div className="text-sm font-bold text-slate-800 mt-1 truncate">{airData.weather?.condition}</div>
                  <span className="text-[10px] text-slate-500">Atmospheric</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 24-Hour Hourly Trend Chart */}
      {airData && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>24-Hour Hourly AQI & PM2.5 Curve in {airData.city}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Hourly tracking of peak ground inversion spikes and midday dispersion windows.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                AQI Trend
              </span>
              <span className="flex items-center gap-1.5 text-rose-700">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                PM2.5 (µg/m³)
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {airData.hourlyTrends && airData.hourlyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={airData.hourlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="pmGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Area type="monotone" dataKey="aqi" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#aqiGrad)" name="AQI" />
                  <Area type="monotone" dataKey="pm25" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#pmGrad)" name="PM2.5" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">Loading hourly trend chart...</div>
            )}
          </div>
        </div>
      )}

      {/* 5-Day Environmental Forecast */}
      {forecast && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>5-Day Predictive Smog & Weather Forecast for {airData.city}</span>
              </h3>
              <p className="text-xs text-slate-500">Plan upcoming weekly commutes and outdoor engagements.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
            {forecast.forecastDays?.map((day, idx) => (
              <div
                key={day.day || idx}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-800">{day.day}</span>
                  <span className="text-xs text-slate-500 font-semibold">{day.temp}°C</span>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-black text-slate-900">{day.aqi} AQI</div>
                  <div
                    className="text-xs font-bold truncate"
                    style={{ color: day.color || '#10B981' }}
                  >
                    {day.severity}
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed pt-2 border-t border-slate-200/60">
                  {day.advice}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
