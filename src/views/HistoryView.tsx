import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnalysisRecord, HistoryFilterMode } from '../types/mottathala';
import { storage } from '../utils/storage';
import { History, Trash2, Calendar, Award, Eye, Sparkles, ArrowLeft, Filter, Search } from 'lucide-react';
import { downloadMottathalaCertificate } from '../utils/certificateExport';
import { ShareCardModal } from '../components/ShareCardModal';
import { soundEngine } from '../utils/soundEngine';

interface HistoryViewProps {
  onReopenRecord: (record: AnalysisRecord) => void;
  onReturn: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onReopenRecord, onReturn }) => {
  const [filterMode, setFilterMode] = useState<HistoryFilterMode>('recent');
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShareRecord, setSelectedShareRecord] = useState<AnalysisRecord | null>(null);

  useEffect(() => {
    loadRecords(filterMode);
  }, [filterMode]);

  const loadRecords = (mode: HistoryFilterMode) => {
    const list = storage.getRecords(mode);
    setRecords(list);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playBeep();
    storage.deleteRecord(id);
    loadRecords(filterMode);
  };

  const handleClearAll = () => {
    soundEngine.playBeep();
    if (window.confirm("Permanently erase all stored evidence scan records?")) {
      storage.clearAllRecords();
      setRecords([]);
    }
  };

  const filteredRecords = records.filter((r) =>
    r.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.classification.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-4xl mx-auto space-y-6 pb-12"
    >
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-blue-500/20">
        <div>
          <div className="flex items-center gap-2">
            <History className="text-cyan-400" size={24} />
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Diagnostic History Archive
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            MOTTATHALA RESEARCH AUTHORITY™ PERSISTENT LOCAL DATABASE
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playBeep();
              onReturn();
            }}
            className="px-4 py-2 rounded-2xl border border-blue-500/30 hover:bg-blue-500/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> Back
          </button>

          {records.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Clear All History
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-blue-500/20 shadow-inner">
        
        {/* Filter Switcher: Recent vs Highest-Ever */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-blue-500/20 w-full sm:w-auto">
          <button
            onClick={() => {
              soundEngine.playBeep();
              setFilterMode('recent');
            }}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
              filterMode === 'recent'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Filter size={12} />
            <span>Recent</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playBeep();
              setFilterMode('highest');
            }}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
              filterMode === 'highest'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={12} />
            <span>Highest-Ever</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subject, score or classification..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-blue-500/20 text-xs font-medium outline-none focus:border-cyan-400 text-white"
          />
        </div>

      </div>

      {/* History Grid */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-3xl p-8 border border-blue-500/20 space-y-4">
          <div className="text-5xl mb-4">🧑‍🦲</div>
          <h3 className="text-xl font-bold text-slate-100 mb-1">
            No Saved Scans Found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            Perform a forehead measurement scan to archive diagnostic records in your persistent local database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                soundEngine.playBeep();
                onReopenRecord(item);
              }}
              className="glass-card rounded-2xl p-5 border border-blue-500/20 hover:border-cyan-400/60 bg-slate-900/80 hover:bg-slate-900 transition-all cursor-pointer shadow-xl space-y-3 relative group"
            >
              
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-base text-white group-hover:text-cyan-300 transition-colors">
                    {item.user.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                    <Calendar size={12} className="text-slate-500" />
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                <span className="px-3 py-1 bg-blue-600/20 text-cyan-300 font-extrabold text-xs rounded-full border border-blue-500/40">
                  {item.score} / 100
                </span>
              </div>

              {/* Thumbnail Photo & Info */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/80 border border-blue-500/10">
                <img
                  src={item.frontPhoto}
                  alt={item.user.name}
                  className="w-14 h-14 rounded-xl object-cover border border-blue-500/30"
                />
                <div className="space-y-0.5 text-xs font-mono">
                  <div className="font-bold text-amber-400">
                    {item.classification}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Forehead: {item.metrics.foreheadRatio}
                  </div>
                  <div className="text-slate-500 text-[10px]">
                    ID: {item.id}
                  </div>
                </div>
              </div>

              {/* Roast */}
              <p className="text-xs italic text-slate-300 line-clamp-2 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                “{item.roast}”
              </p>

              {/* Card Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  title="Delete record"
                  className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.playFanfare();
                      downloadMottathalaCertificate(item);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-300 font-bold hover:bg-amber-400/20 text-[11px] flex items-center gap-1"
                  >
                    <Award size={12} /> Certificate
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.playBeep();
                      onReopenRecord(item);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 shadow"
                  >
                    <Eye size={12} /> View
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {selectedShareRecord && (
        <ShareCardModal
          record={selectedShareRecord}
          onClose={() => setSelectedShareRecord(null)}
        />
      )}

    </motion.div>
  );
};
