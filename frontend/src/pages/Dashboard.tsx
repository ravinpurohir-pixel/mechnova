import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Camera,
  Wrench,
  GraduationCap,
  Calculator,
  ClipboardList,
  BookOpen,
  Bookmark,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

interface DashboardProps {
  onSelectTab: (tab: string) => void;
  onOpenOnboarding: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectTab, onOpenOnboarding }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const quickActionCards = [
    {
      id: 'identify',
      title: 'AI Part Identification',
      guTitle: 'મિકેનિકલ પાર્ટ ઓળખો',
      desc: 'Analyze bearings, gears, shafts, pumps, valves, and fasteners with computer vision.',
      icon: Camera,
      badge: 'Vision AI',
      color: 'from-blue-600 to-cyan-500',
      glow: 'shadow-glow-cyan'
    },
    {
      id: 'troubleshoot',
      title: 'AI Problem Solver',
      guTitle: 'સમસ્યા નિવારણ & LOTO',
      desc: 'Diagnose equipment vibration, noise, overheating, and leakage with root-cause ranking.',
      icon: Wrench,
      badge: 'Diagnostics',
      color: 'from-cyan-500 to-teal-500',
      glow: 'shadow-glow-cyan'
    },
    {
      id: 'study',
      title: 'Study Assistant',
      guTitle: 'એન્જિનિયરિંગ અભ્યાસ',
      desc: '10 core mechanical engineering subjects with formulas, numericals, 5/10 mark exam guides.',
      icon: GraduationCap,
      badge: '3 Languages',
      color: 'from-indigo-600 to-primary',
      glow: 'shadow-glow-primary'
    },
    {
      id: 'calculator',
      title: 'Engineering Calculator',
      guTitle: 'ચોક્કસ ગણતરીઓ',
      desc: 'Calculate stress, Youngs modulus, gear ratios, torque/power, Carnot efficiency.',
      icon: Calculator,
      badge: '12 Calculators',
      color: 'from-primary to-blue-500',
      glow: 'shadow-glow-primary'
    },
    {
      id: 'maintenance',
      title: 'Maintenance Records',
      guTitle: 'મેન્ટેનન્સ રેકોર્ડ્સ',
      desc: 'Log equipment maintenance, repair dates, costs, replacement parts, and service schedules.',
      icon: ClipboardList,
      badge: 'Fleet Log',
      color: 'from-sky-600 to-cyan-600',
      glow: 'shadow-glow-cyan'
    },
    {
      id: 'knowledge',
      title: 'Machine Knowledge Library',
      guTitle: 'મશીન જ્ઞાન ભંડાર',
      desc: 'Authoritative engineering standards (ISO, AGMA, ASME, OSHA) and component guides.',
      icon: BookOpen,
      badge: 'Standards',
      color: 'from-slate-700 to-navy-800',
      glow: ''
    },
  ];

  const recentActivities = [
    {
      type: 'part',
      title: 'Deep Groove Ball Bearing (6208 ZZ)',
      sub: 'Rotary Anti-Friction Elements • 92% Confidence',
      time: '12 mins ago',
      status: 'Verified'
    },
    {
      type: 'troubleshoot',
      title: 'Centrifugal Pump Impeller Cavitation',
      sub: 'NPSH Margin Check & Seal Inspection • High Priority',
      time: '1 hour ago',
      status: 'LOTO Advised'
    },
    {
      type: 'calc',
      title: 'Torsional Shear Stress in 45mm Shaft',
      sub: 'Torque: 350 N·m • Max Shear: 19.5 MPa',
      time: '3 hours ago',
      status: 'Calculated'
    },
    {
      type: 'study',
      title: 'First Law of Thermodynamics (SFEE)',
      sub: 'Rankine Cycle Turbine Derivation • Gujarati Mode',
      time: 'Yesterday',
      status: 'Completed'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 border border-navy-700 p-6 sm:p-8 shadow-card-soft">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-primary/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>MechNova AI Mechanical Suite 1.0</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Welcome back,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-accent to-white">
                {user?.displayName || 'Engineer'}
              </span>
            </h1>

            <p className="text-sm text-cyan-accent font-gujarati font-medium mb-2">
              {t.tagline}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your comprehensive assistant for industrial machine diagnostics, mechanical part computer vision, precision university engineering curriculum, and certified calculations.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectTab('identify')}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-cyan-muted hover:from-primary-hover hover:to-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-glow-primary transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Analyze Mechanical Part</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onSelectTab('troubleshoot')}
                className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 border border-navy-600 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-cyan-accent" />
                <span>Troubleshoot Machine</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-navy-950/70 border border-navy-700/80 rounded-2xl p-4 text-center">
              <span className="text-xs text-slate-400 font-medium">Equipments Monitored</span>
              <p className="text-2xl font-black text-cyan-accent mt-1">24 Units</p>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" /> 96% Operational
              </span>
            </div>

            <div className="bg-navy-950/70 border border-navy-700/80 rounded-2xl p-4 text-center">
              <span className="text-xs text-slate-400 font-medium">Diagnostics Saved</span>
              <p className="text-2xl font-black text-white mt-1">{user?.savedCount || 5}</p>
              <span className="text-[10px] text-cyan-accent font-medium flex items-center justify-center gap-1 mt-1">
                <Activity className="w-3 h-3" /> Ready in History
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-200 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">OSHA 1910.147 Compliance Reminder: </span>
          Always isolate all electrical, pneumatic, and hydraulic energy sources (Lockout/Tagout) and verify zero-energy state prior to conducting mechanical inspections or removing safety guards.
        </div>
      </div>

      {/* Main 6 Module Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-accent" />
            <span>{t.quickActions}</span>
          </h2>
          <span className="text-xs text-slate-400">8 Modules Available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onSelectTab(card.id)}
                className="group relative bg-navy-900 hover:bg-navy-800/90 border border-navy-700 hover:border-cyan-accent/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-card-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-navy-800 border border-navy-700 text-cyan-accent">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-accent transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-cyan-accent/90 font-gujarati font-medium mt-0.5 mb-2">
                    {card.guTitle}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-navy-800 flex items-center justify-between text-xs font-semibold text-cyan-accent">
                  <span>Open Module</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Section: Recent Activities & Fast Calculators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-navy-900 border border-navy-700 rounded-2xl p-5 shadow-card-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-accent" />
              <span>{t.recentActivity}</span>
            </h3>
            <button
              onClick={() => onSelectTab('saved')}
              className="text-xs text-cyan-accent hover:underline font-semibold"
            >
              View All History
            </button>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act, index) => (
              <div
                key={index}
                className="bg-navy-950/60 border border-navy-800 hover:border-navy-700 rounded-xl p-3 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-cyan-accent shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{act.title}</h4>
                    <p className="text-[11px] text-slate-400">{act.sub}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-accent/10 text-cyan-accent border border-cyan-accent/30">
                    {act.status}
                  </span>
                  <div className="text-[10px] text-slate-300 mt-1 flex items-center gap-1 justify-end font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{act.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Engineering Formula Shortcut */}
        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-5 shadow-card-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-accent" />
                <span>Quick Formulas</span>
              </h3>
              <span className="text-[10px] text-slate-300 font-mono">SI UNITS</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800">
                <div className="text-[11px] font-semibold text-slate-300">Normal Stress (σ)</div>
                <div className="text-cyan-accent font-mono font-bold mt-0.5">σ = Force / Area [MPa]</div>
              </div>

              <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800">
                <div className="text-[11px] font-semibold text-slate-300">Shaft Torque & Power</div>
                <div className="text-cyan-accent font-mono font-bold mt-0.5">P = (2π · N · T) / 60,000 [kW]</div>
              </div>

              <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800">
                <div className="text-[11px] font-semibold text-slate-300">Gear Ratio (i)</div>
                <div className="text-cyan-accent font-mono font-bold mt-0.5">i = Z₂ / Z₁ = N₁ / N₂</div>
              </div>

              <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800">
                <div className="text-[11px] font-semibold text-slate-300">Carnot Thermal Efficiency</div>
                <div className="text-cyan-accent font-mono font-bold mt-0.5">η = 1 - (T_cold / T_hot)</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('calculator')}
            className="w-full mt-4 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 rounded-xl shadow-glow-primary transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Open All 12 Calculators</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
