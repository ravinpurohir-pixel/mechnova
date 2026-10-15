import React from 'react';
import {
  LayoutDashboard,
  Camera,
  Wrench,
  GraduationCap,
  Calculator,
  ClipboardList
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const { t } = useLanguage();

  const primaryItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'identify', label: 'Identify', icon: Camera },
    { id: 'troubleshoot', label: 'Solver', icon: Wrench },
    { id: 'study', label: 'Study', icon: GraduationCap },
    { id: 'calculator', label: 'Calc', icon: Calculator },
    { id: 'maintenance', label: 'Maint', icon: ClipboardList },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1F3B]/95 backdrop-blur-lg border-t border-navy-800 px-2 py-1 flex items-center justify-around select-none">
      {primaryItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              isActive ? 'text-cyan-accent font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-primary/20' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
