import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, User, Tag } from 'lucide-react';
import { UserProfile } from '../types/kashandi';
import { soundEngine } from '../utils/soundEngine';

interface ProfileViewProps {
  initialProfile: UserProfile;
  onConfirm: (profile: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ initialProfile, onConfirm }) => {
  const [name, setName] = useState(initialProfile.name || '');
  const [nickname, setNickname] = useState(initialProfile.nickname || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    soundEngine.playBeep();
    onConfirm({
      name: name.trim(),
      nickname: nickname.trim() || undefined
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-md glass-card border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl"
    >
      <div className="space-y-2 mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-red-500">Step 01 / Profile</span>
        <h3 className="text-2xl font-bold">Identify the Subject</h3>
        <p className="text-sm opacity-60">Enter subject information for formal logging into the KASHANDI RESEARCH AUTHORITY™ database.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80 flex items-center gap-1.5">
            <User size={14} className="text-red-500" /> Subject Legal/Common Name *
          </label>
          <input 
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Doe"
            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-red-500 outline-none transition-all font-medium text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80 flex items-center gap-1.5">
            <Tag size={14} className="text-red-500" /> Subject Alias / Nickname (Optional)
          </label>
          <input 
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="e.g. Shiny Cap"
            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-red-500 outline-none transition-all font-medium text-slate-100 text-sm"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold tracking-wide shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 mt-6"
        >
          <span>CONFIRM IDENTITY</span>
          <ChevronRight size={18} />
        </button>
      </form>
    </motion.div>
  );
};
