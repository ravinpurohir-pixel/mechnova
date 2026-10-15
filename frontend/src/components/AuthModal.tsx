import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { X, Lock, Mail, User, Shield, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'reset';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, signup, loginAsGuest, isFirebaseLive } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('engineer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else if (mode === 'signup') {
        if (!displayName) {
          setError('Please enter your full name or title.');
          setLoading(false);
          return;
        }
        await signup(email, password, displayName, role);
        onClose();
      } else if (mode === 'reset') {
        setSuccessMsg(`Password reset instructions sent to ${email}`);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      await loginAsGuest();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-navy-900 border border-navy-700 max-w-md w-full rounded-2xl overflow-hidden shadow-2xl relative text-slate-100 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white p-1.5 rounded-lg bg-navy-800/60 hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-2 text-center flex flex-col items-center">
          {/* Enhanced Glowing MechNova Emblem Badge */}
          <div className="relative mb-3 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full scale-125" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-b from-navy-800 to-navy-950 border border-navy-700 shadow-glow-primary flex items-center justify-center p-2">
              <Logo size="lg" showText={false} />
            </div>
          </div>

          <div className="flex items-center justify-center tracking-tight mb-1">
            <span className="text-xl sm:text-2xl font-black text-white">Mech</span>
            <span className="text-xl sm:text-2xl font-black text-[#00A3FF]">Nova</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-100">
            {mode === 'login' && 'Sign In to MechNova'}
            {mode === 'signup' && 'Create MechNova Account'}
            {mode === 'reset' && 'Reset Engineering Password'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {isFirebaseLive ? (
              <span className="text-emerald-400 flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Connected to Firebase Authentication
              </span>
            ) : (
              <span className="text-cyan-accent flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Local Demo Mode active (Instant Access)
              </span>
            )}
          </p>
        </div>

        {error && (
          <div className="mx-6 my-2 p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 my-2 p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name / Engineer Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Rahul Patel"
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Engineering Discipline / Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-cyan-accent"
                >
                  <option value="student">Mechanical Engineering Student</option>
                  <option value="technician">Plant Maintenance Technician</option>
                  <option value="engineer">Senior Design & Reliability Engineer</option>
                  <option value="admin">Fleet & Operations Administrator</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@company.com"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-accent"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-[11px] text-cyan-accent hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-accent"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2.5 rounded-xl shadow-glow-primary transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>

          {/* Guest Mode Instant Demonstration */}
          <button
            type="button"
            onClick={handleGuest}
            disabled={loading}
            className="w-full bg-navy-800 hover:bg-navy-700 border border-navy-600 text-slate-200 text-xs font-medium py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-accent" />
            <span>Continue in Guest Mode (Instant Demo)</span>
          </button>

          {/* Toggle Login / Signup */}
          <div className="text-center pt-2 text-xs text-slate-400">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-cyan-accent font-semibold hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-cyan-accent font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
