import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Volume2, VolumeX, ShieldAlert, ArrowRight, Lock, CheckCircle2, AlertTriangle, Users, HelpCircle } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export interface GroupSubjectAlarmStatus {
  personId: string;
  name: string;
  score: number;
  status: 'positive' | 'negative' | 'insufficient';
  classification?: string;
}

export interface MottathalaAlarmModalProps {
  mode: 'positive' | 'negative' | 'group';
  name: string;
  score: number;
  classification?: string;
  groupStatuses?: GroupSubjectAlarmStatus[];
  onStopAlarm: () => void;
  onProceed: () => void;
}

export const MottathalaAlarmModal: React.FC<MottathalaAlarmModalProps> = ({
  mode,
  name,
  score,
  classification,
  groupStatuses = [],
  onStopAlarm,
  onProceed
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [volumeValue, setVolumeValue] = useState<number>(soundEngine.getVolume());
  const [volumeGagText, setVolumeGagText] = useState<string | null>(null);
  const [muteButtonOffset, setMuteButtonOffset] = useState({ x: 0, y: 0 });
  const [muteGagText, setMuteGagText] = useState<string | null>(null);
  const [isMutedLocal, setIsMutedLocal] = useState<boolean>(soundEngine.isMuted());

  const sarcasticNegativeQuotes = [
    "“Our scientists are confused.”",
    "“The forehead has disappointed the department.”",
    "“Years of unnecessary research have led to this moment.”",
    "“There is simply not enough mottathala here.”",
    "“Please remain calm. This is actually good news.”",
    "“We have an even more confusing situation.”"
  ];
  const [randomQuote] = useState(() => sarcasticNegativeQuotes[Math.floor(Math.random() * sarcasticNegativeQuotes.length)]);

  // Trigger audio based on alarm mode
  useEffect(() => {
    if (mode === 'positive') {
      soundEngine.playPositiveAlarm();
    } else if (mode === 'negative') {
      soundEngine.playNegativeAlarm();
    } else if (mode === 'group') {
      const hasPositive = groupStatuses.some(s => s.status === 'positive');
      if (hasPositive) {
        soundEngine.playPositiveAlarm();
      } else {
        soundEngine.playNegativeAlarm();
      }
    }
    
    // 15-second countdown
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      soundEngine.stopAlarm();
    };
  }, [mode, groupStatuses]);

  // Handle Volume Slider Gag (Volume forces to max if lowered)
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val < volumeValue) {
      setVolumeValue(100);
      soundEngine.setVolume(100);
      setVolumeGagText("NICE TRY! VOLUME INCREASING TO 100%");
      setTimeout(() => setVolumeGagText(null), 2500);
    } else {
      setVolumeValue(val);
      soundEngine.setVolume(val);
    }
  };

  // Handle Moving Mute Gag
  const handleMuteHoverOrTap = () => {
    const jokes = [
      "MUTE DENIED!",
      "ABSOLUTELY NOT.",
      "THE FOREHEAD MUST BE HEARD.",
      "THE SCALP SPEAKS AT MAX VOLUME.",
      "NO SILENCE ALLOWED!"
    ];
    setMuteGagText(jokes[Math.floor(Math.random() * jokes.length)]);
    setMuteButtonOffset({
      x: (Math.random() - 0.5) * 120,
      y: (Math.random() - 0.5) * 80
    });
    setTimeout(() => setMuteGagText(null), 2000);
  };

  const handleToggleMute = () => {
    const mutedNow = soundEngine.toggleMute();
    setIsMutedLocal(mutedNow);
  };

  const isLocked = timeLeft > 0;

  const handleFinishAlarm = () => {
    soundEngine.stopAlarm();
    onStopAlarm();
    onProceed();
  };

  const isNegativeMode = mode === 'negative';
  const isGroupMode = mode === 'group';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className={`w-full max-w-lg glass-card border-2 ${
        isNegativeMode
          ? 'border-emerald-500 glow-emerald'
          : isGroupMode
          ? 'border-cyan-500 glow-cyan'
          : 'border-red-500 glow-red'
      } rounded-3xl p-6 sm:p-8 text-center text-slate-100 shadow-2xl space-y-6 relative overflow-hidden my-auto`}>
        
        {/* Pulsing Alert Icon */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner ${
          isNegativeMode
            ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/50'
            : isGroupMode
            ? 'bg-cyan-600/30 text-cyan-400 border border-cyan-500/50'
            : 'bg-red-600/30 text-red-500 border border-red-500/50'
        }`}>
          {isNegativeMode ? (
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          ) : isGroupMode ? (
            <Users className="w-10 h-10 animate-bounce" />
          ) : (
            <AlertOctagon className="w-10 h-10 animate-bounce" />
          )}
        </div>

        {/* 1. POSITIVE EMERGENCY SCREEN */}
        {!isNegativeMode && !isGroupMode && (
          <>
            <div className="space-y-1">
              <div className="inline-block px-3 py-1 bg-red-600 text-white font-mono text-xs font-black rounded-full uppercase tracking-widest shadow-md">
                🚨 MOTTATHALA EMERGENCY DETECTED 🚨
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-red-500 tracking-tight pt-2">
                FOREHEAD CONDITIONS HAVE ESCALATED
              </h3>
              <p className="text-xs font-semibold text-slate-300">
                Certified Subject: <span className="text-white font-extrabold">{name}</span>
              </p>
            </div>

            <div className="p-5 bg-slate-950/90 rounded-2xl border border-red-500/40 space-y-2 shadow-inner">
              <div className="text-[10px] uppercase font-mono text-slate-400">MOTTATHALA INDEX™ EMERGENCY THRESHOLD EXCEEDED</div>
              <div className="text-6xl font-black text-red-500 font-mono tracking-tighter">
                {score} / 100
              </div>
              <div className="text-[11px] font-bold text-red-400">
                Immediate scientific attention may be required. “We have a situation.”
              </div>
            </div>
          </>
        )}

        {/* 2. NEGATIVE EMERGENCY SCREEN */}
        {isNegativeMode && (
          <>
            <div className="space-y-1.5">
              <div className="inline-block px-3 py-1 bg-emerald-600 text-white font-mono text-xs font-black rounded-full uppercase tracking-widest shadow-md animate-pulse">
                🚨 NEGATIVE MOTTATHALA EMERGENCY 🚨
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight pt-1">
                MOTTATHALA NOT DETECTED
              </h3>
              <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-500/30 inline-block">
                THIS IS NOT A DRILL
              </div>
            </div>

            <div className="p-5 bg-slate-950/90 rounded-2xl border border-emerald-500/40 space-y-3 shadow-inner text-left font-mono">
              <div className="text-[11px] text-slate-300 space-y-1">
                <p>• We investigated the forehead.</p>
                <p>• We found nothing.</p>
                <p className="text-emerald-400 font-bold">• This is highly unusual.</p>
              </div>

              <div className="p-2.5 bg-emerald-600/20 border border-emerald-500/40 rounded-xl text-center">
                <div className="text-xs font-black text-emerald-300 uppercase">
                  🚨 NEGATIVE MOTTATHALA ALERT 🚨
                </div>
                <div className="text-[11px] text-slate-200 mt-0.5">
                  The subject appears to have escaped the unnecessary condition entirely.
                </div>
              </div>

              <div className="text-[11px] italic text-amber-300 text-center font-serif pt-1">
                {randomQuote}
              </div>

              <div className="pt-2 border-t border-emerald-500/20 space-y-1 text-[10px] text-slate-400">
                <p className="font-bold text-emerald-400 uppercase">🚨 ATTENTION REQUIRED 🚨</p>
                <p>MOTTATHALA HAS FAILED TO MATERIALIZE.</p>
                <p>Repeat: Mottathala has failed to materialize.</p>
                <p>The investigation has produced an unexpectedly positive result.</p>
                <p>Authorities have been informed.</p>
                <p className="text-[9px] text-slate-500 italic">(No authorities were actually informed.)</p>
              </div>
            </div>
          </>
        )}

        {/* 3. GROUP FOREHEAD STATUS SCREEN */}
        {isGroupMode && (
          <>
            <div className="space-y-1">
              <div className="inline-block px-3 py-1 bg-cyan-600 text-white font-mono text-xs font-black rounded-full uppercase tracking-widest shadow-md">
                🚨 GROUP FOREHEAD STATUS 🚨
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight pt-1">
                MULTI-SUBJECT EMERGENCY ROSTER
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Independent forehead evaluation across all detected subjects.
              </p>
            </div>

            <div className="p-4 bg-slate-950/90 rounded-2xl border border-cyan-500/40 space-y-2.5 text-left font-mono max-h-60 overflow-y-auto shadow-inner">
              {groupStatuses.map((subject, idx) => (
                <div
                  key={subject.personId || idx}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 font-bold text-white">
                    {subject.status === 'positive' && <span className="text-red-500">🔴</span>}
                    {subject.status === 'negative' && <span className="text-emerald-400">🟢</span>}
                    {subject.status === 'insufficient' && <span className="text-slate-400">⚪</span>}
                    <span>{subject.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <span className="font-mono text-slate-300 font-bold">{subject.score}/100</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      subject.status === 'positive'
                        ? 'bg-red-600/30 text-red-400 border border-red-500/30'
                        : subject.status === 'negative'
                        ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {subject.status === 'positive' ? 'MOTTATHALA EMERGENCY' : subject.status === 'negative' ? 'NEGATIVE EMERGENCY' : 'INSUFFICIENT'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 15-Second Broadcast Timer Progress */}
        <div className="space-y-1.5 text-left">
          <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
            <span>EMERGENCY BROADCAST TIMER:</span>
            <span>{timeLeft > 0 ? `${timeLeft}s REMAINING` : 'BROADCAST COMPLETE'}</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-900 border border-white/20 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                isNegativeMode ? 'bg-emerald-500' : 'bg-red-600'
              }`}
              style={{ width: `${(timeLeft / 15) * 100}%` }}
            />
          </div>
        </div>

        {/* Gag Controls: Gag Volume Slider & Dodging Mute Button */}
        <div className="p-4 bg-slate-900/90 rounded-2xl border border-white/10 space-y-4 text-left relative">
          
          {/* Volume Slider Gag */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
              <span className="flex items-center gap-1">
                <Volume2 size={14} className={isNegativeMode ? "text-emerald-400" : "text-red-400"} /> ALARM VOLUME:
              </span>
              <span className={isNegativeMode ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>{volumeValue}%</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="100"
              value={volumeValue}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />

            {volumeGagText && (
              <p className="text-[11px] font-mono font-bold text-yellow-400 bg-red-600/30 p-1.5 rounded text-center border border-red-500/30 animate-shake">
                {volumeGagText}
              </p>
            )}
          </div>

          {/* Dodging Mute Button Gag */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10 relative h-12">
            <span className="text-xs font-mono text-slate-400">MUTE CONTROL:</span>

            <motion.button
              animate={{ x: muteButtonOffset.x, y: muteButtonOffset.y }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onMouseEnter={handleMuteHoverOrTap}
              onClick={() => {
                handleMuteHoverOrTap();
                handleToggleMute();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-red-600/30 border border-red-500/50 text-red-300 font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-red-600/50"
            >
              {isMutedLocal ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{isMutedLocal ? 'UNMUTE ALARM' : 'MUTE ALARM'}</span>
            </motion.button>

            {muteGagText && (
              <div className="absolute right-0 -top-8 bg-red-600 text-white font-mono text-[10px] px-2.5 py-1 rounded-full shadow-lg border border-red-400 animate-bounce">
                {muteGagText}
              </div>
            )}
          </div>

        </div>

        {/* Action Buttons: STOP ALARM / VIEW RESULTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              soundEngine.stopAlarm();
              onStopAlarm();
            }}
            className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs tracking-wider uppercase border border-white/10 flex items-center justify-center gap-2 transition-all"
          >
            <span>STOP ALARM</span>
          </button>

          <button
            onClick={handleFinishAlarm}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs tracking-wider uppercase shadow-xl flex items-center justify-center gap-2 transition-all ${
              isNegativeMode
                ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-red-600/30'
            }`}
          >
            <span>VIEW RESULTS</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="text-[10px] font-mono text-slate-500 italic pt-1">
          Entertainment-only forehead emergency notification system. No medical diagnostic conclusions.
        </div>

      </div>
    </div>
  );
};
