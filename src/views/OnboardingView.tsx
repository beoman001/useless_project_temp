import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, User, Tag, Calendar, MapPin } from 'lucide-react';
import { UserProfile } from '../types/mottathala';
import { soundEngine } from '../utils/soundEngine';

interface OnboardingViewProps {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ initialProfile, onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState(initialProfile.name || '');
  const [nickname, setNickname] = useState(initialProfile.nickname || '');
  const [age, setAge] = useState(initialProfile.age || '');
  const [location, setLocation] = useState(initialProfile.location || '');

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && !name.trim()) return;
    soundEngine.playBeep();

    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        age: age.trim() || undefined,
        location: location.trim() || undefined
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-md glass-card border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6"
    >
      
      {/* Progress Indicator */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <span className="text-xs font-mono font-extrabold text-red-500 uppercase tracking-widest">
          SUBJECT ONBOARDING
        </span>
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
          0{step} / 03
        </span>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Let's get some completely unnecessary information about you.
        </h2>
      </div>

      <form onSubmit={handleNextStep} className="space-y-5">
        
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider mb-2 text-slate-400 flex items-center gap-1.5">
                <User size={14} className="text-red-500" /> Subject Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Doe"
                className="w-full px-4 py-3.5 rounded-xl bg-black/30 border border-white/10 focus:border-red-500 outline-none font-medium text-slate-100"
              />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider mb-2 text-slate-400 flex items-center gap-1.5">
                <Tag size={14} className="text-red-500" /> Optional Alias / Nickname
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Shiny Cap"
                className="w-full px-4 py-3.5 rounded-xl bg-black/30 border border-white/10 focus:border-red-500 outline-none font-medium text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider mb-2 text-slate-400 flex items-center gap-1.5">
                <Calendar size={14} className="text-red-500" /> Optional Age
              </label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 28"
                className="w-full px-4 py-3.5 rounded-xl bg-black/30 border border-white/10 focus:border-red-500 outline-none font-medium text-slate-100"
              />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider mb-2 text-slate-400 flex items-center gap-1.5">
                <MapPin size={14} className="text-red-500" /> Optional Location / Jurisdiction
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New York, USA"
                className="w-full px-4 py-3.5 rounded-xl bg-black/30 border border-white/10 focus:border-red-500 outline-none font-medium text-slate-100"
              />
            </div>
          </motion.div>
        )}

        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs tracking-widest uppercase shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102"
        >
          <span>{step === 3 ? 'PROCEED TO EVIDENCE UPLOAD' : 'CONTINUE'}</span>
          <ChevronRight size={18} />
        </button>

      </form>

    </motion.div>
  );
};
