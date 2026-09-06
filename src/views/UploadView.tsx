import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Users, Sparkles, ArrowLeft } from 'lucide-react';
import { CameraUploader } from '../components/CameraUploader';
import { soundEngine } from '../utils/soundEngine';

interface UploadViewProps {
  onConfirmSingle: (frontUrl: string, backUrl: string) => void;
  onConfirmGroup: () => void;
  onBack: () => void;
  devMode?: boolean;
}

export const UploadView: React.FC<UploadViewProps> = ({ onConfirmSingle, onConfirmGroup, onBack, devMode }) => {
  const [activeSubMode, setActiveSubMode] = useState<'SELECT' | 'FRONT' | 'BACK'>('SELECT');
  const [frontPhotoUrl, setFrontPhotoUrl] = useState<string | null>(null);

  const samples = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  ];

  const handleFrontComplete = (url: string) => {
    setFrontPhotoUrl(url);
    // Proceed to single analysis with front photo
    onConfirmSingle(url, url);
  };

  const handleBackComplete = (url: string) => {
    const fUrl = frontPhotoUrl || url;
    onConfirmSingle(fUrl, url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            soundEngine.playBeep();
            if (activeSubMode !== 'SELECT') setActiveSubMode('SELECT');
            else onBack();
          }}
          className="px-3.5 py-1.5 rounded-2xl border border-blue-500/30 hover:bg-blue-500/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
          EVIDENCE SUBMISSION
        </span>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Show us the evidence.
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Upload or capture a photograph of your forehead. We judge it scientifically.
        </p>
      </div>

      {activeSubMode === 'SELECT' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          
          <button
            onClick={() => {
              soundEngine.playBeep();
              setActiveSubMode('FRONT');
            }}
            className="p-6 rounded-3xl glass-card border border-blue-500/30 hover:border-cyan-400 hover:scale-102 transition-all text-center space-y-3 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-600/15 text-cyan-400 border border-blue-500/30 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Camera size={26} />
            </div>
            <h3 className="font-bold text-base text-slate-100">FRONT HEAD PHOTO</h3>
            <p className="text-xs text-slate-400">For forehead-to-face geometry & hairline calculation.</p>
          </button>

          <button
            onClick={() => {
              soundEngine.playBeep();
              setActiveSubMode('BACK');
            }}
            className="p-6 rounded-3xl glass-card border border-blue-500/30 hover:border-cyan-400 hover:scale-102 transition-all text-center space-y-3 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-600/15 text-cyan-400 border border-blue-500/30 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Camera size={26} />
            </div>
            <h3 className="font-bold text-base text-slate-100">CROWN & BACK PHOTO</h3>
            <p className="text-xs text-slate-400">For scalp visibility & rear coverage measurement.</p>
          </button>

          <button
            onClick={() => {
              soundEngine.playBeep();
              onConfirmGroup();
            }}
            className="p-6 rounded-3xl glass-card border border-blue-500/30 hover:border-cyan-400 hover:scale-102 transition-all text-center space-y-3 group bg-blue-600/10"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
              <Users size={26} />
            </div>
            <h3 className="font-bold text-base text-cyan-300">GROUP PHOTO SCAN</h3>
            <p className="text-xs text-slate-400">Analyze every person in a multi-person photo.</p>
          </button>

        </div>
      )}

      {activeSubMode === 'FRONT' && (
        <CameraUploader
          title="FRONT FOREHEAD PHOTO"
          description="Capture or upload a clear front face photograph."
          onCapture={handleFrontComplete}
          presetSamples={samples}
          devMode={devMode}
        />
      )}

      {activeSubMode === 'BACK' && (
        <CameraUploader
          title="CROWN & BACK PHOTO"
          description="Capture or upload a rear/top scalp photograph."
          onCapture={handleBackComplete}
          presetSamples={samples}
          devMode={devMode}
        />
      )}

    </motion.div>
  );
};
