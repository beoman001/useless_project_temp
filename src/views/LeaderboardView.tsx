import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnalysisRecord } from '../types/mottathala';
import { storage } from '../utils/storage';
import { Trophy, Award, ArrowLeft, Sparkles, Filter } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface LeaderboardViewProps {
  onStartScan: () => void;
  onReturn: () => void;
}

export type LeaderboardFilterMode = 'HIGHEST' | 'RECENT' | 'LOWEST';

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onStartScan, onReturn }) => {
  const [filterMode, setFilterMode] = useState<LeaderboardFilterMode>('HIGHEST');
  const [records, setRecords] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    loadRecords(filterMode);
  }, [filterMode]);

  const loadRecords = (mode: LeaderboardFilterMode) => {
    const raw = storage.getRecords('recent');
    let sorted = [...raw];

    if (mode === 'HIGHEST') {
      sorted.sort((a, b) => b.score - a.score);
    } else if (mode === 'LOWEST') {
      sorted.sort((a, b) => a.score - b.score);
    } else {
      sorted.sort((a, b) => b.timestamp - a.timestamp);
    }
    setRecords(sorted);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-3xl mx-auto space-y-6 pb-12"
    >
      
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            soundEngine.playBeep();
            onReturn();
          }}
          className="px-3.5 py-1.5 rounded-2xl border border-blue-500/30 hover:bg-blue-500/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
          THE FOREHEAD HALL OF FAME
        </span>
      </div>

      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-amber-400 text-white flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30">
          <Trophy size={32} />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          THE FOREHEAD HALL OF FAME
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono max-w-lg mx-auto">
          Humanity's greatest forehead-related achievements. Nobody requested this ranking. We created it anyway.
        </p>
      </div>

      {/* Filter Mode Buttons Toolbar */}
      <div className="flex items-center justify-center gap-2 font-mono text-xs pt-2">
        <button
          onClick={() => {
            soundEngine.playBeep();
            setFilterMode('HIGHEST');
          }}
          className={`px-4 py-2 rounded-2xl border font-bold transition-colors ${
            filterMode === 'HIGHEST'
              ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20'
              : 'bg-slate-900/80 text-slate-400 border-white/10 hover:text-white'
          }`}
        >
          HIGHEST EVER
        </button>

        <button
          onClick={() => {
            soundEngine.playBeep();
            setFilterMode('RECENT');
          }}
          className={`px-4 py-2 rounded-2xl border font-bold transition-colors ${
            filterMode === 'RECENT'
              ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20'
              : 'bg-slate-900/80 text-slate-400 border-white/10 hover:text-white'
          }`}
        >
          RECENT
        </button>

        <button
          onClick={() => {
            soundEngine.playBeep();
            setFilterMode('LOWEST');
          }}
          className={`px-4 py-2 rounded-2xl border font-bold transition-colors ${
            filterMode === 'LOWEST'
              ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20'
              : 'bg-slate-900/80 text-slate-400 border-white/10 hover:text-white'
          }`}
        >
          LOWEST EVER
        </button>
      </div>

      {/* Leaderboard Table / Rankings */}
      {records.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-3xl p-8 border border-blue-500/20 space-y-4">
          <div className="text-5xl">🏆</div>
          <h3 className="text-xl font-bold text-slate-100">
            The Hall of Fame is empty.
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Humanity remains disappointingly forehead-neutral. Nobody has been brave enough to document their forehead metrics yet.
          </p>
          <button
            onClick={() => {
              soundEngine.playBeep();
              onStartScan();
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-blue-500/30 inline-flex items-center gap-2"
          >
            <Sparkles size={14} />
            <span>BE THE FIRST TO SCAN</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((item, idx) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all glass-card ${
                idx === 0
                  ? 'border-blue-500 bg-blue-600/10 shadow-lg shadow-blue-500/20'
                  : 'border-blue-500/20 bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm ${
                  idx === 0
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : idx === 1
                    ? 'bg-slate-300 text-slate-950'
                    : idx === 2
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <img
                  src={item.frontPhoto}
                  alt={item.user.name}
                  className="w-12 h-12 rounded-xl object-cover border border-blue-500/30"
                />

                <div>
                  <h4 className="font-extrabold text-base text-white">{item.user.name}</h4>
                  <p className="text-xs font-mono text-cyan-300">{item.classification}</p>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-2xl font-black text-cyan-400">{item.score}</div>
                <div className="text-[10px] text-slate-400 uppercase">MOTTATHALA INDEX</div>
              </div>
            </div>
          ))}
        </div>
      )}

    </motion.div>
  );
};
