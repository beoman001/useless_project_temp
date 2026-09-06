import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../utils/soundEngine';
import { Cpu, CheckCircle2 } from 'lucide-react';

interface AnalyzingViewProps {
  onComplete: () => void;
}

const STEPS = [
  'Inspecting cranial boundaries…',
  'Comparing visible vegetation…',
  'Consulting completely legitimate science…',
  'Calculating consequences…'
];

export const AnalyzingView: React.FC<AnalyzingViewProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    soundEngine.playBeep();

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 3;
        if (next >= 25 && currentStepIndex === 0) setCurrentStepIndex(1);
        if (next >= 50 && currentStepIndex === 1) setCurrentStepIndex(2);
        if (next >= 75 && currentStepIndex === 2) setCurrentStepIndex(3);

        if (next % 15 === 0) {
          soundEngine.playBeep();
        }

        if (next >= 100) {
          clearInterval(interval);
          soundEngine.playFanfare();
          setTimeout(onComplete, 400);
          return 100;
        }
        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [currentStepIndex, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center space-y-6 max-w-md mx-auto py-12"
    >
      {/* Spinning Outer Ring */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="w-full h-full border-4 border-red-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-red-500/30" />
        <div className="absolute font-mono font-bold text-lg text-red-500">
          {progress}%
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-black tracking-tight">Reality Analysis Commencing</h3>
        <p className="text-sm opacity-70 font-mono text-red-400 min-h-[24px]">
          {STEPS[currentStepIndex]}
        </p>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-red-500 transition-all duration-150 shadow-[0_0_15px_#ef4444]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Telemetry Steps Readout */}
      <div className="space-y-2 text-left bg-black/30 p-4 rounded-xl border border-white/10 text-xs font-mono">
        {STEPS.map((step, idx) => {
          const isDone = currentStepIndex > idx || progress >= 100;
          const isCurrent = currentStepIndex === idx && !isDone;

          return (
            <div
              key={idx}
              className={`flex items-center justify-between transition-colors ${
                isDone
                  ? 'text-emerald-400 font-semibold'
                  : isCurrent
                  ? 'text-red-400 font-bold animate-pulse'
                  : 'text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2">
                {isDone ? (
                  <CheckCircle2 size={14} className="text-emerald-400" />
                ) : (
                  <Cpu size={14} className={isCurrent ? 'text-red-400 animate-bounce' : 'text-slate-600'} />
                )}
                <span>{step}</span>
              </div>
              <span>{isDone ? 'DONE' : isCurrent ? 'RUNNING' : 'WAITING'}</span>
            </div>
          );
        })}
      </div>

    </motion.div>
  );
};
