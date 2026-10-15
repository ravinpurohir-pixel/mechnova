import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  Camera,
  Wrench,
  GraduationCap,
  Calculator,
  Calendar,
  Download,
  CheckCircle2,
  Search
} from 'lucide-react';

interface SavedItem {
  id: string;
  type: 'part' | 'troubleshoot' | 'calc' | 'study';
  title: string;
  timestamp: string;
  data: any;
}

export const SavedResults: React.FC = () => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [filterType, setFilterType] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState<SavedItem | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('mechnova_saved_history');
      if (raw) {
        setSavedItems(JSON.parse(raw));
      } else {
        // Sample saved history entries
        const initialSaved: SavedItem[] = [
          {
            id: 'saved_1',
            type: 'part',
            title: 'Deep Groove Radial Ball Bearing (6208 ZZ)',
            timestamp: new Date().toISOString(),
            data: {
              category: 'Rotary Anti-Friction Elements',
              confidence_score: 0.92,
              likely_function: 'Supports combined radial and moderate bilateral axial thrust loads.',
              materials: ['AISI 52100 Chromium Bearing Steel']
            }
          },
          {
            id: 'saved_2',
            type: 'troubleshoot',
            title: 'Centrifugal Slurry Pump - Cavitation Vibration',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            data: {
              summary: 'Cavitation noise accompanied by 1X/2X shaft harmonics.',
              causes: ['NPSH margin depletion', 'Mechanical seal distress']
            }
          }
        ];
        setSavedItems(initialSaved);
        localStorage.setItem('mechnova_saved_history', JSON.stringify(initialSaved));
      }
    } catch {
      setSavedItems([]);
    }
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedItems.filter((i) => i.id !== id);
    setSavedItems(updated);
    localStorage.setItem('mechnova_saved_history', JSON.stringify(updated));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const handleClearAll = () => {
    if (confirm('Clear all saved diagnostic and calculation history?')) {
      setSavedItems([]);
      localStorage.removeItem('mechnova_saved_history');
      setSelectedItem(null);
    }
  };

  const filtered = savedItems.filter((item) => {
    return filterType === 'ALL' || item.type === filterType;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">Saved Results & History</h1>
            <span className="text-[10px] font-bold bg-primary/20 border border-primary/40 text-cyan-accent px-2 py-0.5 rounded-full uppercase">
              {savedItems.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Personal repository of AI part analyses, machine troubleshooting diagnostics, and study bookmarks.
          </p>
        </div>

        {savedItems.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-rose-400 hover:text-rose-300 border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-navy-800 pb-2">
        {['ALL', 'part', 'troubleshoot', 'calc'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              filterType === tab
                ? 'bg-primary text-white border-primary shadow-glow-primary'
                : 'bg-navy-900 border-navy-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'ALL'
              ? 'All Items'
              : tab === 'part'
              ? 'Part Identifications'
              : tab === 'troubleshoot'
              ? 'Machine Troubleshoots'
              : 'Calculations'}
          </button>
        ))}
      </div>

      {/* Grid of Saved Items */}
      {filtered.length === 0 ? (
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-12 text-center text-slate-400">
          <Bookmark className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <p className="text-sm font-semibold text-white">No Saved Records Yet</p>
          <p className="text-xs mt-1">
            Analyze a mechanical part or run a machine troubleshooting diagnostic and click "Save to History" to store it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-navy-900 hover:bg-navy-850 border border-navy-700 hover:border-cyan-accent/50 rounded-2xl p-4 shadow-card-soft cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-cyan-accent uppercase bg-cyan-accent/10 px-2 py-0.5 rounded font-mono">
                    {item.type.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-300 font-mono">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.data.likely_function || item.data.problem_summary || item.data.summary || 'Details preserved in archive.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-navy-800 flex items-center justify-between text-xs text-cyan-accent font-semibold">
                <span>View Full Record Details</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Item Full View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 max-w-xl w-full rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <div>
                <span className="text-[10px] text-cyan-accent font-mono uppercase bg-cyan-accent/15 px-2 py-0.5 rounded">
                  {selectedItem.type.toUpperCase()}
                </span>
                <h2 className="text-base font-bold text-white mt-1">{selectedItem.title}</h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3 text-xs text-slate-200 scrollbar-thin">
              <pre className="bg-navy-950 p-4 rounded-xl border border-navy-800 font-mono text-[11px] whitespace-pre-wrap">
                {JSON.stringify(selectedItem.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
