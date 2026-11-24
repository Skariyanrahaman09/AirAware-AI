import React from 'react';
import Link from 'next/link';
import { Wind, Heart, ShieldAlert, Leaf, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Wind className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                AirAware <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Empowering families, workers, and communities to protect respiratory health during severe winter smog and
              accelerate low-emission urban living.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wider uppercase text-[11px]">Navigation</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Air Quality Dashboard
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-emerald-400 transition-colors">
                  AI Environmental Assistant
                </Link>
              </li>
              <li>
                <Link href="/routine" className="hover:text-emerald-400 transition-colors">
                  Daily Routines
                </Link>
              </li>
              <li>
                <Link href="/indoor-quality" className="hover:text-emerald-400 transition-colors">
                  Indoor Air Quality & DIY Purifier
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-emerald-400 transition-colors">
                  Sustainability Calculator
                </Link>
              </li>
              <li>
                <Link href="/family" className="hover:text-emerald-400 transition-colors">
                  Family & Household Profile
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-emerald-400 transition-colors">
                  Community Awareness Board
                </Link>
              </li>
            </ul>
          </div>

          {/* Scientific Disclaimer */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wider uppercase text-[11px]">Scientific Transparency</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              AQI calculations adhere to EPA Standard PM2.5 Breakpoints. Carbon emission calculations are empirical estimates
              derived from IPCC and EPA transportation factors. Personal exposure reduction requires certified HEPA / N95
              filtration.
            </p>
          </div>

          {/* Emergency Notice */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wider uppercase text-[11px]">Health Advisory</h4>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span>Severe Smog Alert</span>
              </div>
              <p className="text-[11px] leading-normal text-slate-400">
                When AQI exceeds 200, vulnerable individuals (children, seniors, asthmatics) must avoid all outdoor physical
                exertion.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AirAware AI. Built for environmental health and community resilience.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Node.js / Express</span>
            <span>•</span>
            <span>Next.js & Tailwind</span>
            <span>•</span>
            <span>OpenAI GPT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
