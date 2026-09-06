import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Volume2, VolumeX, Bell, BellOff, Sliders, ArrowLeft, Play, ShieldAlert, CheckCircle2, RotateCcw, Trash2 } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { storage } from '../utils/storage';

interface SettingsViewProps {
  onReturn: () => void;
  onTestPositiveAlarm: () => void;
  onTestNegativeAlarm: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onReturn,
  onTestPositiveAlarm,
  onTestNegativeAlarm
}) => {
  const [alarmEnabled, setAlarmEnabled] = useState<boolean>(() => {
    return localStorage.getItem('mottathala_alarm_enabled') !== 'false';
  });

  const [threshold, setThreshold] = useState<number>(() => {
    return Number(localStorage.getItem('mottathala_alarm_threshold') || '80');
  });

  const [volume, setVolumeState] = useState<number>(() => {
    return soundEngine.getVolume();
  });

  const [muted, setMutedState] = useState<boolean>(() => {
    return soundEngine.isMuted();
  });

  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleToggleAlarmEnabled = () => {
    const next = !alarmEnabled;
    setAlarmEnabled(next);
    localStorage.setItem('mottathala_alarm_enabled', String(next));
    showMsg(next ? "Emergency Alarm System ENABLED" : "Emergency Alarm System DISABLED");
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setThreshold(val);
    localStorage.setItem('mottathala_alarm_threshold', String(val));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolumeState(val);
    soundEngine.setVolume(val);
  };

  const handleToggleMute = () => {
    const isMutedNow = soundEngine.toggleMute();
    setMutedState(isMutedNow);
    showMsg(isMutedNow ? "Audio Muted" : "Audio Unmuted");
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all stored forehead scan history?")) {
      storage.clearAllRecords();
      showMsg("History cleared successfully.");
    }
  };

  const showMsg = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-2xl glass-card border-2 border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6 bg-slate-900/90 text-slate-100"
    >
      
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            soundEngine.playBeep();
            onReturn();
          }}
          className="px-3.5 py-1.5 rounded-2xl border border-blue-500/30 hover:bg-blue-500/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-cyan-400 text-xs font-mono font-bold border border-blue-500/20">
          <Settings size={14} /> SYSTEM CONFIGURATION
        </div>
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-3xl font-black text-slate-100 tracking-tight">
          ALARM & SYSTEM SETTINGS
        </h3>
        <p className="text-xs text-slate-400 font-mono">
          Configure the Emergency Mottathala Alarm™, volume controls, thresholds, and data persistence.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-center font-mono text-xs font-bold animate-fadeIn">
          {statusMsg}
        </div>
      )}

      {/* Alarm Settings Panel */}
      <div className="space-y-4 bg-slate-950/80 p-5 rounded-2xl border border-white/10 shadow-inner">
        <div className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-2">
          <Bell size={16} /> Emergency Alarm Preferences
        </div>

        {/* Alarm Enable / Disable Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <div>
            <div className="text-sm font-bold text-white">Emergency Alarm System</div>
            <div className="text-xs text-slate-400">Trigger comedic alarm when scan analysis completes</div>
          </div>
          <button
            onClick={handleToggleAlarmEnabled}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all ${
              alarmEnabled
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'bg-slate-800 text-slate-400 border border-white/10'
            }`}
          >
            {alarmEnabled ? <Bell size={14} /> : <BellOff size={14} />}
            <span>{alarmEnabled ? 'ENABLED' : 'DISABLED'}</span>
          </button>
        </div>

        {/* Mottathala Alarm Threshold Slider */}
        <div className="space-y-1.5 py-2 border-b border-white/10">
          <div className="flex justify-between text-xs font-mono font-bold">
            <span className="text-slate-300">ALARM THRESHOLD:</span>
            <span className="text-red-400 font-bold">{threshold} / 100</span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            value={threshold}
            onChange={handleThresholdChange}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <div className="text-[10px] text-slate-400 font-mono">
            Scans with score ≥ {threshold} trigger 🔴 Positive Emergency. Scans with score &lt; {threshold} trigger 🟢 Negative Emergency.
          </div>
        </div>

        {/* Alarm Volume Slider */}
        <div className="space-y-1.5 py-2 border-b border-white/10">
          <div className="flex justify-between text-xs font-mono font-bold">
            <span className="text-slate-300 flex items-center gap-1">
              <Volume2 size={14} className="text-cyan-400" /> ALARM VOLUME:
            </span>
            <span className="text-cyan-400 font-bold">{volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Global Mute Toggle */}
        <div className="flex items-center justify-between py-1">
          <div className="text-xs font-bold text-slate-300">Global Audio Mute</div>
          <button
            onClick={handleToggleMute}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 border transition-all ${
              muted
                ? 'bg-red-600/20 text-red-400 border-red-500/50'
                : 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50'
            }`}
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{muted ? 'MUTED' : 'ACTIVE'}</span>
          </button>
        </div>

      </div>

      {/* Alarm Test Center */}
      <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-white/10 shadow-inner">
        <div className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider flex items-center gap-2">
          <Play size={16} /> Test Emergency Alarms
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Verify alarm sounds and emergency modal screens directly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={onTestPositiveAlarm}
            className="py-3 px-4 rounded-2xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-400 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <ShieldAlert size={16} />
            <span>TEST 🔴 POSITIVE ALARM</span>
          </button>

          <button
            onClick={onTestNegativeAlarm}
            className="py-3 px-4 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <CheckCircle2 size={16} />
            <span>TEST 🟢 NEGATIVE ALARM</span>
          </button>
        </div>
      </div>

      {/* Data Maintenance */}
      <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-white">Browser Local Storage</div>
          <div className="text-[10px] text-slate-400">Clear saved forehead scan history and records</div>
        </div>

        <button
          onClick={handleClearHistory}
          className="px-3.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold font-mono flex items-center gap-1.5 transition-all"
        >
          <Trash2 size={14} /> Clear History
        </button>
      </div>

    </motion.div>
  );
};
