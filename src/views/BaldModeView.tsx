import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Sparkles, ArrowLeft, Shield } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface BaldModeViewProps {
  name: string;
  onReturn: () => void;
}

export const BaldModeView: React.FC<BaldModeViewProps> = ({ name, onReturn }) => {
  const [sheenLevel, setSheenLevel] = useState(85);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md glass-card border-2 border-yellow-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl bg-black/60 backdrop-blur-xl"
    >
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 p-1 mx-auto shadow-2xl animate-pulse">
        <div className="w-full h-full bg-[#0B0B0C] rounded-[22px] flex items-center justify-center text-4xl">
          🧑‍🦲
        </div>
      </div>

      <div className="space-y-1">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-mono font-bold border border-yellow-400/40">
          <Sparkles size={12} /> BALD MODE™ SIMULATOR
        </div>
        <h3 className="text-3xl font-black tracking-tight text-white pt-2">
          BALD MODE™ ACTIVATED
        </h3>
        <p className="text-xs opacity-70">
          Subject: <span className="font-bold text-yellow-300">{name}</span>
        </p>
      </div>

      <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/30 text-xs font-mono text-yellow-200">
        “Simulated cranial transformation complete. Forehead real estate unlocked to 100% maximum capacity.”
      </div>

      {/* Sheen & Reflectivity Slider */}
      <div className="space-y-2 text-left bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-300 flex items-center gap-1">
            <Sun size={14} className="text-yellow-400" /> Scalp Solar Reflectivity:
          </span>
          <span className="font-bold text-yellow-400">{sheenLevel}% LUX</span>
        </div>
        <input
          type="range"
          min="20"
          max="100"
          value={sheenLevel}
          onChange={(e) => {
            setSheenLevel(Number(e.target.value));
            if (Number(e.target.value) % 10 === 0) soundEngine.playBeep();
          }}
          className="w-full accent-yellow-400 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>Matte Finish</span>
          <span>High-Gloss Mirror</span>
        </div>
      </div>

      <button
        onClick={() => {
          soundEngine.playBeep();
          onReturn();
        }}
        className="w-full py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105"
      >
        <ArrowLeft size={16} />
        <span>RETURN TO REPORT</span>
      </button>

    </motion.div>
  );
};
