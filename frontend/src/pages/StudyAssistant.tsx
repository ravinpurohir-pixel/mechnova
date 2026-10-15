import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { StudySubject, TopicContent, Language } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  GraduationCap,
  BookOpen,
  Calculator,
  FileCheck,
  CheckCircle2,
  XCircle,
  Bookmark,
  Award,
  Globe,
  RefreshCw,
  Sparkles,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export const StudyAssistant: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [subjects, setSubjects] = useState<StudySubject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('thermodynamics');
  const [selectedTopic, setSelectedTopic] = useState<string>('First Law of Thermodynamics');
  const [formatType, setFormatType] = useState<string>('concept');
  const [content, setContent] = useState<TopicContent | null>(null);
  const [loading, setLoading] = useState(false);

  // MCQ state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    ApiService.getStudySubjects().then((data) => {
      setSubjects(data);
      if (data.length > 0) {
        const thermo = data.find((s) => s.id === 'thermodynamics') || data[0];
        setSelectedSubjectId(thermo.id);
        setSelectedTopic(thermo.topics[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedSubjectId && selectedTopic) {
      loadContent();
    }
  }, [selectedSubjectId, selectedTopic, language, formatType]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getTopicContent(
        selectedSubjectId,
        selectedTopic,
        language,
        formatType
      );
      setContent(data);
      setSelectedAnswers({});
      setShowExplanations({});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setShowExplanations((prev) => ({ ...prev, [qIdx]: true }));
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header & Multilingual Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">Engineering Study Assistant</h1>
            <span className="text-[10px] font-bold bg-primary/20 border border-primary/40 text-cyan-accent px-2 py-0.5 rounded-full uppercase">
              Curriculum AI
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Complete exam-oriented syllabus with step-by-step numerical derivations, important formulas, 5-mark and 10-mark formats.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 bg-navy-950 p-1 rounded-xl border border-navy-800 shrink-0">
          <Globe className="w-3.5 h-3.5 text-cyan-accent ml-2 mr-1" />
          {(['en', 'gu', 'hi'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                language === lang
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'English' : lang === 'gu' ? 'ગુજરાતી' : 'हिंदी'}
            </button>
          ))}
        </div>
      </div>

      {/* 10 Subject Chips Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Select Mechanical Engineering Subject (10 Available)
          </span>
        </div>
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin">
          {subjects.map((sub) => {
            const isSelected = selectedSubjectId === sub.id;
            const displayName =
              language === 'gu' ? sub.gu_name : language === 'hi' ? sub.hi_name : sub.name;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubjectId(sub.id);
                  setSelectedTopic(sub.topics[0]);
                }}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-accent/20 border-cyan-accent text-white font-bold shadow-glow-cyan'
                    : 'bg-navy-900 border-navy-800 text-slate-300 hover:border-navy-700 hover:text-white'
                }`}
              >
                {displayName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic Selector Row */}
      {currentSubject && (
        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-card-soft">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-navy-950 border border-navy-700 rounded-xl py-2 px-3 text-xs font-bold text-white focus:outline-none focus:border-cyan-accent"
            >
              {currentSubject.topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleBookmark}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-navy-950 border-navy-800 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark Topic'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Content Formats Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-navy-800 pb-2">
        {[
          { id: 'concept', label: 'Core Concept', icon: BookOpen },
          { id: 'formulas', label: 'Formulas & Units', icon: Calculator },
          { id: 'numerical', label: 'Worked Numerical', icon: Sparkles },
          { id: 'five_mark', label: '5-Mark Exam Answer', icon: FileCheck },
          { id: 'ten_mark', label: '10-Mark Exam Answer', icon: GraduationCap },
          { id: 'mcqs', label: 'Practice MCQs', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = formatType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFormatType(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'bg-navy-900 border border-navy-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 text-cyan-accent" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Display Card */}
      {loading ? (
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <RefreshCw className="w-8 h-8 text-cyan-accent animate-spin mb-3" />
          <p className="text-xs text-slate-300 font-mono">Loading syllabus study material...</p>
        </div>
      ) : content ? (
        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6 shadow-card-soft space-y-6">
          {/* Format: Core Concept */}
          {formatType === 'concept' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-accent" />
                <span>{content.concept_title}</span>
              </h2>
              <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {content.explanation}
              </div>
            </div>
          )}

          {/* Format: Formulas */}
          {formatType === 'formulas' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-cyan-accent" />
                <span>Essential Engineering Formulas & SI Units</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {content.key_formulas.map((f, idx) => (
                  <div key={idx} className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-1.5">
                    <div className="text-xs font-bold text-white">{f.name}</div>
                    <div className="text-sm font-mono font-bold text-cyan-accent bg-navy-900 p-2 rounded-lg border border-navy-800">
                      {f.formula}
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">Units: {f.units}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Format: Worked Numerical */}
          {formatType === 'numerical' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-accent" />
                <span>Step-by-Step Worked Numerical Problem</span>
              </h2>
              <div className="bg-navy-950 p-4 rounded-xl border border-navy-800">
                <h3 className="text-xs font-bold text-cyan-accent uppercase tracking-wider mb-2">Problem Statement</h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line mb-4 font-mono">
                  {content.worked_numerical.problem}
                </p>

                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  Analytical Solution & Calculation Steps
                </h3>
                <div className="space-y-2">
                  {content.worked_numerical.solution_steps.map((st, i) => (
                    <div key={i} className="p-3 bg-navy-900 rounded-xl border border-navy-800 text-xs text-slate-200 font-mono whitespace-pre-line">
                      {st}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Format: 5-Mark Exam Answer */}
          {formatType === 'five_mark' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-cyan-accent" />
                  <span>5-Mark Standard University Exam Answer Format</span>
                </h2>
                <span className="text-[10px] bg-primary/20 text-cyan-accent px-2 py-0.5 rounded font-mono font-bold">
                  5 MARKS
                </span>
              </div>
              <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {content.five_mark_exam_answer}
              </div>
            </div>
          )}

          {/* Format: 10-Mark Exam Answer */}
          {formatType === 'ten_mark' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-cyan-accent" />
                  <span>10-Mark Comprehensive University Exam Format</span>
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                  10 MARKS
                </span>
              </div>
              <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {content.ten_mark_exam_answer}
              </div>
            </div>
          )}

          {/* Format: Practice MCQs */}
          {formatType === 'mcqs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-cyan-accent" />
                  <span>Practice Multiple Choice Questions (Instant Scoring)</span>
                </h2>
                <span className="text-xs text-slate-400">
                  {Object.keys(selectedAnswers).length} / {content.practice_mcqs.length} Answered
                </span>
              </div>

              <div className="space-y-4">
                {content.practice_mcqs.map((mcq, qIdx) => {
                  const userAnswer = selectedAnswers[qIdx];
                  const hasAnswered = userAnswer !== undefined;
                  const isCorrect = userAnswer === mcq.correct;

                  return (
                    <div key={qIdx} className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-3">
                      <div className="text-xs sm:text-sm font-bold text-white flex items-start gap-2">
                        <span className="text-cyan-accent">Q{qIdx + 1}.</span>
                        <span>{mcq.question}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {mcq.options.map((opt, optIdx) => {
                          const isOptionSelected = userAnswer === optIdx;
                          let btnStyle = 'bg-navy-900 border-navy-800 text-slate-300 hover:border-navy-700';

                          if (hasAnswered) {
                            if (optIdx === mcq.correct) {
                              btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                            } else if (isOptionSelected) {
                              btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={hasAnswered}
                              onClick={() => handleSelectOption(qIdx, optIdx)}
                              className={`text-left p-2.5 rounded-xl text-xs border transition-all cursor-pointer ${btnStyle}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-navy-800 flex items-center justify-center text-[10px] font-mono shrink-0">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div
                          className={`p-3 rounded-xl text-xs border flex items-start gap-2 ${
                            isCorrect
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                          )}
                          <div>
                            <span className="font-bold">
                              {isCorrect ? 'Correct! ' : 'Incorrect. '}
                            </span>
                            <span>{mcq.explanation}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
