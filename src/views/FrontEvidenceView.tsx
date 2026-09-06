import React from 'react';
import { motion } from 'framer-motion';
import { CameraUploader } from '../components/CameraUploader';

interface FrontEvidenceViewProps {
  onCaptureFront: (url: string) => void;
}

export const FrontEvidenceView: React.FC<FrontEvidenceViewProps> = ({ onCaptureFront }) => {
  const samples = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-lg glass-card border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
    >
      <div className="text-center mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-red-500">Step 02 / Front Evidence</span>
      </div>

      <CameraUploader
        title="Front-Facing Photograph"
        description="Please provide a clear front-facing head photograph for forehead-region geometry calculation."
        onCapture={onCaptureFront}
        presetSamples={samples}
      />
    </motion.div>
  );
};
