import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Cpu, ShieldAlert, Award, Play, Users, Film } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface LandingViewProps {
  onStart: () => void;
  onGroupScan: () => void;
  onWatchIntro: () => void;
  onHowItWorks: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStart,
  onGroupScan,
  onWatchIntro,
  onHowItWorks
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-6xl mx-auto space-y-16 py-8 px-4"
    >
      
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Large Minimal Typography & CTAs */}
        <div className="md:col-span-7 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-cyan-400 text-xs font-mono font-bold tracking-wide border border-blue-500/20 shadow-sm">
            <Sparkles size={14} className="text-cyan-400" /> SYSTEM STATUS: UNNECESSARILY OPERATIONAL
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-slate-900 dark:text-slate-100 uppercase">
            MEASURE THE{' '}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              FOREHEAD.
            </span>
          </h1>

          <p className="text-lg sm:text-2xl font-mono text-slate-600 dark:text-slate-300 font-medium tracking-tight">
            Modern science has solved bigger problems. We chose this one.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => {
                soundEngine.playBeep();
                onWatchIntro();
              }}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 font-mono text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Film size={14} className="text-cyan-400" />
              <span>WATCH DOCUMENTARY INTRO ("HUMANITY HAS COME TOO FAR")</span>
            </button>
          </div>

          {/* Primary & Secondary Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <button
              onClick={() => {
                soundEngine.playBeep();
                onStart();
              }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-base tracking-wider uppercase shadow-xl shadow-blue-500/30 transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2"
            >
              <span>SCAN MY FOREHEAD</span>
              <ChevronRight size={18} />
            </button>

            <button
              onClick={() => {
                soundEngine.playBeep();
                onGroupScan();
              }}
              className="px-6 py-4 rounded-2xl border border-cyan-500/40 text-slate-800 dark:text-slate-200 font-extrabold text-sm uppercase tracking-wider hover:bg-cyan-500/10 transition-colors flex items-center justify-center gap-2"
            >
              <Users size={18} className="text-cyan-400" />
              <span>I HAVE A GROUP PHOTO</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-mono italic">
            Entertainment only. Not a medical diagnostic system.
          </p>

        </div>

        {/* Right Column: Framed Live Analysis Visual */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl bg-slate-950 border-2 border-blue-500/40 p-4 shadow-2xl overflow-hidden group">
            
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
              alt="Live Forehead Analysis Visual"
              className="w-full h-full object-cover rounded-2xl opacity-75 group-hover:scale-105 transition-transform duration-500"
            />

            {/* Reticle Overlay */}
            <div className="absolute inset-4 rounded-2xl border border-blue-500/30 pointer-events-none p-4 flex flex-col justify-between">
              
              <div className="space-y-1">
                <div className="inline-block px-2.5 py-1 bg-black/80 text-cyan-400 font-mono text-[10px] font-bold rounded-full border border-blue-500/30 shadow">
                  REALITY-BASED CV ENGINE
                </div>
                <div className="block px-2.5 py-1 bg-black/80 text-emerald-400 font-mono text-[10px] font-bold rounded-full border border-emerald-500/30 shadow w-fit">
                  BALDNESS EVIDENCE DETECTED
                </div>
              </div>

              <div className="w-36 h-36 border border-dashed border-cyan-400/60 rounded-full mx-auto my-auto animate-spin-slow" />

              <div className="bg-black/80 px-3 py-1.5 rounded-xl border border-amber-400/40 text-center">
                <span className="text-[10px] font-mono text-amber-300 font-extrabold tracking-widest block uppercase">
                  MOTTATHALA INDEX™ — STANDBY
                </span>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* Intro Video Card */}
      <section className="max-w-4xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-blue-500/20 space-y-4 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
          <Play size={14} /> DOCUMENTARY TRAILER
        </div>

        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Humanity Has Come Too Far. The Forehead Knows.
        </h3>

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-blue-500/20 flex items-center justify-center">
          <video
            src="/assets/videos/intro.mp4"
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </section>

    </motion.div>
  );
};
