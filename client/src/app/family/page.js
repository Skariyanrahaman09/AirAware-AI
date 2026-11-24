'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAirData } from '../../context/AirDataContext';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  Heart,
  Baby,
  Activity,
  Home,
  Car,
  DollarSign,
  AlertTriangle,
  Save,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function FamilyProfilePage() {
  const { user, familyProfile, isAuthenticated, updateProfile, loading: authLoading } = useAuth();
  const { airData, selectedCity } = useAirData();

  const [householdName, setHouseholdName] = useState('My Household');
  const [memberCount, setMemberCount] = useState(4);
  const [hasChildren, setHasChildren] = useState(true);
  const [hasElderly, setHasElderly] = useState(false);
  const [hasAsthmaOrRespiratory, setHasAsthmaOrRespiratory] = useState(false);
  const [vulnerableNotes, setVulnerableNotes] = useState('');
  const [commuteType, setCommuteType] = useState('public_transit');
  const [dailyCommuteDistanceKm, setDailyCommuteDistanceKm] = useState(15);
  const [homeVentilation, setHomeVentilation] = useState('moderate');
  const [budgetLevel, setBudgetLevel] = useState('budget_conscious');
  const [indoorConcerns, setIndoorConcerns] = useState(['cooking_smoke', 'outdoor_smog_ingress']);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (familyProfile) {
      setHouseholdName(familyProfile.householdName || 'My Household');
      setMemberCount(familyProfile.memberCount || 4);
      setHasChildren(Boolean(familyProfile.hasChildren));
      setHasElderly(Boolean(familyProfile.hasElderly));
      setHasAsthmaOrRespiratory(Boolean(familyProfile.hasAsthmaOrRespiratory));
      setVulnerableNotes(familyProfile.vulnerableNotes || '');
      setCommuteType(familyProfile.commuteType || 'public_transit');
      setDailyCommuteDistanceKm(familyProfile.dailyCommuteDistanceKm || 15);
      setHomeVentilation(familyProfile.homeVentilation || 'moderate');
      setBudgetLevel(familyProfile.budgetLevel || 'budget_conscious');
      if (familyProfile.indoorConcerns) setIndoorConcerns(familyProfile.indoorConcerns);
    }
  }, [familyProfile]);

  const toggleConcern = (concern) => {
    if (indoorConcerns.includes(concern)) {
      setIndoorConcerns(indoorConcerns.filter((c) => c !== concern));
    } else {
      setIndoorConcerns([...indoorConcerns, concern]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateProfile({
        householdName,
        memberCount: Number(memberCount),
        hasChildren,
        hasElderly,
        hasAsthmaOrRespiratory,
        vulnerableNotes,
        commuteType,
        dailyCommuteDistanceKm: Number(dailyCommuteDistanceKm),
        homeVentilation,
        budgetLevel,
        indoorConcerns,
        city: airData?.city || selectedCity,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.warn('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Sign In to Save Your Household Profile</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Creating a household profile enables the AI Assistant and Daily Routine generator to personalize recommendations
          for children, elderly family members, and specific home ventilation constraints.
        </p>
        <div className="pt-2">
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <span>Sign In / Demo Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Family & Household Environmental Profile
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personalize air pollution defenses for vulnerable family members, home ventilation, and budget constraints.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Household Core */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Home className="w-4 h-4 text-emerald-600" />
            <span>Household Identity & Demographics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Household / Family Label</label>
              <input
                type="text"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                placeholder="e.g., The Jenkins Residence"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Family Members Living Together</label>
              <input
                type="number"
                min={1}
                max={20}
                value={memberCount}
                onChange={(e) => setMemberCount(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Vulnerable Family Members */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600" />
              <span>Vulnerable Household Members</span>
            </h3>
            <span className="text-[10px] text-slate-400">High sensitivity to winter smog</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                hasChildren ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <input
                type="checkbox"
                checked={hasChildren}
                onChange={(e) => setHasChildren(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="text-xs">Children / Infants</span>
            </label>

            <label
              className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                hasElderly ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <input
                type="checkbox"
                checked={hasElderly}
                onChange={(e) => setHasElderly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="text-xs">Elderly (Ages 65+)</span>
            </label>

            <label
              className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                hasAsthmaOrRespiratory ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <input
                type="checkbox"
                checked={hasAsthmaOrRespiratory}
                onChange={(e) => setHasAsthmaOrRespiratory(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="text-xs">Asthma / Cardiopulmonary</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Medical Notes / Specific Vulnerability Concerns
            </label>
            <textarea
              rows={2}
              value={vulnerableNotes}
              onChange={(e) => setVulnerableNotes(e.target.value)}
              placeholder="e.g. Toddler has mild wheezing during morning smog; grandparent takes blood pressure medication..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Card 3: Home Ventilation & Budget */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-teal-600" />
            <span>Home Infrastructure & Budget Strategy</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Home Sealing & Ventilation Quality</label>
              <select
                value={homeVentilation}
                onChange={(e) => setHomeVentilation(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="poor">Poor (Leaky windows, noticeable drafts, near major traffic artery)</option>
                <option value="moderate">Moderate (Standard windows, some gap seepage, suburban)</option>
                <option value="good">Good (Double-glazed airtight windows, weatherstripped doors)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Household Budget Preference</label>
              <select
                value={budgetLevel}
                onChange={(e) => setBudgetLevel(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="budget_conscious">Budget-Conscious (Prefer DIY filters, damp mopping, low-cost options)</option>
                <option value="moderate">Moderate (Affordable HEPA purifiers, essential equipment)</option>
                <option value="flexible">Flexible (High-end commercial purifiers, continuous sensor monitoring)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Primary Indoor Air Concerns</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'cooking_smoke', label: 'Cooking Smoke / NO2' },
                { id: 'outdoor_smog_ingress', label: 'Outdoor Smog Seepage' },
                { id: 'dust_pollen', label: 'Dust & Mites' },
                { id: 'pet_dander', label: 'Pet Dander' },
                { id: 'mold_humidity', label: 'Dampness / Mold' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => toggleConcern(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    indoorConcerns.includes(c.id)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Household Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
