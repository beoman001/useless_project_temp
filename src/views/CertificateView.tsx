import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisRecord } from '../types/mottathala';
import { Award, Download, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { downloadMottathalaCertificate } from '../utils/certificateExport';
import { soundEngine } from '../utils/soundEngine';

interface CertificateViewProps {
  result: AnalysisRecord;
  onReturn: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ result, onReturn }) => {
  const handleDownload = () => {
    soundEngine.playFanfare();
    downloadMottathalaCertificate(result);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-lg glass-card border-2 border-blue-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-2xl relative overflow-hidden my-auto"
    >
      
      {/* Decorative Gold & Blue Certificate Seal */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-500 to-amber-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/30 border-2 border-white/20">
        <Award size={40} />
      </div>

      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-cyan-400 text-xs font-mono font-bold border border-blue-500/20">
          <ShieldCheck size={14} className="text-emerald-400" /> VERIFIED BY SCIENCE™
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight pt-1">
          OFFICIAL MOTTATHALA CERTIFICATE™
        </h3>
        <p className="text-[11px] text-slate-400 uppercase font-mono tracking-widest">
          INTERNATIONAL INSTITUTE OF UNNECESSARY FOREHEAD RESEARCH
        </p>
      </div>

      {/* Certificate Framed Inner Box */}
      <div className="border border-blue-500/30 rounded-2xl p-5 bg-slate-950/80 space-y-4 text-left shadow-inner">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">This certifies that subject:</span>
          <h4 className="text-2xl font-black text-white uppercase tracking-wide">
            {result.user.name}
          </h4>
          <p className="text-[11px] text-slate-400 font-mono italic">
            has voluntarily submitted their forehead to a completely unnecessary investigation.
          </p>
        </div>

        <div className="p-3.5 bg-blue-600/20 border border-blue-500/40 rounded-xl text-center space-y-1">
          <div className="text-[10px] font-mono text-cyan-300 uppercase">REALITY-BASED BALDNESS CLASSIFICATION:</div>
          <div className="text-lg font-black text-emerald-400 font-mono">
            {result.visibleBaldnessStatus || '🟢 NOT VISIBLY BALD'}
          </div>
          <div className="text-xs font-bold text-amber-400 uppercase">
            {result.classification}
          </div>
        </div>

        <div className="flex justify-between items-center text-xs font-mono text-slate-300 pt-1">
          <span>Mottathala Index™: <strong className="text-amber-400">{result.score}/100</strong></span>
          <span className="opacity-60">ID: {result.id}</span>
        </div>

        <p className="text-xs italic text-cyan-200 border-t border-white/10 pt-3 text-center">
          “{result.roast}”
        </p>

        <div className="text-[9px] font-mono text-slate-500 text-center border-t border-white/10 pt-2 space-y-0.5">
          <p>This certificate confirms that the subject willingly participated in completely unnecessary research.</p>
          <p className="italic text-slate-400">This document has absolutely no medical, legal, academic, governmental, financial, or practical value whatsoever. Please keep it anyway.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => {
            soundEngine.playBeep();
            onReturn();
          }}
          className="py-3.5 rounded-2xl border border-blue-500/30 hover:bg-blue-500/10 text-slate-200 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
        >
          <ArrowLeft size={16} />
          <span>BACK TO REPORT</span>
        </button>

        <button
          onClick={handleDownload}
          className="py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-1.5 hover:scale-102"
        >
          <Download size={16} />
          <span>DOWNLOAD CERTIFICATE</span>
        </button>
      </div>

    </motion.div>
  );
};
