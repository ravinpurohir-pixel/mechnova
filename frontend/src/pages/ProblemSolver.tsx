import React, { useState } from 'react';
import { ApiService } from '../services/api';
import { ProblemSolverResult, ChatMessage } from '../types';
import {
  Wrench,
  AlertTriangle,
  ShieldAlert,
  Send,
  Sparkles,
  CheckCircle2,
  Bookmark,
  RefreshCw,
  HelpCircle,
  FileText,
  CornerDownRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const ProblemSolver: React.FC = () => {
  const [equipmentType, setEquipmentType] = useState('Centrifugal Pump');
  const [problemDescription, setProblemDescription] = useState('Loud rumbling cavitation noise and high bearing housing temperature under load');
  const [operatingConditions, setOperatingConditions] = useState('Operating at 2900 RPM continuous duty, pumped fluid is water at 45°C');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Excessive Vibration',
    'Abnormal Noise',
    'High Temperature (>80°C)'
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProblemSolverResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Chat follow-up state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userChatInput, setUserChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const symptomList = [
    'Excessive Vibration',
    'Abnormal Noise',
    'High Temperature (>80°C)',
    'Fluid Leakage',
    'Pressure Loss / Head Drop',
    'Burnt Lubricant Odor',
    'Intermittent Tripping',
    'Rotational Hesitation'
  ];

  const commonEquipments = [
    'Centrifugal Pump',
    'Industrial Gearbox',
    'Induction Motor',
    'Screw Air Compressor',
    'CNC Lathe Spindle',
    'Hydraulic Power Unit',
    'Belt Conveyor Drive'
  ];

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentType.trim() || !problemDescription.trim()) {
      setError('Please provide equipment type and problem description.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await ApiService.solveProblem({
        equipment_type: equipmentType,
        problem_description: problemDescription,
        symptoms: selectedSymptoms,
        operating_conditions: operatingConditions
      });
      setResult(data);
      setChatMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: `Diagnostic advisory generated for ${equipmentType}. You can ask any follow-up questions regarding specific vibration spectra, bearing clearance tolerances, or laser alignment procedures.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate diagnostic advisory.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim() || !result) return;

    const userText = userChatInput.trim();
    setUserChatInput('');

    const newMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatLoading(true);

    try {
      const history = chatMessages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await ApiService.chatFollowUp({
        equipment_type: equipmentType,
        problem_summary: result.problem_summary,
        conversation_history: history,
        user_message: userText
      });

      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_checks: res.suggested_checks,
        safety_notice: res.safety_notice
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSaveToHistory = () => {
    if (!result) return;
    try {
      const raw = localStorage.getItem('mechnova_saved_history');
      const list: any[] = raw ? JSON.parse(raw) : [];
      list.unshift({
        id: `trouble_${Date.now()}`,
        type: 'troubleshoot',
        title: `${equipmentType}: ${problemDescription.slice(0, 40)}...`,
        timestamp: new Date().toISOString(),
        data: result
      });
      localStorage.setItem('mechnova_saved_history', JSON.stringify(list));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-navy-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">AI Mechanical Problem Solver</h1>
          <span className="text-[10px] font-bold bg-rose-500/15 border border-rose-500/30 text-rose-300 px-2 py-0.5 rounded-full uppercase">
            LOTO Protected
          </span>
        </div>
        <p className="text-xs text-slate-300 mt-1">
          Intelligent troubleshooting engine with root-cause probability ranking, step-by-step diagnostic actions, required tools, and OSHA lockout/tagout guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (Left) */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleSolve} className="bg-navy-900 border border-navy-700 rounded-2xl p-5 shadow-card-soft space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-accent" />
              <span>Machine Problem Parameters</span>
            </h2>

            {/* Equipment Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Equipment / Machine Type
              </label>
              <input
                type="text"
                required
                value={equipmentType}
                onChange={(e) => setEquipmentType(e.target.value)}
                placeholder="e.g. Centrifugal Pump, Industrial Gearbox"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan-accent"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {commonEquipments.slice(0, 4).map((eq) => (
                  <button
                    key={eq}
                    type="button"
                    onClick={() => setEquipmentType(eq)}
                    className="text-[10px] bg-navy-950 hover:bg-navy-800 border border-navy-800 text-slate-300 px-2 py-0.5 rounded cursor-pointer"
                  >
                    {eq}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Problem Description & Observations
              </label>
              <textarea
                required
                rows={3}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Describe what occurs, sounds, temperature changes, or recent maintenance actions..."
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-accent resize-none"
              />
            </div>

            {/* Symptoms Multi-Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Observed Symptoms (Select All That Apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {symptomList.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-accent/20 border-cyan-accent text-cyan-accent font-semibold'
                          : 'bg-navy-950 border-navy-800 text-slate-300 hover:border-navy-700'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Operating Conditions */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Operating Conditions & Environment
              </label>
              <input
                type="text"
                value={operatingConditions}
                onChange={(e) => setOperatingConditions(e.target.value)}
                placeholder="e.g. 1450 RPM, ambient 40°C, continuous load"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-cyan-muted hover:from-primary-hover hover:to-primary text-white text-xs font-bold py-3 rounded-xl shadow-glow-primary transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Diagnosing Machinery...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Diagnostic Troubleshooting</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results & Interactive Chat (Right) */}
        <div className="lg:col-span-7 space-y-4">
          {error && (
            <div className="p-4 bg-rose-500/15 border border-rose-500/40 rounded-2xl flex items-start gap-3 text-rose-300 text-xs">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
              <div>
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {result ? (
            <div className="space-y-4">
              {/* Mandatory LOTO Safety Advisory Banner */}
              {result.loto_required && (
                <div className="bg-rose-500/15 border-2 border-rose-500/50 rounded-2xl p-4 flex items-start gap-3 text-rose-200">
                  <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-rose-300 uppercase tracking-wider text-sm">
                        OSHA 1910.147 LOTO REQUIRED BEFORE INSPECTION
                      </span>
                    </div>
                    <p className="text-rose-200 leading-relaxed">
                      This machinery contains dangerous kinetic, electrical, or pressurized fluid energy. Technicians must apply a physical padlock to the main circuit breaker and bleed hydraulic/suction pressure before removing guards.
                    </p>
                  </div>
                </div>
              )}

              {/* Problem Assessment Summary Card */}
              <div className="bg-navy-900 border border-navy-700 rounded-2xl p-5 shadow-card-soft">
                <div className="flex items-center justify-between border-b border-navy-800 pb-3 mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-accent" />
                    <span>Diagnostic Summary</span>
                  </h3>
                  <button
                    onClick={handleSaveToHistory}
                    className="text-xs bg-navy-800 hover:bg-navy-700 border border-navy-700 text-cyan-accent px-3 py-1 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{savedSuccess ? 'Saved!' : 'Save Advisory'}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-navy-950/60 p-3.5 rounded-xl border border-navy-800">
                  {result.problem_summary}
                </p>

                {/* Ranked Causes */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Likely Root Causes (Ranked by Probability)
                  </h4>
                  <div className="space-y-2">
                    {result.possible_causes.map((c, idx) => (
                      <div
                        key={idx}
                        className="bg-navy-950 p-3 rounded-xl border border-navy-800 flex flex-col sm:flex-row sm:items-start justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>#{idx + 1} {c.cause}</span>
                          </div>
                          <p className="text-xs text-slate-300">{c.explanation}</p>
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded self-start shrink-0 ${
                            c.probability === 'High'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {c.probability} PROBABILITY
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Diagnostic Actions */}
                <div className="mt-5">
                  <h4 className="text-xs font-bold text-cyan-accent uppercase tracking-wider mb-2">
                    Step-by-Step Diagnostic Inspection Procedure
                  </h4>
                  <div className="space-y-2.5">
                    {result.step_by_step_checks.map((chk) => (
                      <div key={chk.step} className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-white font-bold">
                          <span className="w-5 h-5 rounded-full bg-primary/20 text-cyan-accent flex items-center justify-center text-[11px] font-mono shrink-0">
                            {chk.step}
                          </span>
                          <span>{chk.action}</span>
                        </div>
                        <div className="text-slate-300 pl-7 text-[11px]">
                          <span className="text-cyan-accent font-semibold">Expected Observation: </span>
                          {chk.expected_observation}
                        </div>
                        <div className="text-amber-300 pl-7 text-[11px] flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>Safety: {chk.safety_check}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Corrective Actions & Tools */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-navy-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Recommended Corrective Actions
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {result.corrective_actions.map((act, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Required Tools & Parts
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {result.required_tools_parts.map((tool, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-cyan-accent shrink-0 mt-0.5" />
                          <span>{tool}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-5 p-3 bg-navy-950 rounded-xl border border-navy-800 text-[11px] text-slate-400">
                  {result.disclaimer}
                </div>
              </div>

              {/* Interactive Follow-Up Chat Box */}
              <div className="bg-navy-900 border border-navy-700 rounded-2xl p-5 shadow-card-soft">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                  <span>Interactive Engineering Diagnostic Follow-Up</span>
                  <span className="text-[10px] text-cyan-accent bg-cyan-accent/10 px-2 py-0.5 rounded font-mono">
                    ONLINE ADVISOR
                  </span>
                </h3>

                {/* Chat History Messages */}
                <div className="space-y-3 max-h-72 overflow-y-auto p-3 bg-navy-950 rounded-xl border border-navy-800 text-xs mb-3 scrollbar-thin">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-navy-800 text-slate-200 border border-navy-700 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                        {msg.suggested_checks && (
                          <div className="mt-2 pt-2 border-t border-navy-700 space-y-1">
                            <span className="text-[10px] text-cyan-accent font-bold uppercase">
                              Suggested Diagnostic Actions:
                            </span>
                            {msg.suggested_checks.map((c, i) => (
                              <div key={i} className="flex items-center gap-1 text-[11px] text-slate-300">
                                <ChevronRight className="w-3 h-3 text-cyan-accent" />
                                <span>{c}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {msg.safety_notice && (
                          <div className="mt-2 text-[10px] text-rose-300 bg-rose-500/10 p-1.5 rounded border border-rose-500/30">
                            {msg.safety_notice}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-300 font-mono mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="text-slate-400 text-xs flex items-center gap-1.5 italic">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>MechNova diagnostic reasoning in progress...</span>
                    </div>
                  )}
                </div>

                {/* Input Send Form */}
                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text"
                    value={userChatInput}
                    onChange={(e) => setUserChatInput(e.target.value)}
                    placeholder="Ask about vibration levels, oil viscosity, bearing clearance..."
                    className="flex-1 bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-accent"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !userChatInput.trim()}
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-navy-700 flex items-center justify-center text-cyan-accent mb-4">
                <Wrench className="w-8 h-8 opacity-80" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Awaiting Machinery Problem Data</h3>
              <p className="text-xs text-slate-300 max-w-sm mb-6">
                Fill in the equipment name, symptoms, and operating conditions on the left to generate an industrial troubleshooting diagnostic advisory.
              </p>
              <div className="text-[11px] text-slate-300 bg-navy-950 px-3 py-1.5 rounded-lg border border-navy-800 font-mono">
                SAFETY STANDARD: OSHA 29 CFR 1910.147 LOTO READY
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
