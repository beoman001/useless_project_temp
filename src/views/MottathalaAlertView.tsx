import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface MottathalaAlertViewProps {
  name: string;
  score: number;
  onProceed: () => void;
}

export const MottathalaAlertView: React.FC<MottathalaAlertViewProps> = ({ name, score, onProceed }) => {
  useEffect(() => {
    soundEngine.playAlarm();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-lg glass-card border-2 border-red-500 rounded-3xl p-8 text-center space-y-6 shadow-2xl bg-red-500/10 glow-red animate-pulse-alarm"
    >
      <div className="w-20 h-20 rounded-full bg-red-600/30 text-red-500 border border-red-500/50 flex items-center justify-center mx-auto text-4xl shadow-inner">
        <AlertTriangle className="w-10 h-10 animate-bounce" />
      </div>

      <div className="space-y-1">
        <div className="inline-block px-3 py-1 bg-red-600 text-white font-mono text-xs font-black rounded-md uppercase tracking-widest shadow-md">
          MOTTATHALA ALERT EVENT DETECTED
        </div>
        <h2 className="text-3xl font-black text-red-500 tracking-tight pt-2">
          MOTTATHALA FOUND
        </h2>
        <p className="text-sm font-semibold text-slate-300">
          Subject: <span className="text-white font-extrabold">{name}</span>
        </p>
      </div>

      <div className="p-6 bg-black/50 rounded-2xl border border-red-500/40 space-y-2">
        <div className="text-xs uppercase font-mono text-slate-400">KASHANDI INDEX SCORE</div>
        <div className="text-6xl font-black text-red-500 font-mono tracking-tighter">
          {score} / 100
        </div>
        <div className="text-xs font-bold text-red-400 pt-1">
          Forehead expansion has exceeded standard civil limits.
        </div>
      </div>

      <p className="text-xs text-slate-400 italic">
        “The hair retention department has officially concluded operations. Proceed to full diagnostic report.”
      </p>

      <button
        onClick={() => {
          soundEngine.playBeep();
          onProceed();
        }}
        className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold tracking-wider uppercase shadow-xl shadow-red-600/40 transition-all flex items-center justify-center gap-2"
      >
        <span>VIEW FULL DIAGNOSTIC REPORT</span>
        <ArrowRight size={18} />
      </button>

    </motion.div>
  );
};
