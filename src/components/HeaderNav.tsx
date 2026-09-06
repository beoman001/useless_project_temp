import React, { useState } from 'react';
import { Volume2, VolumeX, Sun, Moon, History } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface HeaderNavProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  muted: boolean;
  toggleMute: () => void;
  resetApp: () => void;
  onOpenHistory: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  theme,
  toggleTheme,
  muted,
  toggleMute,
  resetApp,
  onOpenHistory
}) => {
  const [muteHoverOffset, setMuteHoverOffset] = useState({ x: 0, y: 0 });
  const [jokeTooltip, setJokeTooltip] = useState<string | null>(null);

  // Moving mute volume joke micro-interaction
  const handleMuteHover = () => {
    const jokes = [
      "Mute before scalp reflects light!",
      "Volume escaping through forehead!",
      "Warning: Scalp audio active!",
      "Mute button dodging reflection!"
    ];
    setJokeTooltip(jokes[Math.floor(Math.random() * jokes.length)]);
    
    // Jump randomly slightly on hover for comedic volume joke
    const randomX = (Math.random() - 0.5) * 16;
    const randomY = (Math.random() - 0.5) * 10;
    setMuteHoverOffset({ x: randomX, y: randomY });
  };

  const handleMuteLeave = () => {
    setMuteHoverOffset({ x: 0, y: 0 });
    setJokeTooltip(null);
  };

  return (
    <header className="w-full px-4 sm:px-6 py-4 flex items-center justify-between border-b border-white/10 dark:border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#0B0B0C]/80">
      
      {/* Brand Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer group select-none"
        onClick={() => {
          soundEngine.playBeep();
          resetApp();
        }}
      >
        <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-extrabold text-sm tracking-tighter shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
          MF
        </div>
        <div>
          <h1 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5 text-slate-100">
            MOTTATHALA FINDER™
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
              v3.0
            </span>
          </h1>
          <p className="text-[10px] opacity-60 tracking-wider uppercase font-medium text-slate-400 hidden sm:block">
            The World's Most Unnecessary Forehead Intelligence System
          </p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        
        {/* History Button */}
        <button
          onClick={() => {
            soundEngine.playBeep();
            onOpenHistory();
          }}
          className="px-3 py-1.5 text-xs rounded-full border border-white/10 hover:border-white/30 text-slate-300 transition-all font-semibold flex items-center gap-1.5 hover:bg-white/5"
        >
          <History size={14} className="text-yellow-400" />
          <span className="hidden sm:inline">History</span>
        </button>

        {/* Moving Mute Volume Joke Button */}
        <div className="relative">
          <button
            onMouseEnter={handleMuteHover}
            onMouseLeave={handleMuteLeave}
            onClick={() => {
              toggleMute();
              soundEngine.playBeep();
            }}
            style={{
              transform: `translate(${muteHoverOffset.x}px, ${muteHoverOffset.y}px)`
            }}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-100 transition-transform duration-200 relative"
            title={muted ? "Unmute Audio" : "Mute Audio"}
          >
            {muted ? <VolumeX size={18} className="text-red-400" /> : <Volume2 size={18} className="text-emerald-400" />}
          </button>

          {jokeTooltip && (
            <div className="absolute right-0 top-10 whitespace-nowrap px-2.5 py-1 bg-red-600 text-white font-mono text-[10px] rounded shadow-lg border border-red-400 pointer-events-none z-50 animate-bounce">
              {jokeTooltip}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="px-3 py-1 text-xs rounded-full border border-white/10 hover:border-white/30 text-slate-300 transition-all font-medium flex items-center gap-1.5 hover:bg-white/5"
        >
          {theme === 'dark' ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} className="text-slate-700" />}
          <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

      </div>

    </header>
  );
};
