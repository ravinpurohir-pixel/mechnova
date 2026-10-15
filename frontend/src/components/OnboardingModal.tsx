import React, { useState } from 'react';
import { Camera, Wrench, GraduationCap, Calculator, ClipboardList, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      icon: Camera,
      title: 'AI Mechanical Part Identification',
      guTitle: 'મિકેનિકલ પાર્ટ્સ ઓળખો',
      desc: 'Snap or upload a photo of any gear, bearing, shaft, pump, valve, or fastener. MechNova extracts features, estimates likely materials, applications, failure modes, and safety checks.',
      color: 'from-blue-600 to-cyan-500',
    },
    {
      icon: Wrench,
      title: 'Intelligent Problem Solver & LOTO Safety',
      guTitle: 'AI સમસ્યા નિવારણ અને સુરક્ષા',
      desc: 'Select machinery and symptoms for immediate diagnostic root-cause ranking, step-by-step checks, required tools, and mandatory Lockout/Tagout (LOTO) energy isolation instructions.',
      color: 'from-cyan-500 to-teal-400',
    },
    {
      icon: GraduationCap,
      title: 'Multilingual Study Assistant',
      guTitle: 'ત્રણ ભાષાઓમાં અભ્યાસ સહાયક',
      desc: 'Master 10 core mechanical engineering subjects in English, Gujarati, and Hindi. Get worked numerical steps, exam formulas, 5-mark & 10-mark university formats, and MCQs.',
      color: 'from-indigo-600 to-primary',
    },
    {
      icon: Calculator,
      title: 'Verified Engineering Calculators',
      guTitle: 'ચોક્કસ એન્જિનિયરિંગ ગણતરીઓ',
      desc: 'Perform stress/strain, torque & power, gear ratio, Carnot efficiency, and fluid flow calculations with complete formula derivations, assumptions, and units.',
      color: 'from-primary to-blue-400',
    },
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('mechnova_onboarding_completed', 'true');
      onClose();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('mechnova_onboarding_completed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-navy-900 border border-navy-700 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Step Banner */}
        <div className={`p-8 bg-gradient-to-r ${step.color} text-white flex flex-col items-center text-center relative`}>
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-xs font-semibold bg-black/25 hover:bg-black/40 px-3 py-1 rounded-full text-white/90 transition-colors"
          >
            Skip Tour
          </button>
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-4 shadow-lg">
            <StepIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1">{step.title}</h2>
          <p className="text-xs font-medium text-white/90 font-gujarati">{step.guTitle}</p>
        </div>

        {/* Content Body */}
        <div className="p-6 text-slate-200 flex-1 flex flex-col justify-between">
          <p className="text-sm leading-relaxed text-slate-300 mb-6">{step.desc}</p>

          {/* Dots Indicator */}
          <div className="flex items-center justify-between pt-4 border-t border-navy-800">
            <div className="flex gap-1.5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentStep ? 'w-6 bg-cyan-accent' : 'w-2 bg-navy-700'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-glow-primary transition-all cursor-pointer"
              >
                <span>{currentStep === steps.length - 1 ? 'Start Engineering' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
