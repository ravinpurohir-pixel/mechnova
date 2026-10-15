import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';
import { ApiService } from '../services/api';
import {
  Search,
  Globe,
  User as UserIcon,
  ShieldAlert,
  Wifi,
  WifiOff,
  LogOut,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onSearch: (query: string) => void;
  onOpenAuth: () => void;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onOpenAuth, onSelectTab }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Check backend health periodically
    ApiService.checkHealth().then((ok) => setIsOnline(ok));
    const interval = setInterval(() => {
      ApiService.checkHealth().then((ok) => setIsOnline(ok));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#0B1F3B]/90 backdrop-blur-md border-b border-navy-800 px-4 py-3 flex items-center justify-between gap-4">
      {/* Mobile Logo display */}
      <div className="md:hidden flex items-center">
        <Logo size="sm" />
      </div>

      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative hidden sm:block">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-navy-950/80 border border-navy-700 hover:border-navy-600 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent transition-all"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Backend Connectivity Status Indicator */}
        <div
          title={isOnline ? 'FastAPI Backend Online' : 'Backend Starting / Standalone Mode'}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border bg-navy-950 border-navy-800 text-slate-300"
        >
          {isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden xl:inline text-emerald-400 font-semibold">API LIVE</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="hidden xl:inline text-amber-400 font-semibold">STANDALONE</span>
            </>
          )}
        </div>

        {/* LOTO Safety Protocol Fast Shortcut */}
        <button
          onClick={() => onSelectTab('troubleshoot')}
          title="OSHA Lockout / Tagout Energy Isolation Advisory"
          className="flex items-center gap-1 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden lg:inline">LOTO Safety</span>
        </button>

        {/* Multilingual Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 bg-navy-800 hover:bg-navy-700 border border-navy-700 px-2.5 py-1.5 rounded-xl text-xs text-slate-200 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-accent" />
            <span className="font-semibold uppercase">{language}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-navy-900 border border-navy-700 rounded-xl shadow-xl overflow-hidden py-1 z-50">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                    language === l.code
                      ? 'bg-primary text-white font-bold'
                      : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                  }`}
                >
                  <span>{l.native}</span>
                  <span className="text-[10px] opacity-75 font-mono">{l.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Account / Profile */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 border border-navy-700 px-3 py-1.5 rounded-xl text-xs text-white transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-primary to-cyan-accent flex items-center justify-center text-[10px] font-bold text-navy-950">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium max-w-[100px] truncate hidden sm:inline">
                {user.displayName}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-navy-900 border border-navy-700 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                <div className="px-3 py-2 border-b border-navy-800 text-[11px]">
                  <p className="font-bold text-white truncate">{user.displayName}</p>
                  <p className="text-slate-400 text-[10px] truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[9px] bg-cyan-accent/15 text-cyan-accent px-1.5 py-0.5 rounded font-bold uppercase">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onSelectTab('profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-navy-800 hover:text-white flex items-center gap-2"
                >
                  <UserIcon className="w-3.5 h-3.5 text-cyan-accent" />
                  <span>My Engineering Profile</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10 flex items-center gap-2 border-t border-navy-800"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 py-1.5 rounded-xl shadow-glow-primary transition-all cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
