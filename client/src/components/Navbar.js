'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useAirData } from '../context/AirDataContext';
import {
  Wind,
  Home,
  Activity,
  Bot,
  CalendarCheck,
  ShieldAlert,
  Calculator,
  Users,
  MessageSquare,
  Menu,
  X,
  LogOut,
  User,
  Compass,
  Radio,
  RefreshCw,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const {
    airData,
    selectedCity,
    isRealTimeGps,
    enableRealTimeGps,
    isLivePolling,
    toggleLivePolling,
    pollingSecondsLeft,
    loading,
  } = useAirData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: Activity },
    { name: 'AI Assistant', href: '/chat', icon: Bot, highlight: true },
    { name: 'Daily Routines', href: '/routine', icon: CalendarCheck },
    { name: 'Indoor Air', href: '/indoor-quality', icon: ShieldAlert },
    { name: 'Impact Calc', href: '/calculator', icon: Calculator },
    { name: 'Family Profile', href: '/family', icon: Users },
    { name: 'Community', href: '/community', icon: MessageSquare },
  ];

  const getAqiColor = (aqi) => {
    if (!aqi) return 'bg-slate-200 text-slate-700';
    if (aqi <= 50) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (aqi <= 100) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (aqi <= 150) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (aqi <= 200) return 'bg-red-100 text-red-800 border-red-300';
    if (aqi <= 300) return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-rose-950 text-rose-100 border-rose-800';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Wind className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-teal-800 bg-clip-text text-transparent">
                  AirAware <span className="text-emerald-500 font-extrabold">AI</span>
                </span>
                <span className="hidden xl:block text-[9px] text-slate-500 uppercase tracking-widest font-semibold">
                  Global Smog Assistant
                </span>
              </div>
            </Link>

            {/* Quick Live AQI Badge with Real-Time GPS Button */}
            {airData && (
              <div className="hidden md:flex items-center gap-1.5">
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border hover:opacity-90 transition-opacity ${getAqiColor(
                    airData.aqi
                  )}`}
                  title="Click to view full Air Quality Dashboard"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                  </span>
                  <span className="truncate max-w-[150px]">
                    {airData.city}: <strong>{airData.aqi} AQI</strong>
                  </span>
                  {isRealTimeGps && (
                    <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded text-[9px] font-extrabold uppercase">
                      GPS Live
                    </span>
                  )}
                </Link>

                <button
                  onClick={enableRealTimeGps}
                  title="Detect My Live GPS Location"
                  className={`p-1.5 rounded-full border text-xs font-bold transition-all ${
                    isRealTimeGps
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white hover:bg-emerald-50 text-slate-600 border-slate-200 hover:text-emerald-700'
                  }`}
                >
                  <Compass className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1 px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-bold shadow-xs border border-emerald-100'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100/70'
                  } ${item.highlight ? 'text-emerald-700 font-semibold' : ''}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                  {item.highlight && (
                    <span className="inline-flex items-center px-1 py-0.2 text-[8px] font-extrabold bg-emerald-600 text-white rounded-full ml-0.5">
                      AI
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Auth Section */}
          <div className="hidden sm:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/family"
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{user?.name?.split(' ')[0] || 'My Profile'}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth"
                  className="text-xs font-semibold text-slate-700 hover:text-emerald-600 px-2.5 py-1.5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?mode=register"
                  className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs px-3.5 py-1.5 rounded-lg transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {airData && (
            <div className="flex items-center gap-2 mb-3">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex-1 p-2.5 rounded-lg text-xs font-semibold border ${getAqiColor(airData.aqi)}`}
              >
                Station: {airData.city} – {airData.aqi} AQI ({airData.severity})
              </Link>
              <button
                onClick={() => {
                  enableRealTimeGps();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shrink-0"
              >
                <Compass className="w-4 h-4" /> GPS
              </button>
            </div>
          )}

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                <span>{item.name}</span>
                {item.highlight && (
                  <span className="ml-auto px-1.5 py-0.2 text-[9px] font-bold bg-emerald-600 text-white rounded-full">
                    AI
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-semibold text-slate-800">{user?.name}</span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 text-xs text-rose-600 hover:underline font-semibold"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?mode=register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
