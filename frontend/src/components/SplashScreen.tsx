import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { Cpu, ShieldCheck, Wrench, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1F3B] flex flex-col items-center justify-center p-6 text-white selection:bg-cyan-accent">
      {/* Background Engineering Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#163868_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-64 h-64 bg-cyan-accent/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Animated MechNova Logo */}
        <div className="mb-6 animate-pulse">
          <Logo size="xl" showText={false} animated={true} />
        </div>

        <div className="flex items-center justify-center tracking-tight mb-1">
          <span className="text-3xl sm:text-4xl font-black text-white">Mech</span>
          <span className="text-3xl sm:text-4xl font-black text-[#00A3FF]">Nova</span>
        </div>
        <p className="text-sm font-medium text-slate-300 tracking-normal mb-1">
          Intelligence for Every Machine
        </p>
        <p className="text-xs text-cyan-accent mb-8 font-gujarati">
          તમારો સ્માર્ટ મિકેનિકલ સહાયક
        </p>

        {/* Feature Highlights Pills */}
        <div className="grid grid-cols-2 gap-2 w-full mb-8 text-xs text-slate-200">
          <div className="flex items-center gap-2 bg-navy-800/80 border border-navy-700 rounded-lg px-3 py-2">
            <Cpu className="w-4 h-4 text-cyan-accent shrink-0" />
            <span className="truncate">AI Part Vision</span>
          </div>
          <div className="flex items-center gap-2 bg-navy-800/80 border border-navy-700 rounded-lg px-3 py-2">
            <Wrench className="w-4 h-4 text-cyan-accent shrink-0" />
            <span className="truncate">Troubleshooter</span>
          </div>
          <div className="flex items-center gap-2 bg-navy-800/80 border border-navy-700 rounded-lg px-3 py-2">
            <Sparkles className="w-4 h-4 text-cyan-accent shrink-0" />
            <span className="truncate">3 Languages</span>
          </div>
          <div className="flex items-center gap-2 bg-navy-800/80 border border-navy-700 rounded-lg px-3 py-2">
            <ShieldCheck className="w-4 h-4 text-cyan-accent shrink-0" />
            <span className="truncate">LOTO Safety</span>
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-full bg-navy-800 rounded-full h-2 mb-3 overflow-hidden border border-navy-700">
          <div
            className="bg-gradient-to-r from-primary to-cyan-accent h-full transition-all duration-100 ease-out shadow-glow-cyan"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between w-full text-[11px] text-slate-400 font-mono">
          <span>INITIALIZING CALC ENGINE...</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};
