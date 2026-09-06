import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Users, ShieldAlert, Cpu, History } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface HomeViewProps {
  onStartAnalysis: () => void;
  onStartGroup: () => void;
  onOpenHistory: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStartAnalysis, onStartGroup, onOpenHistory }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="text-center space-y-8 max-w-2xl mx-auto py-6"
    >
      
      {/* Engine Status Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-mono font-bold tracking-wide border border-red-500/20">
        <Sparkles size={14} /> FARS-FASel™ Engine v3.0 Active
      </div>

      {/* Main Title & Final Brand Subtitle */}
      <div className="space-y-4">
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          MOTTATHALA{' '}
          <span className="bg-gradient-to-r from-red-500 via-amber-500 to-red-500 bg-clip-text text-transparent">
            FINDER™
          </span>
        </h2>
        <p className="text-sm sm:text-base opacity-70 font-mono font-medium tracking-wide max-w-lg mx-auto">
          The World's Most Unnecessary Forehead Intelligence System
        </p>
        <p className="text-xs italic text-yellow-300/80">
          “Because someone had to measure the forehead. The forehead knows.”
        </p>
      </div>

      {/* Interactive Pulsing Cranial Graphic */}
      <div 
        onClick={() => soundEngine.playBeep()}
        className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-tr from-red-600 to-amber-500 p-1 shadow-2xl shadow-red-600/30 cursor-pointer group hover:scale-105 transition-transform"
      >
        <div className="w-full h-full bg-[#0B0B0C] rounded-[22px] flex items-center justify-center text-5xl group-hover:rotate-6 transition-transform">
          🧑‍🦲
        </div>
      </div>

      {/* Primary Actions */}
      <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
        <button 
          onClick={() => {
            soundEngine.playBeep();
            onStartAnalysis();
          }}
          className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold tracking-wide shadow-xl shadow-red-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
        >
          <span>START MY ANALYSIS</span>
          <ChevronRight size={18} />
        </button>

        <button 
          onClick={() => {
            soundEngine.playBeep();
            onStartGroup();
          }}
          className="px-6 py-4 rounded-xl border border-white/20 hover:bg-white/5 font-semibold tracking-wide transition-all flex items-center justify-center gap-2 text-white"
        >
          <Users size={18} />
          <span>GROUP ANALYZER™</span>
        </button>
      </div>

      {/* History Shortcut */}
      <button
        onClick={() => {
          soundEngine.playBeep();
          onOpenHistory();
        }}
        className="text-xs text-slate-400 hover:text-red-400 flex items-center justify-center gap-1.5 mx-auto transition-colors pt-2 font-mono"
      >
        <History size={14} />
        <span>View archived diagnostic records in History</span>
      </button>

      {/* Absurd Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
        <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-1">
          <Cpu size={20} className="text-red-500" />
          <h4 className="font-bold text-sm text-white">FARS-FASel™ Engine</h4>
          <p className="text-xs opacity-60">Calculates cranial forehead ratios and visible vegetation density in high definition.</p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-1">
          <ShieldAlert size={20} className="text-amber-500" />
          <h4 className="font-bold text-sm text-white">Mottathala Alarm System</h4>
          <p className="text-xs opacity-60">Automated classification matrix & siren alerts for emergency receding hairlines.</p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-1">
          <Sparkles size={20} className="text-yellow-500" />
          <h4 className="font-bold text-sm text-white">Official PNG Certificates</h4>
          <p className="text-xs opacity-60">Generates downloadable certified classification documents with embedded evidence photos.</p>
        </div>
      </div>

    </motion.div>
  );
};
