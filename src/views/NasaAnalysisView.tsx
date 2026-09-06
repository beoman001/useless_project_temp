import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../utils/soundEngine';
import { Check, CircleDot, Circle } from 'lucide-react';

interface NasaAnalysisViewProps {
  onComplete: () => void;
}

const NASA_STEPS = [
  'Detecting face',
  'Locating hairline',
  'Measuring forehead',
  'Calculating Mottathala Index',
  'Preparing judgement'
];

export const NasaAnalysisView: React.FC<NasaAnalysisViewProps> = ({ onComplete }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    soundEngine.playBeep();

    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        const next = prev + 1;
        soundEngine.playBeep();
        if (next >= NASA_STEPS.length) {
          clearInterval(interval);
          soundEngine.playFanfare();
          setTimeout(onComplete, 400);
          return NASA_STEPS.length - 1;
        }
        return next;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-md mx-auto py-12 text-center space-y-8"
    >
      
      <div className="space-y-2">
        <h2 className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-red-500 uppercase">
          ANALYZING
        </h2>
        <p className="text-sm text-slate-400 font-mono">
          Mapping forehead geometry to completely unnecessary statistics.
        </p>
      </div>

      {/* NASA Mission Control Step Checkbox List */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 text-left space-y-4 font-mono text-sm bg-black/40 shadow-2xl">
        {NASA_STEPS.map((stepLabel, idx) => {
          const isDone = activeStepIndex > idx;
          const isCurrent = activeStepIndex === idx;

          return (
            <div
              key={idx}
              className={`flex items-center justify-between transition-colors ${
                isDone
                  ? 'text-emerald-400 font-semibold'
                  : isCurrent
                  ? 'text-yellow-300 font-extrabold animate-pulse'
                  : 'text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <Check size={18} className="text-emerald-400 font-bold" />
                ) : isCurrent ? (
                  <CircleDot size={18} className="text-yellow-400 animate-spin" />
                ) : (
                  <Circle size={18} className="text-slate-600" />
                )}
                <span>{stepLabel}</span>
              </div>

              <span>{isDone ? '✓' : isCurrent ? '●' : '○'}</span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 font-mono italic">
        Please remain calm. Your forehead is being taken very seriously.
      </p>

    </motion.div>
  );
};
