import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, SkipForward } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface IntroSequenceModalProps {
  onComplete: () => void;
}

export const IntroSequenceModal: React.FC<IntroSequenceModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);

  // Fast & snappy timing sequence (~1s per line instead of 3-4s)
  const introStatements = [
    { text: "DO YOU EVER WONDER HOW LONG HUMANITY HAS EXISTED?", delay: 1800 },
    { text: "For all these years, humanity has faced countless problems.", delay: 1500 },
    { text: "And whenever a problem appeared, humanity tried to find a solution.", delay: 1600 },
    { text: "We discovered electricity.", delay: 900 },
    { text: "We conquered diseases.", delay: 900 },
    { text: "We reached the Moon.", delay: 900 },
    { text: "We explored the depths of the oceans.", delay: 1000 },
    { text: "We mapped the human genome.", delay: 1000 },
    { text: "We built computers.", delay: 900 },
    { text: "We created artificial intelligence.", delay: 1100 },
    { text: "", delay: 600 }, // Black screen pause
    { text: "BUT THERE WAS ONE PROBLEM...", delay: 1600 },
    { text: "WE NEVER SOLVED IT.", delay: 1500 },
    { text: "The forehead.", delay: 1300 },
    { text: "Why does it exist?", delay: 1200 },
    { text: "Why does it sometimes appear to occupy significantly more territory than necessary?", delay: 1800 },
    { text: "Where did the hairline go?", delay: 1400 },
    { text: "Humanity searched. Humanity measured. Humanity calculated. Humanity gave up.", delay: 1900 },
    { text: "So we decided to continue the investigation.", delay: 1600 }
  ];

  const totalTextSteps = introStatements.length;

  useEffect(() => {
    if (step < totalTextSteps) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, introStatements[step].delay);

      return () => clearTimeout(timer);
    }
  }, [step, totalTextSteps]);

  const isFinalReveal = step >= totalTextSteps;

  const handleContainerClick = () => {
    if (!isFinalReveal) {
      soundEngine.playBeep();
      setStep(prev => prev + 1);
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-between p-6 sm:p-12 select-none overflow-hidden font-serif cursor-pointer"
    >
      
      {/* Top Skip Control */}
      <div className="w-full flex justify-between items-center">
        <span className="text-[10px] font-mono text-slate-500 uppercase">
          {!isFinalReveal ? "Tap anywhere to skip line" : ""}
        </span>

        {!isFinalReveal && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playBeep();
              onComplete();
            }}
            className="px-4 py-2 rounded-full border border-white/20 hover:border-white text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <SkipForward size={14} /> Skip Intro
          </button>
        )}
      </div>

      {/* Main Fast Cinematic Text Container */}
      <div className="flex-1 flex items-center justify-center max-w-3xl text-center px-4">
        <AnimatePresence mode="wait">
          
          {!isFinalReveal ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-4"
            >
              {introStatements[step]?.text && (
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-extralight tracking-wide leading-relaxed text-slate-100 font-serif">
                  {introStatements[step].text}
                </h2>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-8 font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Brand Logo & Headline */}
              <div className="space-y-3">
                <div className="inline-block px-4 py-1.5 rounded-full bg-red-600/30 border border-red-500/50 text-red-400 font-mono text-xs font-bold uppercase tracking-widest">
                  THINKERHUB USELESS PROJECTS
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono">
                  MOTTATHALA FINDER™
                </h1>

                <p className="text-sm sm:text-base text-cyan-400 font-mono tracking-wider uppercase font-semibold">
                  THE WORLD'S MOST UNNECESSARY FOREHEAD INTELLIGENCE SYSTEM
                </p>
              </div>

              <div className="space-y-2 text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                <p>Because humanity solved almost everything...</p>
                <p className="font-serif italic text-white text-lg">But not this.</p>
              </div>

              <div className="pt-2">
                <div className="text-xl sm:text-2xl font-black text-amber-400 tracking-widest font-mono uppercase">
                  THE FOREHEAD KNOWS.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setStep(0)}
                  className="px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/10 text-slate-300 font-mono text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <RotateCcw size={16} /> Replay Intro
                </button>

                <button
                  onClick={() => {
                    soundEngine.playFanfare();
                    onComplete();
                  }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold font-mono text-sm tracking-wider uppercase shadow-xl shadow-red-600/40 flex items-center gap-3 transition-transform hover:scale-105"
                >
                  <span>BEGIN THE INVESTIGATION</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer Branding Line */}
      <div className="w-full text-center text-[10px] font-mono text-slate-600 tracking-widest uppercase">
        © ThinkerHub Useless Projects — The Forehead Knows
      </div>

    </div>
  );
};
