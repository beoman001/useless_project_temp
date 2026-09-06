import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Shield, Award, Sparkles, ArrowLeft } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface AboutViewProps {
  onReturn: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onReturn }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-3xl mx-auto space-y-8 pb-16 text-left"
    >
      
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            soundEngine.playBeep();
            onReturn();
          }}
          className="px-3.5 py-1.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">
          SYSTEM ARCHITECTURE
        </span>
      </div>

      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center mx-auto text-3xl font-extrabold shadow-inner">
          🧑‍🦲
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Why Does This Exist?
        </h2>
        <p className="text-xs font-mono text-red-400 font-bold uppercase tracking-widest">
          DEPARTMENT OF CRANIAL VEGETATION ANALYSIS
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
        
        <p className="text-lg font-bold text-white text-center italic border-b border-white/10 pb-4">
          “We asked ourselves an important question: <span className="text-red-400 underline underline-offset-4">Is someone measuring the forehead?</span> Instead of ignoring the issue, we built an entire artificial intelligence system. You're welcome.”
        </p>

        <div className="space-y-4">
          <p>
            For centuries, humanity has sent rovers to Mars and decoded complex genetic structures. Yet, when faced with the gradual, glistening expansion of a forehead, science offered only expensive foam and emotional acceptance.
          </p>
          <p>
            <strong className="text-white font-extrabold">MOTTATHALA FINDER™</strong> fills this void by deploying advanced browser-native computer vision, MediaPipe facial landmarking, and FARS-FASel™ spectral decomposition algorithms to state with statistical certainty what your reflection already knew.
          </p>
        </div>

        {/* System Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10">
            <div className="text-xl font-black font-mono text-red-400">12,847+</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Foreheads Measured</div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10">
            <div className="text-xl font-black font-mono text-emerald-400">99.1%</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">FARS Confidence</div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10">
            <div className="text-xl font-black font-mono text-amber-400">0.03%</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Actual Usefulness</div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10">
            <div className="text-xl font-black font-mono text-red-500">4,821</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Hours Wasted</div>
          </div>
        </div>

      </div>

    </motion.div>
  );
};
