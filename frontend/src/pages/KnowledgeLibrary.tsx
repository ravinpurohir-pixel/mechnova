import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { KnowledgeItem } from '../types';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Bookmark,
  Share2
} from 'lucide-react';

export const KnowledgeLibrary: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    ApiService.getKnowledgeLibrary()
      .then((data) => {
        setItems(data);
        if (data.length > 0) setSelectedItem(data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    'ALL',
    'Components',
    'Mechanical Systems',
    'Engineering Formulas',
    'Manufacturing Methods',
    'Maintenance Procedures',
    'Material Properties'
  ];

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-navy-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">Machine Knowledge Library</h1>
          <span className="text-[10px] font-bold bg-cyan-accent/15 border border-cyan-accent/30 text-cyan-accent px-2 py-0.5 rounded-full uppercase">
            Peer Reviewed
          </span>
        </div>
        <p className="text-xs text-slate-300 mt-1">
          Searchable engineering repository with official ISO, AGMA, ASME, and OSHA technical standards citations.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bearings, gear formulas, welding, shaft sizing, LOTO rules..."
            className="w-full bg-navy-900 border border-navy-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-accent"
          />
        </div>

        <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-white border-primary shadow-glow-primary'
                  : 'bg-navy-900 border-navy-800 text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Column Layout: Article List & Detail Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Article Cards (Left) */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredItems.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-navy-850 border-cyan-accent shadow-glow-cyan'
                    : 'bg-navy-900 border-navy-800 hover:border-navy-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-accent uppercase bg-cyan-accent/10 px-2 py-0.5 rounded font-mono">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Verified Standard
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{item.description}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {item.tags.map((t) => (
                    <span key={t} className="text-[9px] bg-navy-950 border border-navy-800 text-slate-300 px-1.5 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Article Detail View (Right) */}
        <div className="lg:col-span-7">
          {selectedItem ? (
            <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6 shadow-card-soft space-y-5">
              <div className="border-b border-navy-800 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-accent uppercase tracking-wider">
                    {selectedItem.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold uppercase">
                      Official Engineering Standard
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-2">{selectedItem.title}</h2>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedItem.description}</p>
              </div>

              {/* Verified Source Citation Callout */}
              <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-accent shrink-0" />
                  <div>
                    <span className="text-slate-400">Technical Source: </span>
                    <strong className="text-white">{selectedItem.source}</strong>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono shrink-0">AUTHENTICATED</span>
              </div>

              {/* Formatted Content */}
              <div className="bg-navy-950/50 p-4 rounded-xl border border-navy-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans space-y-3">
                {selectedItem.content}
              </div>

              {/* Tags and Metadata Footer */}
              <div className="pt-4 border-t border-navy-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.tags.map((tag) => (
                    <span key={tag} className="bg-navy-800 px-2 py-0.5 rounded-lg text-slate-300 text-[11px]">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-slate-300 font-mono">
                  MECHNOVA MACHINE REPOSITORY
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-12 text-center text-slate-400">
              Select an article to view detailed reference specifications and equations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
