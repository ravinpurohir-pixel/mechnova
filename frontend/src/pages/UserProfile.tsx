import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Language, UserRole } from '../types';
import {
  User,
  Mail,
  Shield,
  Globe,
  Building,
  Check,
  Save,
  LogOut,
  Sparkles,
  Camera,
  Activity
} from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, updateUser, logout, isFirebaseLive } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [organization, setOrganization] = useState(user?.organization || 'Gujarat Mechanical Tech Hub');
  const [role, setRole] = useState<UserRole>(user?.role || 'engineer');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      displayName,
      organization,
      role
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="border-b border-navy-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-white">Engineering User Profile</h1>
        <p className="text-xs text-slate-300 mt-1">
          Manage your mechanical engineering credentials, preferred language, and organization workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Card (Left) */}
        <div className="md:col-span-4 bg-navy-900 border border-navy-700 rounded-2xl p-6 shadow-card-soft text-center flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-cyan-accent flex items-center justify-center text-3xl font-black text-navy-950 shadow-glow-primary">
              {displayName.charAt(0).toUpperCase() || 'M'}
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-navy-800 border-2 border-navy-900 flex items-center justify-center text-cyan-accent">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          <h2 className="text-lg font-bold text-white">{displayName || 'Mechanical Engineer'}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email || 'guest@mechnova.io'}</p>

          <span className="inline-block mt-3 text-xs bg-cyan-accent/15 border border-cyan-accent/30 text-cyan-accent px-3 py-1 rounded-full font-bold uppercase tracking-wide">
            {role}
          </span>

          <div className="w-full mt-6 pt-6 border-t border-navy-800 space-y-2 text-xs text-left">
            <div className="flex justify-between text-slate-400">
              <span>Authentication:</span>
              <span className="text-white font-semibold">
                {isFirebaseLive ? 'Firebase Auth' : 'Demo Local Mode'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Account Status:</span>
              <span className="text-emerald-400 font-semibold">Active & Certified</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full mt-6 bg-navy-950 hover:bg-rose-500/10 border border-navy-800 hover:border-rose-500/30 text-rose-300 text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>

        {/* Edit Form (Right) */}
        <div className="md:col-span-8 bg-navy-900 border border-navy-700 rounded-2xl p-6 shadow-card-soft">
          <h3 className="text-sm font-bold text-white mb-4">Edit Profile & Preferences</h3>

          {savedSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Profile settings saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Organization / University</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Engineering Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent"
                >
                  <option value="student">Mechanical Engineering Student</option>
                  <option value="technician">Plant Maintenance Technician</option>
                  <option value="engineer">Senior Design & Reliability Engineer</option>
                  <option value="admin">Operations & Fleet Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Preferred Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent"
                >
                  <option value="en">English (US/UK)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white font-bold px-5 py-2.5 rounded-xl shadow-glow-primary transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
