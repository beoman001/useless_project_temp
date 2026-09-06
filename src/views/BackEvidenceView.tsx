import React from 'react';
import { motion } from 'framer-motion';
import { CameraUploader } from '../components/CameraUploader';

interface BackEvidenceViewProps {
  onCaptureBack: (url: string) => void;
}

export const BackEvidenceView: React.FC<BackEvidenceViewProps> = ({ onCaptureBack }) => {
  const samples = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-lg glass-card border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
    >
      <div className="text-center mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-red-500">Step 03 / Rear Evidence</span>
      </div>

      <CameraUploader
        title="Rear Head Photograph"
        description="We now require evidence from the opposite side of the investigation to measure crown stability."
        onCapture={onCaptureBack}
        presetSamples={samples}
      />
    </motion.div>
  );
};
