import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Trash2, ArrowLeft, Award, Sparkles } from 'lucide-react';
import { GroupMember, ClassificationType } from '../types/kashandi';
import { soundEngine } from '../utils/soundEngine';

interface GroupAnalyzerViewProps {
  onReturn: () => void;
}

export const GroupAnalyzerView: React.FC<GroupAnalyzerViewProps> = ({ onReturn }) => {
  const [members, setMembers] = useState<string[]>(['Alex', 'Sam', 'Jordan']);
  const [newMember, setNewMember] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<GroupMember[] | null>(null);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.trim()) return;
    soundEngine.playBeep();
    setMembers([...members, newMember.trim()]);
    setNewMember('');
  };

  const handleRemoveMember = (idx: number) => {
    soundEngine.playBeep();
    setMembers(members.filter((_, i) => i !== idx));
  };

  const handleStartGroupAnalysis = () => {
    if (members.length === 0) return;
    soundEngine.playBeep();
    setIsAnalyzing(true);

    setTimeout(() => {
      soundEngine.playFanfare();
      const groupResults: GroupMember[] = members.map((name) => {
        const score = Math.floor(Math.random() * 55) + 45;
        let classification: ClassificationType = 'HAIR FORTRESS';
        if (score >= 85) classification = 'MOTTATHALA FOUND';
        else if (score >= 68) classification = 'EMERGENCY KASHANDI';
        else if (score >= 48) classification = 'PRE-KASHANDI';

        return {
          id: `MEMBER-${Math.random()}`,
          name,
          score,
          classification
        };
      });

      // Sort descending by Kashandi Index Score
      groupResults.sort((a, b) => b.score - a.score);

      setResults(groupResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-lg glass-card border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6"
    >
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-mono font-bold border border-red-500/20">
          <Users size={14} /> MULTI-SUBJECT ARRAY
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight pt-1">
          GROUP MOTTATHALA ANALYZER™
        </h3>
        <p className="text-xs opacity-60 font-mono">
          “Because apparently one forehead wasn't enough.”
        </p>
      </div>

      {!results ? (
        <div className="space-y-4">
          
          <form onSubmit={handleAddMember} className="flex gap-2">
            <input
              type="text"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              placeholder="Add friend / colleague name"
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-sm outline-none focus:border-red-500 text-white font-medium"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-md"
            >
              <Plus size={16} /> ADD
            </button>
          </form>

          {/* Member Roster List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {members.map((name, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-black/20 border border-white/5 text-sm font-semibold text-slate-200">
                <span>{idx + 1}. {name}</span>
                <button
                  onClick={() => handleRemoveMember(idx)}
                  className="p-1 text-slate-500 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {isAnalyzing ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-red-400 animate-pulse">
                Evaluating group forehead real estate parameters…
              </p>
            </div>
          ) : (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  soundEngine.playBeep();
                  onReturn();
                }}
                className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/10 font-bold text-xs text-slate-300"
              >
                Back to Home
              </button>

              <button
                onClick={handleStartGroupAnalysis}
                disabled={members.length === 0}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} /> RUN GROUP EVALUATION
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Results Leaderboard Table */
        <div className="space-y-4 text-left">
          <div className="text-xs font-mono font-bold uppercase text-red-400 tracking-wider text-center">
            OFFICIAL GROUP RANKINGS
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {results.map((item, idx) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  idx === 0
                    ? 'bg-red-500/20 border-red-500 font-bold shadow-md'
                    : 'bg-black/30 border-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-black/40 text-xs font-mono flex items-center justify-center font-extrabold text-amber-400">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-white">{item.name}</div>
                    <div className="text-[10px] text-red-400 font-mono font-semibold">{item.classification}</div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-lg font-black text-red-400">{item.score}</span>
                  <span className="text-[10px] opacity-50 block">INDEX</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setResults(null)}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase shadow-md flex items-center justify-center gap-1.5"
          >
            <ArrowLeft size={16} /> RE-EVALUATE GROUP
          </button>
        </div>
      )}

    </motion.div>
  );
};
