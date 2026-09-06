import React, { useState } from 'react';
import { AppState } from '../types/mottathala';
import { Volume2, VolumeX, Sun, Moon, Menu, X, Award, History, Trophy, Info, Camera, Terminal, Settings } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface NavbarProps {
  activeState: AppState;
  onNavigate: (state: AppState) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  muted: boolean;
  toggleMute: () => void;
  devMode: boolean;
  toggleDevMode: () => void;
  resetApp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeState,
  onNavigate,
  theme,
  toggleTheme,
  muted,
  toggleMute,
  devMode,
  toggleDevMode,
  resetApp
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [muteHoverOffset, setMuteHoverOffset] = useState({ x: 0, y: 0 });
  const [jokeTooltip, setJokeTooltip] = useState<string | null>(null);

  const handleMuteHover = () => {
    const jokes = [
      "Mute before scalp reflects light!",
      "Volume escaping through forehead!",
      "Warning: Scalp audio active!",
      "Mute button dodging reflection!"
    ];
    setJokeTooltip(jokes[Math.floor(Math.random() * jokes.length)]);
    setMuteHoverOffset({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 10
    });
  };

  const handleMuteLeave = () => {
    setMuteHoverOffset({ x: 0, y: 0 });
    setJokeTooltip(null);
  };

  const navItems: { label: string; state: AppState; icon: React.ReactNode }[] = [
    { label: 'Scan', state: 'upload', icon: <Camera size={14} /> },
    { label: 'History', state: 'history', icon: <History size={14} /> },
    { label: 'Leaderboard', state: 'leaderboard', icon: <Trophy size={14} /> },
    { label: 'Certificates', state: 'certificate', icon: <Award size={14} /> },
    { label: 'Settings', state: 'settings', icon: <Settings size={14} /> },
    { label: 'About', state: 'about', icon: <Info size={14} /> },
  ];

  return (
    <header className="w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-white/10 dark:border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#0B0B0C]/80">
      
      {/* Brand Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer group select-none"
        onClick={() => {
          soundEngine.playBeep();
          resetApp();
        }}
      >
        <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
          MF
        </div>
        <div>
          <h1 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5 text-slate-100">
            MOTTATHALA FINDER™
          </h1>
          <p className="text-[10px] opacity-60 tracking-wider uppercase font-mono hidden md:block">
            The World's Most Unnecessary Forehead Intelligence System
          </p>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
        {navItems.map((item) => (
          <button
            key={item.state}
            onClick={() => {
              soundEngine.playBeep();
              onNavigate(item.state);
            }}
            className={`text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-colors ${
              activeState === item.state
                ? 'text-red-500 font-extrabold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Controls: Dev Mode, Moving Mute, Theme, Hamburger */}
      <div className="flex items-center gap-2">
        
        {/* Dev Mode Toggle Switch */}
        <button
          onClick={() => {
            soundEngine.playBeep();
            toggleDevMode();
          }}
          className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold border transition-colors flex items-center gap-1 ${
            devMode
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
          }`}
          title="Toggle Computer Vision Dev/Debug Inspector"
        >
          <Terminal size={12} />
          <span>DEV MODE {devMode ? 'ON' : 'OFF'}</span>
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
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-100 transition-transform duration-200"
            aria-label={muted ? "Unmute audio" : "Mute audio"}
          >
            {muted ? <VolumeX size={18} className="text-red-400" /> : <Volume2 size={18} className="text-emerald-400" />}
          </button>

          {jokeTooltip && (
            <div className="absolute right-0 top-10 whitespace-nowrap px-2 py-1 bg-red-600 text-white font-mono text-[10px] rounded shadow-lg border border-red-400 pointer-events-none z-50 animate-bounce">
              {jokeTooltip}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-white/10 text-slate-300 transition-colors"
          aria-label={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-700" />}
        </button>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-white/10"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-[#0B0B0C] border-b border-white/10 p-6 space-y-4 shadow-2xl z-50 animate-fadeIn">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.state}
                onClick={() => {
                  soundEngine.playBeep();
                  setMobileMenuOpen(false);
                  onNavigate(item.state);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold ${
                  activeState === item.state
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

    </header>
  );
};
