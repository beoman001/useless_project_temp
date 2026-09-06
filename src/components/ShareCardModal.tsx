import React, { useState } from 'react';
import { AnalysisRecord } from '../types/mottathala';
import { Download, Share2, X, Check, Copy } from 'lucide-react';
import { downloadMottathalaCertificate } from '../utils/certificateExport';
import { soundEngine } from '../utils/soundEngine';

interface ShareCardModalProps {
  record: AnalysisRecord;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ record, onClose }) => {
  const [copied, setCopied] = useState(false);

  const shareText = `🧑‍🦲 MOTTATHALA FINDER™ REPORT\nSUBJECT: ${record.user.name}\nKASHANDI INDEX: ${record.score}/100\nCLASSIFICATION: ${record.classification}\nROAST: "${record.roast}"\n\nAnalyzed by MOTTATHALA FINDER™ — The World's Most Unnecessary Forehead Intelligence System.`;

  const handleShare = async () => {
    soundEngine.playBeep();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MOTTATHALA FINDER™ Diagnostic Report',
          text: shareText,
          url: window.location.href
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    soundEngine.playFanfare();
    downloadMottathalaCertificate(record);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border-2 border-red-500/60 rounded-3xl p-6 text-slate-100 shadow-2xl relative overflow-hidden space-y-5">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-1">
          <div className="text-3xl mb-1">🧑‍🦲</div>
          <h3 className="text-2xl font-black tracking-tight text-white">
            SHARE DIAGNOSTIC REPORT
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            MOTTATHALA FINDER™ OFFICIAL ARCHIVE
          </p>
        </div>

        {/* Shareable Card Frame */}
        <div className="border border-white/10 rounded-2xl p-4 bg-black/60 space-y-3 text-left shadow-inner">
          <div className="flex justify-between items-start border-b border-white/10 pb-2">
            <div>
              <span className="font-extrabold text-sm text-red-500 block">{record.user.name}</span>
              <span className="text-[10px] font-mono text-slate-400">ID: {record.id}</span>
            </div>
            <span className="px-2.5 py-1 bg-red-500/20 text-red-400 font-bold text-xs rounded-full border border-red-500/30">
              {record.score} / 100
            </span>
          </div>

          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Classification:</span>
              <span className="font-bold text-yellow-400">{record.classification}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Forehead Ratio:</span>
              <span className="font-bold text-slate-200">{record.metrics.foreheadRatio}</span>
            </div>
          </div>

          <p className="text-xs italic text-slate-300 bg-white/5 p-2.5 rounded-lg border border-white/5">
            “{record.roast}”
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-yellow-300 flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
            <span>{copied ? 'COPIED TO CLIPBOARD' : 'SHARE REPORT'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all"
          >
            <Download size={16} />
            <span>DOWNLOAD PNG</span>
          </button>
        </div>

      </div>
    </div>
  );
};
