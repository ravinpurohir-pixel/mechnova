import React from 'react';
import {
  LayoutDashboard,
  Camera,
  Wrench,
  GraduationCap,
  Calculator,
  ClipboardList,
  BookOpen,
  Bookmark,
  User,
  Shield,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenOnboarding: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, onOpenOnboarding }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'identify', label: t.partIdentifier, icon: Camera, badge: 'AI' },
    { id: 'troubleshoot', label: t.problemSolver, icon: Wrench, badge: 'NEW' },
    { id: 'study', label: t.studyAssistant, icon: GraduationCap },
    { id: 'calculator', label: t.calculator, icon: Calculator },
    { id: 'maintenance', label: t.maintenance, icon: ClipboardList },
    { id: 'knowledge', label: t.knowledgeLibrary, icon: BookOpen },
    { id: 'saved', label: t.savedResults, icon: Bookmark },
    { id: 'profile', label: t.profile, icon: User },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: t.adminDashboard, icon: Shield }] : [])
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0B1F3B] border-r border-navy-800 text-slate-300 h-screen sticky top-0 shrink-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-navy-800 flex items-center justify-between">
        <Logo size="md" />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-navy-700">
        <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-300 uppercase">
          Engineering Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-glow-primary font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-cyan-accent'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-cyan-accent/15 border border-cyan-accent/30 text-cyan-accent'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Safety & App Tour Footer Banner */}
      <div className="p-3 border-t border-navy-800 bg-navy-950/60">
        <button
          onClick={onOpenOnboarding}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-navy-800/70 hover:bg-navy-800 border border-navy-700 text-xs text-slate-300 hover:text-white transition-all cursor-pointer mb-2"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-accent" />
          <span>Quick App Tour</span>
        </button>

        <div className="flex items-center justify-between text-[10px] text-slate-300 px-1 font-mono">
          <span>MECHNOVA v1.0</span>
          <span className="text-emerald-400 flex items-center gap-1">● ONLINE</span>
        </div>
      </div>
    </aside>
  );
};
